import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: instance_physics_model, physics_scene
export class DAEInstanceForceField {
	static readonly TagName: string = "instance_force_field";
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

	static parse(el: Element): DAEInstanceForceField {
		if (el == null) {
			return null;
		}
		var value = new DAEInstanceForceField();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceForceField> {
		return DAEUtil.parseArray<DAEInstanceForceField>(
			this.parse, parent, DAEInstanceForceField.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceForceField.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
