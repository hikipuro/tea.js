import { DAEUtil } from "../../DAEUtil";
import { DAEBindFX } from "./DAEBindFX";
import { DAEBindVertexInput } from "../effects/DAEBindVertexInput";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: technique_common in bind_material
export class DAEInstanceMaterial {
	static readonly TagName: string = "instance_material";
	sid?: string;
	name?: string;
	target: string;
	symbol: string;
	binds?: Array<DAEBindFX>;
	bindVertexInputs?: Array<DAEBindVertexInput>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.target = null;
		this.symbol = null;
		this.binds = null;
		this.bindVertexInputs = null;
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceMaterial {
		if (el == null) {
			return null;
		}
		var value = new DAEInstanceMaterial();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.target = DAEUtil.getStringAttr(el, "target");
		value.symbol = DAEUtil.getStringAttr(el, "symbol");
		value.binds = DAEBindFX.parseArray(el);
		value.bindVertexInputs = DAEBindVertexInput.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceMaterial.TagName);
		return el;
	}
}
