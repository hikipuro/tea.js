import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAERender } from "../../fx/rendering/DAERender";

// parent: visual_scene
export class DAEEvaluateScene {
	static readonly TagName: string = "evaluate_scene";
	id?: string;
	name?: string;
	sid?: string;
	enable?: boolean;
	asset?: DAEAsset;
	renders?: Array<DAERender>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.sid = null;
		this.enable = true;
		this.asset = null;
		this.renders = null;
		this.extras = null;
	}

	static parse(el: Element): DAEEvaluateScene {
		if (el == null) {
			return null;
		}
		var value = new DAEEvaluateScene();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.enable = DAEUtil.getBoolAttr(el, "enable", true);
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.renders = DAERender.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEEvaluateScene> {
		return DAEUtil.parseArray<DAEEvaluateScene>(
			this.parse, parent, DAEEvaluateScene.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEEvaluateScene.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "enable", this.enable);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.renders);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
