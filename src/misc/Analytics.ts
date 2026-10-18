/**
 * Collects analytics events in memory and ships them in one batch
 * when the page is hidden, so a visit costs one request instead of one per event.
 *
 * "Hidden" rather than "closed": `beforeunload`/`unload` are not fired reliably,
 * on mobile especially, and are not fired at all when the tab is backgrounded and
 * then killed by the OS. `visibilitychange → hidden` is the last event the page is
 * guaranteed to get, so the queue is flushed every time the tab is hidden, and a
 * visit may arrive as several batches tied together by `sessionId`.
 */

import type { AnalyticsElement, AnalyticsEventName } from './analyticsEvents.ts';

const ENDPOINT = '/analytics';
const VISITOR_KEY = 'visitorId';
/** Keeps a batch well under the ~64KB `sendBeacon` limit. */
const MAX_QUEUE = 100;

type EventProps = Record<string, string | number | boolean>;

interface AnalyticsEvent {
	element: string;
	event: string;
	props?: EventProps;
	ts: number;
}

function randomId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(16));
	// Version and variant bits make it a valid UUID v4, same shape as crypto.randomUUID().
	bytes[6] = (bytes[6] & 0x0f) | 0x40;
	bytes[8] = (bytes[8] & 0x3f) | 0x80;
	const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function loadVisitorId(): string {
	// localStorage throws in some private modes and with blocked site data; such a
	// visitor just gets a new id per page load.
	try {
		const stored = localStorage.getItem(VISITOR_KEY);
		if (stored) {
			return stored;
		}
		const id = randomId();
		localStorage.setItem(VISITOR_KEY, id);
		return id;
	} catch {
		return randomId();
	}
}

class Analytics {
	private queue: AnalyticsEvent[] = [];
	private visitorId = '';
	private sessionId = '';
	private started = false;

	public track<E extends AnalyticsElement>(element: E, event: AnalyticsEventName<E>, props?: EventProps): void {
		if (typeof window === 'undefined') {
			return;
		}
		this.start();

		if (this.queue.length >= MAX_QUEUE) {
			return;
		}

		const eventObj = { element, event, props, ts: Date.now() };

		this.log('register event', eventObj);
		this.queue.push(eventObj);
	}

	private start(): void {
		if (this.started) {
			return;
		}
		this.started = true;
		this.visitorId = loadVisitorId();
		this.sessionId = randomId();

		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden') {
				this.flush();
			}
		});
		// Older Safari skips visibilitychange when the tab is closed.
		window.addEventListener('pagehide', () => this.flush());
	}

	private flush(): void {
		if (this.queue.length === 0) {
			return;
		}

		const payload = JSON.stringify({
			visitorId: this.visitorId,
			sessionId: this.sessionId,
			events: this.queue,
		});

		if (import.meta.env.DEV) {
			this.log('sent', JSON.parse(payload));
			this.queue = [];
			return;
		}

		// false means the browser refused to queue the beacon; keep the events for the next flush.
		if (navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'application/json' }))) {
			this.queue = [];
		}
	}

	private log(message: string, data: unknown): void {
		if (import.meta.env.DEV) {
			console.info(`[analytics] ${message}:`, data);
		}
	}
}

export const analytics = new Analytics();
