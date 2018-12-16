import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEOptics } from "./DAEOptics";
import { DAEImager } from "./DAEImager";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: library_cameras
export class DAECamera {
	static readonly TagName: string = "camera";
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
			return null;
		}
		var value = new DAECamera();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.optics = DAEOptics.parse(
			DAEUtil.queryChildSelector(el, DAEOptics.TagName)
		);
		value.imager = DAEImager.parse(
			DAEUtil.queryChildSelector(el, DAEImager.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAECamera> {
		return DAEUtil.parseArray<DAECamera>(
			this.parse, parent, DAECamera.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAECamera.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElement(el, this.optics);
		DAEUtil.addElement(el, this.imager);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
