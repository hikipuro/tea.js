import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAECreateCube {
	static readonly TagName: string = "origin";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAECreateCube {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAECreateCube();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAECreateCube.TagName);
		return el;
	}
}
