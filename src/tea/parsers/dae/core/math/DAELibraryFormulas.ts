import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEFormula } from "./DAEFormula";
import { DAEExtra } from "../extensibility/DAEExtra";

export class DAELibraryFormulas {
	static readonly TagName: string = "library_formulas";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	formulas: Array<DAEFormula>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.formulas = [];
		this.extras = null;
	}

	static parse(el: Element): DAELibraryFormulas {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryFormulas();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.formulas = DAEFormula.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryFormulas.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.formulas);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
