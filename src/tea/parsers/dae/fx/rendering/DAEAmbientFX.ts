import { DAEUtil } from "../../DAEUtil";
import { DAEColor } from "../../core/lighting/DAEColor";
import { DAEParamRef } from "../../core/parameters/DAEParamRef";
import { DAETexture } from "../texturing/DAETexture";

// parent: constant (FX), lambert, phong, blinn
export class DAEAmbientFX {
	static readonly TagName: string = "ambient";
	color?: DAEColor;
	param?: DAEParamRef;
	texture?: DAETexture;

	constructor() {
		this.color = null;
		this.param = null;
		this.texture = null;
	}

	static parse(el: Element): DAEAmbientFX {
		if (el == null) {
			return null;
		}
		var value = new DAEAmbientFX();
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
		var el = document.createElement(DAEAmbientFX.TagName);
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
