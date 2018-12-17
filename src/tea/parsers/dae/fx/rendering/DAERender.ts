import { DAEUtil } from "../../DAEUtil";
import { DAEInstanceMaterialRendering } from "./DAEInstanceMaterialRendering";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: evaluate_scene
export class DAERender {
	static readonly TagName: string = "render";
	name?: string;
	sid?: string;
	cameraNode?: string;
	//layers?: Array<DAELayer>;
	instanceMaterial?: DAEInstanceMaterialRendering;
	extras?: Array<DAEExtra>;

	constructor() {
		this.name = null;
		this.sid = null;
		this.cameraNode = null;
		//this.layers = null;
		this.instanceMaterial = null;
		this.extras = null;
	}

	static parse(el: Element): DAERender {
		if (el == null) {
			return null;
		}
		var value = new DAERender();
		value.name = DAEUtil.getStringAttr(el, "name");
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.cameraNode = DAEUtil.getStringAttr(el, "camera_node");
		value.instanceMaterial = DAEInstanceMaterialRendering.parse(
			DAEUtil.queryChildSelector(el, DAEInstanceMaterialRendering.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAERender> {
		return DAEUtil.parseArray<DAERender>(
			this.parse, parent, DAERender.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAERender.TagName);
		return el;
	}
}
