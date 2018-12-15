import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEPhysicsPlane {
	static readonly TagName: string = "plane";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEPhysicsPlane {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEPhysicsPlane();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEPhysicsPlane.TagName);
		return el;
	}
}
