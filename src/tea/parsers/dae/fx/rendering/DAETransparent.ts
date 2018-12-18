import { DAEUtil } from "../../DAEUtil";
import { DAEColor } from "../../core/lighting/DAEColor";
import { DAEParamRef } from "../../core/parameters/DAEParamRef";
import { DAETexture } from "../texturing/DAETexture";

// parent: constant (FX), lambert, phong, blinn
export class DAETransparent {
	static readonly TagName: string = "transparent";
	opaque: string;
	color?: DAEColor;
	param?: DAEParamRef;
	texture?: DAETexture;

	constructor() {
		this.opaque = null;
		this.color = null;
		this.param = null;
		this.texture = null;
	}

	static parse(el: Element): DAETransparent {
		if (el == null) {
			return null;
		}
		var value = new DAETransparent();
		value.opaque = DAEUtil.getStringAttr(el, "opaque");
		value.color = DAEColor.parse(
			DAEUtil.queryChildSelector(el, DAEColor.TagName)
		);
		value.param = DAEParamRef.parse(
			DAEUtil.queryChildSelector(el, DAEParamRef.TagName)
		);
		value.texture = DAETexture.parse(
			DAEUtil.queryChildSelector(el, DAETexture.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAETransparent.TagName);
		DAEUtil.setAttr(el, "opaque", this.opaque);
		if (this.color != null) {
			DAEUtil.addElement(el, this.color);
		} else {
			if (this.param != null) {
				DAEUtil.addElement(el, this.param);
			} else {
				DAEUtil.addElement(el, this.texture);
			}
		}
		return el;
	}
}
