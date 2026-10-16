import { useSyncExternalStore } from 'react';

/** Whether the reader drives the page with a finger, so hints can say "tap" and "swipe". */
const touchQuery = window.matchMedia('(pointer: coarse)');

function subscribe(onChange: () => void) {
	touchQuery.addEventListener('change', onChange);
	return () => touchQuery.removeEventListener('change', onChange);
}

export default function useTouch(): boolean {
	return useSyncExternalStore(subscribe, () => touchQuery.matches);
}
