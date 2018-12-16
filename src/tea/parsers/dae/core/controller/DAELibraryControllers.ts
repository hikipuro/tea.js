import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEController } from "./DAEController";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryControllers {
	static readonly TagName: string = "library_controllers";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	controllers: Array<DAEController>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.controllers = [];
		this.extras = null;
	}

	static parse(el: Element): DAELibraryControllers {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryControllers();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.controllers = DAEController.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryControllers.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.controllers);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
