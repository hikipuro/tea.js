import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEOptics } from "./DAEOptics";
import { DAEImager } from "./DAEImager";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: library_cameras
export class DAECamera {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	optics: DAEOptics;
	imager?: DAEImager;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.optics = null;
		this.imager = null;
		this.extras = null;
	}

	static parse(el: Element): DAECamera {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAECamera();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.optics = DAEOptics.parse(
			el.querySelector(":scope > optics")
		);
		value.imager = DAEImager.parse(
			el.querySelector(":scope > imager")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAECamera> {
		return DAEUtil.parseArray<DAECamera>(
			this.parse, parent, "camera"
		);
	}

	toXML(): Element {
		var el = document.createElement("camera");
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXML(el, this.optics);
		DAEUtil.addXML(el, this.imager);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
