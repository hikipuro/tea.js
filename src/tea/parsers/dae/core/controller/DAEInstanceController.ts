import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAESkeleton } from "./DAESkeleton";

// parent: node
export class DAEInstanceController {
	sid?: string;
	name?: string;
	url: string;
	skeletons?: Array<DAESkeleton>;
	//bindMaterial: any;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.skeletons = null;
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceController {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceController();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url", "");
		value.skeletons = DAESkeleton.parseArray(el);
		//value.bindMaterial = DAEBindMaterial.parse(el.queryString("bind_material"));
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceController> {
		return DAEUtil.parseArray<DAEInstanceController>(
			this.parse, parent, "instance_controller"
		);
	}

	toXML(): Element {
		var el = document.createElement("instance_controller");
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "url", this.url);
		DAEUtil.addXMLArray(el, this.skeletons);
		//DAEUtil.addXML(el, this.bindMaterial);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
