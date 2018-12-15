import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEPhysicsSphere {
	static readonly TagName: string = "sphere";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEPhysicsSphere {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEPhysicsSphere();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEPhysicsSphere.TagName);
		return el;
	}
}
