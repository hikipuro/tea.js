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
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstancePhysicsScene();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstancePhysicsScene> {
		return DAEUtil.parseArray<DAEInstancePhysicsScene>(
			this.parse, parent, DAEInstancePhysicsScene.TagName
		);
	}
}
