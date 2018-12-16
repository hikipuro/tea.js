import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAEBindMaterial } from "../../fx/materials/DAEBindMaterial";

// parent: node, shape
export class DAEInstanceGeometry {
	static readonly TagName: string = "instance_geometry";
	sid?: string;
	name?: string;
	url: string;
	bindMaterial: DAEBindMaterial;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceGeometry {
		if (el == null) {
			return null;
		}
		var value = new DAEInstanceGeometry();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url", "");
		value.bindMaterial = DAEBindMaterial.parse(
			DAEUtil.queryChildSelector(el, DAEBindMaterial.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceGeometry> {
		return DAEUtil.parseArray<DAEInstanceGeometry>(
			this.parse, parent, DAEInstanceGeometry.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceGeometry.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.addElement(el, this.bindMaterial);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
