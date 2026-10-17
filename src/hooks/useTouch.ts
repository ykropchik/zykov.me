import { useSyncExternalStore } from 'react';

export default function useTouch(): boolean {
	/** Whether the reader drives the page with a finger, so hints can say "tap" and "swipe". */
	const touchQuery = window.matchMedia('(pointer: coarse)');

	function subscribe(onChange: () => void) {
		touchQuery.addEventListener('change', onChange);
		return () => touchQuery.removeEventListener('change', onChange);
	}

	return useSyncExternalStore(subscribe, () => touchQuery.matches);
}
