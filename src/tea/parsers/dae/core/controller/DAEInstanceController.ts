import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAESkeleton } from "./DAESkeleton";
import { DAEBindMaterial } from "../../fx/materials/DAEBindMaterial";

// parent: node
export class DAEInstanceController {
	static readonly TagName: string = "instance_controller";
	sid?: string;
	name?: string;
	url: string;
	skeletons?: Array<DAESkeleton>;
	bindMaterial?: DAEBindMaterial;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.skeletons = null;
		this.bindMaterial = null;
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceController {
		if (el == null) {
			return null;
		}
		var value = new DAEInstanceController();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url", "");
		value.skeletons = DAESkeleton.parseArray(el);
		value.bindMaterial = DAEBindMaterial.parse(
			DAEUtil.queryChildSelector(el, DAEBindMaterial.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceController> {
		return DAEUtil.parseArray<DAEInstanceController>(
			this.parse, parent, DAEInstanceController.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceController.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "url", this.url);
		DAEUtil.addElementArray(el, this.skeletons);
		DAEUtil.addElement(el, this.bindMaterial);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
