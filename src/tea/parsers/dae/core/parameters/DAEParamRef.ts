import { DAEUtil } from "../../DAEUtil";

// parent: ambient (FX), diffuse, emission, reflective, specular, transparent, 
// index_of_refraction, reflectivity, shininess, transparency, bind_uniform
//
// color_target, depth_target, stencil_target, bind (kinematics), 
// bind_kinematics_model
//
// texture1D, texture2D, texture3D, textureCUBE, textureRECT, textureDEPTH
//
// bind_material, accessor
export class DAEParamRef {
	ref: string;

	constructor() {
		this.ref = null;
	}

	static parse(el: Element): DAEParamRef {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEParamRef();
		value.ref = DAEUtil.stringAttrib(el, "ref");
		return value;
	}

	static parseArray(parent: Element): Array<DAEParamRef> {
		return DAEUtil.parseArray<DAEParamRef>(
			this.parse, parent, "param"
		);
	}

	toXML(): Element {
		var el = document.createElement("param");
		DAEUtil.setAttribute(el, "ref", this.ref);
		return el;
	}
}
