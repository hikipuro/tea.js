import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAENode } from "./DAENode";
import { DAEEvaluateScene } from "./DAEEvaluateScene";
import { DAEExtra } from "../extensibility/DAEExtra";

// paernt: library_visual_scenes
export class DAEVisualScene {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	nodes: Array<DAENode>;
	evaluateScene?: Array<DAEEvaluateScene>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.nodes = [];
		this.evaluateScene = null;
		this.extras = null;
	}

	static parse(el: Element): DAEVisualScene {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEVisualScene();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.nodes = DAENode.parseArray(el);
		value.evaluateScene = DAEEvaluateScene.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEVisualScene> {
		return DAEUtil.parseArray<DAEVisualScene>(
			this.parse, parent, "visual_scene"
		);
	}
}
