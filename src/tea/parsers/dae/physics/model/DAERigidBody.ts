import { DAEUtil } from "../../DAEUtil";
import { DAETechniqueCommon } from "../../core/extensibility/DAETechniqueCommon";
import { DAETechnique } from "../../core/extensibility/DAETechnique";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// TODO: add dynamic etc.

// parent: physics_model
export class DAERigidBody {
	static readonly TagName: string = "rigid_body";
	sid?: string;
	name?: string;
	id?: string;
	techniqueCommon: DAETechniqueCommon;
	techniques?: Array<DAETechnique>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.id = null;
		this.techniqueCommon = null;
		this.techniques = null;
		this.extras = null;
	}

	static parse(el: Element): DAERigidBody {
		if (el == null) {
			return null;
		}
		var value = new DAERigidBody();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.id = DAEUtil.getStringAttr(el, "id");
		value.techniqueCommon = DAETechniqueCommon.parse(
			DAEUtil.queryChildSelector(el, DAETechniqueCommon.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAERigidBody> {
		return DAEUtil.parseArray<DAERigidBody>(
			this.parse, parent, DAERigidBody.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAERigidBody.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.addElement(el, this.techniqueCommon);
		DAEUtil.addElementArray(el, this.techniques);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
