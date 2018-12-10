export class DaeInput {
	semantic: string;
	source: string;
	offset: number;

	constructor() {
		this.semantic = "";
		this.source = "";
		this.offset = 0;
	}

	static parse(el: Element): DaeInput {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var input = new DaeInput();
		input.semantic = el.getAttribute("semantic");
		input.source = el.getAttribute("source");
		input.offset = parseInt(el.getAttribute("offset"));
		return input;
	}
}
