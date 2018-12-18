import { DAEUtil } from "../../DAEUtil";
import { DAEBindKinematics } from "./DAEBindKinematics";

// TODO: fix

// parent: motion/technique_common
export class DAEEffectorInfo {
	static readonly TagName: string = "effector_info";
	sid?: string;
	name?: string;
	binds?: Array<DAEBindKinematics>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.binds = null;
	}

	static parse(el: Element): DAEEffectorInfo {
		if (el == null) {
			return null;
		}
		var value = new DAEEffectorInfo();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEEffectorInfo.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		return el;
	}
}
