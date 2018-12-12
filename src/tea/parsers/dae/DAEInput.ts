export class DAEInput {
	semantic: string;
	source: string;
	offset: number;

	constructor() {
		this.semantic = "";
		this.source = "";
		this.offset = 0;
	}

	static parse(el: Element): DAEInput {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var input = new DAEInput();
		input.semantic = el.getAttribute("semantic");
		input.source = el.getAttribute("source");
		input.offset = parseInt(el.getAttribute("offset"));
		return input;
	}
}
