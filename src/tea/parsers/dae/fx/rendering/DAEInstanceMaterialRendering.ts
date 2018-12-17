import { DAEUtil } from "../../DAEUtil";
import { DAEBindFX } from "../materials/DAEBindFX";
import { DAEBindVertexInput } from "../effects/DAEBindVertexInput";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: evaluate_scene/render
export class DAEInstanceMaterialRendering {
	static readonly TagName: string = "instance_material";
	url: string;
	bind: DAEBindFX;
	bindVertexInputs?: Array<DAEBindVertexInput>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.url = null;
		this.bind = null;
		this.bindVertexInputs = null;
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceMaterialRendering {
		if (el == null) {
			return null;
		}
		var value = new DAEInstanceMaterialRendering();
		value.url = DAEUtil.getStringAttr(el, "url");
		value.bind = DAEBindFX.parse(
			DAEUtil.queryChildSelector(el, DAEBindFX.TagName)
		);
		value.bindVertexInputs = DAEBindVertexInput.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceMaterialRendering.TagName);
		return el;
	}
}
