import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEBindJointAxis {
	static readonly TagName: string = "bind_joint_axis";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEBindJointAxis {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEBindJointAxis();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBindJointAxis.TagName);
		return el;
	}
}
