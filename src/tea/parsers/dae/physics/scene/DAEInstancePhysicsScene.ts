import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: scene
export class DAEInstancePhysicsScene {
	static readonly TagName: string = "instance_physics_scene";
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

	static parse(el: Element): DAEInstancePhysicsScene {
		if (el == null) {
			return null;
		}
		var value = new DAEInstancePhysicsScene();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstancePhysicsScene> {
		return DAEUtil.parseArray<DAEInstancePhysicsScene>(
			this.parse, parent, DAEInstancePhysicsScene.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInstancePhysicsScene.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
