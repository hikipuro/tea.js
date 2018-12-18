import { DAEUtil } from "../../DAEUtil";
import { DAERGB } from "./DAERGB";

// TODO: fix

// parent: texture_pipeline
export class DAETexcombiner {
	static readonly TagName: string = "texcombiner";
	id?: string;
	//constant?:
	rgb?: DAERGB;
	//alpha?:

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAETexcombiner {
		if (el == null) {
			return null;
		}
		var value = new DAETexcombiner();
		return value;
	}

	static parseArray(parent: Element): Array<DAETexcombiner> {
		return DAEUtil.parseArray<DAETexcombiner>(
			this.parse, parent, DAETexcombiner.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETexcombiner.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.addElement(el, this.rgb);
		return el;
	}
}
