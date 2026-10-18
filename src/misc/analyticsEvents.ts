/**
 * Every event the site may send, shared by the client and the Worker: the client
 * cannot track a pair that isn't listed, and the Worker drops one that isn't.
 */
export const ANALYTICS_EVENTS = {
	section: ['turn', 'settled'],
	sidebar: ['open', 'close', 'item_click'],
	cv: ['click'],
	contact: ['click'],
	clipboard: ['success', 'failed'],
	header: ['click'],
	story: ['select'],
} as const satisfies Record<string, readonly string[]>;

export type AnalyticsElement = keyof typeof ANALYTICS_EVENTS;
export type AnalyticsEventName<E extends AnalyticsElement> = (typeof ANALYTICS_EVENTS)[E][number];

export function isKnownEvent(element: string, event: string): boolean {
	return Object.hasOwn(ANALYTICS_EVENTS, element)
		&& (ANALYTICS_EVENTS[element as AnalyticsElement] as readonly string[]).includes(event);
}
