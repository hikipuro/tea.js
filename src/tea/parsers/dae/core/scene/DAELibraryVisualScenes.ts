import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEVisualScene } from "./DAEVisualScene";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryVisualScenes {
	static readonly TagName: string = "library_visual_scenes";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	visualScenes: Array<DAEVisualScene>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.visualScenes = [];
		this.extras = null;
	}

	static parse(el: Element): DAELibraryVisualScenes {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryVisualScenes();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.visualScenes = DAEVisualScene.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryVisualScenes.TagName);
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXMLArray(el, this.visualScenes);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
