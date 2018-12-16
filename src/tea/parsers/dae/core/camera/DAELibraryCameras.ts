import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAECamera } from "./DAECamera";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryCameras {
	static readonly TagName: string = "library_cameras";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	cameras: Array<DAECamera>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.cameras = [];
		this.extras = null;
	}

	static parse(el: Element): DAELibraryCameras {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryCameras();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.cameras = DAECamera.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryCameras.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.cameras);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
