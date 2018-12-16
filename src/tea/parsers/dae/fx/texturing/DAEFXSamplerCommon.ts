import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEFXSamplerCommon {
	static readonly TagName: string = "fx_sampler_common";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEFXSamplerCommon {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEFXSamplerCommon();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFXSamplerCommon.TagName);
		return el;
	}
}
