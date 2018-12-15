import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAENode } from "./DAENode";
import { DAEEvaluateScene } from "./DAEEvaluateScene";
import { DAEExtra } from "../extensibility/DAEExtra";

// paernt: library_visual_scenes
export class DAEVisualScene {
	static readonly TagName: string = "visual_scene";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	nodes: Array<DAENode>;
	evaluateScenes?: Array<DAEEvaluateScene>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.nodes = [];
		this.evaluateScenes = null;
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
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.nodes = DAENode.parseArray(el);
		value.evaluateScenes = DAEEvaluateScene.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEVisualScene> {
		return DAEUtil.parseArray<DAEVisualScene>(
			this.parse, parent, DAEVisualScene.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEVisualScene.TagName);
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXMLArray(el, this.nodes);
		DAEUtil.addXMLArray(el, this.evaluateScenes);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
