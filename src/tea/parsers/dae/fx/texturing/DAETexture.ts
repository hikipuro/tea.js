import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: ambient, diffuse, emission, reflective, specular, transparent
export class DAETexture {
	static readonly TagName: string = "texture";
	texture: string;
	texcoord: string;
	extras?: Array<DAEExtra>;

	constructor() {
		this.texture = null;
		this.texcoord = null;
		this.extras = null;
	}

	static parse(el: Element): DAETexture {
		if (el == null) {
			return null;
		}
		var value = new DAETexture();
		value.texture = DAEUtil.getStringAttr(el, "texture");
		value.texcoord = DAEUtil.getStringAttr(el, "texcoord");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAETexture> {
		return DAEUtil.parseArray<DAETexture>(
			this.parse, parent, DAETexture.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETexture.TagName);
		DAEUtil.setAttr(el, "texture", this.texture);
		DAEUtil.setAttr(el, "texcoord", this.texcoord);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
