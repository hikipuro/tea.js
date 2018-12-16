import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAESamplerCube {
	static readonly TagName: string = "samplerCUBE";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAESamplerCube {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESamplerCube();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESamplerCube.TagName);
		return el;
	}
}
