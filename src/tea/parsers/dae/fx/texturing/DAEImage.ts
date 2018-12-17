import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEInitFrom } from "./DAEInitFrom";
import { DAECreate2D } from "./DAECreate2D";
import { DAECreate3D } from "./DAECreate3D";
import { DAECreateCube } from "./DAECreateCube";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_images
export class DAEImage {
	static readonly TagName: string = "image";
	id?: string;
	sid?: string;
	name?: string;
	asset?: DAEAsset;
	//renderable?: DAERenderable;
	initFrom?: DAEInitFrom;
	create2d?: DAECreate2D;
	create3d?: DAECreate3D;
	createCube?: DAECreateCube;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.sid = null;
		this.name = null;
		this.asset = null;
		//this.renderable = null;
		this.initFrom = null;
		this.create2d = null;
		this.create3d = null;
		this.createCube = null;
		this.extras = null;
	}

	static parse(el: Element): DAEImage {
		if (el == null) {
			return null;
		}
		var value = new DAEImage();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		//value.renderable = null;
		value.initFrom = DAEInitFrom.parse(
			DAEUtil.queryChildSelector(el, DAEInitFrom.TagName)
		);
		value.create2d = DAECreate2D.parse(
			DAEUtil.queryChildSelector(el, DAECreate2D.TagName)
		);
		value.create3d = DAECreate3D.parse(
			DAEUtil.queryChildSelector(el, DAECreate3D.TagName)
		);
		value.createCube = DAECreateCube.parse(
			DAEUtil.queryChildSelector(el, DAECreateCube.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEImage> {
		return DAEUtil.parseArray<DAEImage>(
			this.parse, parent, DAEImage.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEImage.TagName);
		return el;
	}
}
