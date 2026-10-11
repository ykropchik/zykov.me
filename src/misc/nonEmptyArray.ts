export type NonEmptyArray<T> = [T, ...T[]];

export function isNonEmptyArray<T>(items: T[]): items is NonEmptyArray<T> {
	return items.length > 0;
}
