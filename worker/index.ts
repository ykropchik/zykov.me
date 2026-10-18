/**
 * Receives the batches sent by src/misc/Analytics.ts and writes them to D1.
 *
 * The endpoint is public, so the checks cannot keep anyone out; they only make a
 * flood cheap to absorb, cheapest first. The rate limit costs no D1 at all,
 * validation drops anything the site itself could not have sent, and the daily
 * budget caps how much of D1's free write limit a flood can spend — past it,
 * events are dropped silently until the day rolls over.
 *
 * An unknown event is dropped on its own rather than failing the batch: a tab
 * still running the previous deploy may send names that have since been retired.
 *
 * Events are kept forever, but a weekly cron strips the visitor and session ids
 * from those older than half a year: the counts stay, the link to a person goes.
 */
import { isKnownEvent } from '../src/misc/analyticsEvents.ts';

const MAX_BODY_BYTES = 32 * 1024;
const MAX_EVENTS = 100;
/** Under a third of D1's free 100k written rows a day: the budget row is one more write per batch. */
const DAILY_EVENT_BUDGET = 30_000;
const MAX_PROPS = 10;
const MAX_STRING = 200;
const DAY_MS = 24 * 60 * 60 * 1000;
const ANONYMIZE_AFTER_MS = 180 * DAY_MS;
/** The budget only ever matters for today; older rows are kept a while just to look back at. */
const BUDGET_KEEP_MS = 30 * DAY_MS;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

type Props = Record<string, string | number | boolean>;

type IncomingEvent = {
	element: string;
	event: string;
	props?: Props;
	ts: number;
};

type Batch = {
	visitorId: string;
	sessionId: string;
	events: IncomingEvent[];
};

function status(code: number) {
	return new Response(null, { status: code });
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isProps(value: unknown): value is Props | undefined {
	if (value === undefined) {
		return true;
	}
	if (!isRecord(value)) {
		return false;
	}

	const entries = Object.entries(value);
	return entries.length <= MAX_PROPS && entries.every(([key, prop]) => key.length <= MAX_STRING && (
		typeof prop === 'boolean'
		|| (typeof prop === 'number' && Number.isFinite(prop))
		|| (typeof prop === 'string' && prop.length <= MAX_STRING)
	));
}

// `ts` is the client's clock, which can be off by any amount, so it is stored as
// sent and never judged; `received_at` is the time to trust.
function isEvent(value: unknown): value is IncomingEvent {
	return isRecord(value)
		&& typeof value.element === 'string'
		&& typeof value.event === 'string'
		&& isKnownEvent(value.element, value.event)
		&& typeof value.ts === 'number'
		&& Number.isFinite(value.ts)
		&& isProps(value.props);
}

function parseBatch(body: string): Batch | null {
	let value: unknown;
	try {
		value = JSON.parse(body);
	} catch {
		return null;
	}

	if (
		!isRecord(value)
		|| typeof value.visitorId !== 'string' || !UUID.test(value.visitorId)
		|| typeof value.sessionId !== 'string' || !UUID.test(value.sessionId)
		|| !Array.isArray(value.events) || value.events.length > MAX_EVENTS
	) {
		return null;
	}

	return { visitorId: value.visitorId, sessionId: value.sessionId, events: value.events.filter(isEvent) };
}

// Read by hand rather than with request.text(): Content-Length is optional, and
// without it text() would buffer whatever size the sender chose.
async function readBody(request: Request): Promise<string | null> {
	if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES || !request.body) {
		return null;
	}

	const reader = request.body.getReader();
	const decoder = new TextDecoder();
	let size = 0;
	let text = '';
	for (;;) {
		const { done, value } = await reader.read();
		if (done) {
			return text + decoder.decode();
		}
		size += value.byteLength;
		if (size > MAX_BODY_BYTES) {
			await reader.cancel();
			return null;
		}
		text += decoder.decode(value, { stream: true });
	}
}

function dayOf(time: number): string {
	return new Date(time).toISOString().slice(0, 10);
}

async function spendBudget(db: D1Database, day: string, events: number): Promise<boolean> {
	const spent = await db
		.prepare('INSERT INTO daily_budget (day, events) VALUES (?1, ?2) ON CONFLICT (day) DO UPDATE SET events = events + ?2 RETURNING events')
		.bind(day, events)
		.first<number>('events');

	return spent !== null && spent <= DAILY_EVENT_BUDGET;
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		if (url.pathname !== '/analytics') {
			return status(404);
		}
		if (request.method !== 'POST') {
			return status(405);
		}
		// Trivial to forge outside a browser, but it keeps other sites from having
		// their visitors' browsers post here.
		if (request.headers.get('Origin') !== url.origin) {
			return status(403);
		}

		const { success } = await env.RATE_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') ?? '' });
		if (!success) {
			return status(429);
		}

		const body = await readBody(request);
		if (body === null) {
			return status(413);
		}

		const batch = parseBatch(body);
		if (!batch) {
			return status(400);
		}
		if (batch.events.length === 0) {
			return status(204);
		}

		const now = Date.now();
		if (!await spendBudget(env.DB, dayOf(now), batch.events.length)) {
			return status(204);
		}

		const country = request.cf?.country ?? null;
		const insert = env.DB.prepare(
			'INSERT INTO events (received_at, ts, visitor_id, session_id, element, event, props, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
		);
		await env.DB.batch(batch.events.map((event) => insert.bind(
			now,
			event.ts,
			batch.visitorId,
			batch.sessionId,
			event.element,
			event.event,
			event.props ? JSON.stringify(event.props) : null,
			country,
		)));

		return status(204);
	},

	// Without an index on received_at both statements scan the whole table, which
	// at this site's volume costs next to nothing once a week.
	async scheduled(_controller, env) {
		const now = Date.now();
		await env.DB.batch([
			env.DB
				.prepare('UPDATE events SET visitor_id = NULL, session_id = NULL WHERE received_at < ? AND visitor_id IS NOT NULL')
				.bind(now - ANONYMIZE_AFTER_MS),
			env.DB
				.prepare('DELETE FROM daily_budget WHERE day < ?')
				.bind(dayOf(now - BUDGET_KEEP_MS)),
		]);
	},
} satisfies ExportedHandler<Env>;
