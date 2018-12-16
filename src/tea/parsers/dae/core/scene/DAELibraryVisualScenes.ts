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
			return null;
		}
		var value = new DAELibraryVisualScenes();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.visualScenes = DAEVisualScene.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryVisualScenes.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.visualScenes);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
