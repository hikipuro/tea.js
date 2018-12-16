import { DAEUtil } from "../../DAEUtil";
import { DAESource } from "../data/DAESource";
import { DAETargets } from "./DAETargets";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: controller
export class DAEMorph {
	static readonly TagName: string = "morph";
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
			return null;
		}
		var value = new DAEMorph();
		value.source = DAEUtil.getStringAttr(el, "source");
		value.method = DAEUtil.getStringAttr(el, "method");
		value.sources = DAESource.parseArray(el);
		value.targets = DAETargets.parse(
			DAEUtil.queryChildSelector(el, DAETargets.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEMorph.TagName);
		DAEUtil.setAttr(el, "source", this.source);
		DAEUtil.setAttr(el, "method", this.method);
		DAEUtil.addElementArray(el, this.sources);
		DAEUtil.addElement(el, this.targets);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
