import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: rigid_body / technique_common,
// instance_rigid_body / technique_common, shape
export class DAEInstancePhysicsMaterial {
	static readonly TagName: string = "instance_physics_material";
	sid?: string;
	name?: string;
	url: string;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.extras = null;
	}

	static parse(el: Element): DAEInstancePhysicsMaterial {
		if (el == null) {
			return null;
		}
		var value = new DAEInstancePhysicsMaterial();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstancePhysicsMaterial.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
