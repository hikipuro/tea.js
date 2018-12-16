import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAETexturePipeline {
	static readonly TagName: string = "texture_pipeline";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAETexturePipeline {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAETexturePipeline();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAETexturePipeline.TagName);
		return el;
	}
}
