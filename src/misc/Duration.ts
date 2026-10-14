export default class Duration {
	private readonly ms: number;

	private constructor(ms: number) {
		this.ms = ms;
	}

	public static create(ms: number): Duration {
		return new Duration(ms);
	}

	public get millis(): number {
		return this.ms;
	}

	public get seconds(): number {
		return this.ms / 1000;
	}

	public times(factor: number): Duration {
		return new Duration(this.ms * factor);
	}

	public plus(...rest: Duration[]): Duration {
		return new Duration(rest.reduce((total, duration) => total + duration.ms, this.ms));
	}
}
