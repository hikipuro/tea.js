import { DAEUtil } from "../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEFormula } from "./DAEFormula";
import { DAEExtra } from "../extensibility/DAEExtra";

export class DAELibraryFormulas {
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
			console.error("parse error");
			return null;
		}
		var value = new DAELibraryFormulas();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector("asset")
		);
		value.formulas = DAEFormula.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
