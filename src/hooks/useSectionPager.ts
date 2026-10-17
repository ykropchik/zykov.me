import { useEffect, useRef, type RefObject } from 'react';

/**
 * Turns scrolling at a section's edge into a page turn, while leaving scrolling
 * inside the section alone.
 *
 * Nothing here tries to tell a real scroll from inertia, because nothing can: a
 * hand swiping steadily and a flick coasting at the same speed look identical
 * event by event, and differ only in that the coast eventually decays — which
 * takes time to observe, not cleverness. So the rule is about bursts of events
 * instead: one burst yields at most one page turn, none at all if it scrolled the
 * content on the way, and it is over when the events stop, whenever that is. A
 * burst already running when a section arrives began before there was anything to
 * leave, so it owes CARRY_PX instead of THRESHOLD_PX — far enough that the tail of
 * a coast cannot cover it, close enough that a hand still moving gets there.
 * Nor may it scroll the arriving section's content: once the old section is
 * hidden, the browser hands its momentum to whatever is under the pointer.
 *
 * One reader has one pointer, so both the burst and the section being left are
 * module-global, and the listeners are installed on `window` once and never
 * removed: following the burst has to be continuous across a transition, or its
 * momentum would read as a fresh gesture the moment the next section settles.
 * Per-section listeners could not do it either way — the outgoing section is
 * hidden mid-transition, so it would go on hearing events nobody can see, while
 * the incoming one, its sibling rather than its ancestor, heard none.
 */

const EDGE_PX = 2;
const THRESHOLD_PX = 64;
const CARRY_PX = 600;
/** How thin a burst's events have to be to count as drained rather than still coasting. */
const DRAINED_PX = 8;
/** Only has to outlast the gap between two events of one burst, not the burst itself. */
const BURST_END_MS = 180;

const NEXT_KEYS = ['ArrowDown'];
const PREV_KEYS = ['ArrowUp'];
/** Elements that handle these keys themselves. */
const INTERACTIVE = 'input, textarea, select, [contenteditable]';

const burst = {
	pushed: 0,
	touchY: 0,
	streaming: false,
	/**
	 * `turned`   — has had its page turn; nothing more until the burst ends.
	 * `scrolled` — moved the content instead, so it is not also a page turn.
	 * `late`     — began before the section settled, so it owes CARRY_PX.
	 */
	spent: false as false | 'turned' | 'scrolled' | 'late',
	/**
	 * Outlived the section it began on. Its momentum lands on the next section once
	 * the old one is hidden, so it may not scroll that section's content.
	 */
	stale: false,
	endTimer: 0,
};

/** The section that may currently be left; null between page turns. */
const target: {
	element: HTMLElement | null;
	turn: ((direction: 1 | -1) => boolean) | null;
} = { element: null, turn: null };

/** The sidebar blocks page scroll; it says so as any modal does, by being one. */
function isBlocked() {
	return document.querySelector('[aria-modal="true"]') !== null;
}

function endBurst() {
	burst.streaming = false;
	burst.spent = false;
	burst.stale = false;
	burst.pushed = 0;
}

function keepAlive() {
	burst.streaming = true;
	clearTimeout(burst.endTimer);
	burst.endTimer = window.setTimeout(endBurst, BURST_END_MS);
}

function edgesOf(element: HTMLElement) {
	return {
		atTop: element.scrollTop <= EDGE_PX,
		atBottom: element.scrollTop + element.clientHeight >= element.scrollHeight - EDGE_PX,
	};
}

function push(delta: number) {
	const { element, turn } = target;
	if (!element || !turn || isBlocked()) {
		return;
	}

	if (burst.spent === 'scrolled') {
		// The reader's own hand rather than a coast to be waited out, so there is no way
		// back in: it ends when they stop.
		return;
	}

	if (burst.spent === 'turned') {
		// Still more than a trickle, so this is the same push that turned the page.
		if (Math.abs(delta) > DRAINED_PX) {
			return;
		}
		// Drained: either the tail of the coast, which CARRY_PX is beyond, or a reader
		// scrolling again, who should not have to wait that coast out.
		burst.spent = 'late';
		burst.pushed = 0;
	}

	const { atTop, atBottom } = edgesOf(element);
	if (delta > 0 && atBottom) {
		burst.pushed = Math.max(burst.pushed, 0) + delta;
	} else if (delta < 0 && atTop) {
		burst.pushed = Math.min(burst.pushed, 0) + delta;
	} else {
		// The browser is scrolling the content, so this burst turns no page however far it
		// overruns the end afterwards: reading a section to the bottom never leaves it.
		burst.pushed = 0;
		burst.spent = 'scrolled';
		return;
	}

	const needed = burst.spent === 'late' ? CARRY_PX : THRESHOLD_PX;
	if (Math.abs(burst.pushed) < needed) {
		return;
	}

	const direction = burst.pushed > 0 ? 1 : -1;
	if (!turn(direction)) {
		// Nothing moved, so the burst is not spent: pressing against the end of the running
		// order must not cost the reader the CARRY_PX that reversing out of it would owe.
		return;
	}
	burst.pushed = 0;
	burst.spent = 'turned';
}

let listening = false;

function listen() {
	if (listening) {
		return;
	}
	listening = true;

	window.addEventListener('wheel', (event) => {
		keepAlive();
		if (burst.stale) {
			event.preventDefault();
		}
		push(event.deltaY);
	}, { passive: false });

	// Touch never coasts into this hook — after `touchend` the browser flings the page
	// itself and sends no further `touchmove` — so a finger going down starts a burst
	// outright, and letting go of it ends one.
	window.addEventListener('touchstart', (event) => {
		burst.touchY = event.touches[0].clientY;
		clearTimeout(burst.endTimer);
		burst.streaming = true;
		burst.spent = false;
		burst.stale = false;
		burst.pushed = 0;
	}, { passive: true });

	window.addEventListener('touchmove', (event) => {
		const y = event.touches[0].clientY;
		// Dragging the content up is scrolling down.
		push(burst.touchY - y);
		burst.touchY = y;
	}, { passive: true });

	window.addEventListener('touchend', endBurst, { passive: true });
	// Arrives instead of `touchend` when something else takes the gesture.
	window.addEventListener('touchcancel', endBurst, { passive: true });

	window.addEventListener('keydown', (event) => {
		const { element, turn } = target;
		if (!element || !turn || isBlocked()) {
			return;
		}
		if ((event.target as HTMLElement | null)?.closest(INTERACTIVE)) {
			return;
		}

		const { atTop, atBottom } = edgesOf(element);
		if (NEXT_KEYS.includes(event.key) && atBottom) {
			event.preventDefault();
			turn(1);
		} else if (PREV_KEYS.includes(event.key) && atTop) {
			event.preventDefault();
			turn(-1);
		}
	});
}

/**
 * Pass `enabled` only once the section has finished arriving. Everything the reader
 * does before that is dropped, never queued.
 */
export default function useSectionPager(
	ref: RefObject<HTMLElement | null>,
	enabled: boolean,
	turn: (direction: 1 | -1) => boolean,
) {
	const latest = useRef(turn);
	useEffect(() => {
		latest.current = turn;
	}, [turn]);

	useEffect(() => {
		listen();
		if (!enabled) {
			return;
		}

		// `turned` and `scrolled` outrank `late` and have to survive this, or every page
		// turn would hand its own burst a second one for CARRY_PX more, and a scroll that
		// happened to span a transition would turn the page it arrived on. That matters
		// under reduced motion, where a section settles at once and the momentum still has
		// thousands of pixels left in it.
		if (burst.streaming && !burst.spent) {
			burst.spent = 'late';
		}
		burst.pushed = 0;

		target.element = ref.current;
		target.turn = (direction) => latest.current(direction);

		return () => {
			if (burst.streaming) {
				burst.stale = true;
			}
			target.element = null;
			target.turn = null;
		};
	}, [ref, enabled]);
}
