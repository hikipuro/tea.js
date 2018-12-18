import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEImage } from "./DAEImage";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryImages {
	static readonly TagName: string = "library_images";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	images: Array<DAEImage>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.images = null;
		this.extras = null;
	}

	static parse(el: Element): DAELibraryImages {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryImages();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.images = DAEImage.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryImages.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.images);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
