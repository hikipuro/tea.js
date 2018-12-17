import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAETorus {
	static readonly TagName: string = "torus";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAETorus {
		if (el == null) {
			return null;
		}
		var value = new DAETorus();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAETorus.TagName);
		return el;
	}
}
