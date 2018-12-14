import { DAEUtil } from "../../DAEUtil";
import { DAESource } from "../data/DAESource";
import { DAETargets } from "./DAETargets";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: controller
export class DAEMorph {
	source: string;
	method?: string;
	sources: Array<DAESource>;
	targets: DAETargets;
	extras?: Array<DAEExtra>;

	constructor() {
		this.source = "";
		this.method = null;
		this.sources = [];
		this.targets = null;
		this.extras = null;
	}

	static parse(el: Element): DAEMorph {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEMorph();
		value.source = DAEUtil.stringAttrib(el, "source");
		value.method = DAEUtil.stringAttrib(el, "method");
		value.sources = DAESource.parseArray(el);
		value.targets = DAETargets.parse(
			el.querySelector(":scope > targets")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
