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
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryFormulas();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.formulas = DAEFormula.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryFormulas.TagName);
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXMLArray(el, this.formulas);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
