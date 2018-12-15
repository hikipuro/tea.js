import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: node, shape
export class DAEInstanceGeometry {
	sid?: string;
	name?: string;
	url: string;
	//bindMaterial: DAEBindMaterial;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceGeometry {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEInstanceGeometry();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.url = DAEUtil.stringAttrib(el, "url", "");
		//value.bindMaterial = DAEBindMaterial.parse(el.queryString("bind_material"));
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceGeometry> {
		return DAEUtil.parseArray<DAEInstanceGeometry>(
			this.parse, parent, "instance_geometry"
		);
	}

	toXML(): Element {
		var el = document.createElement("instance_geometry");
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "url", this.url);
		//DAEUtil.addXML(el, this.bindMaterial);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
