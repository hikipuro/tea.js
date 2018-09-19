export class Range {
	start: number;
	length: number;

	constructor(start: number, length: number) {
		this.start = start;
		this.length = length;
	}

	get end(): number {
		return this.start + this.length;
	}
}
