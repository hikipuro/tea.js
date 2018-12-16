import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEFXCommonColorOrTextureType {
	static readonly TagName: string = "fx_common_color_or_texture_type";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEFXCommonColorOrTextureType {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEFXCommonColorOrTextureType();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEFXCommonColorOrTextureType.TagName);
		return el;
	}
}
