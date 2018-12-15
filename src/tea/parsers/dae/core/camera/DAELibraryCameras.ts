import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAECamera } from "./DAECamera";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryCameras {
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
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryCameras();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.cameras = DAECamera.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement("library_cameras");
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXMLArray(el, this.cameras);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
