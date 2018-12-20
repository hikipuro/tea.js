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
	static readonly TagName: string = "param";
	ref: string;
	name?: string;
	sid?: string;
	semantic?: string;
	type: string;
	data: string;

	constructor() {
		this.ref = null;
		this.name = null;
		this.sid = null;
		this.semantic = null;
		this.type = null;
		this.data = null;
	}

	static parse(el: Element): DAEParamRef {
		if (el == null) {
			return null;
		}
		var value = new DAEParamRef();
		value.ref = DAEUtil.getStringAttr(el, "ref");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.semantic = DAEUtil.getStringAttr(el, "semantic");
		value.type = DAEUtil.getStringAttr(el, "type");
		value.data = DAEUtil.getStringContent(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEParamRef> {
		return DAEUtil.parseArray<DAEParamRef>(
			this.parse, parent, DAEParamRef.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEParamRef.TagName);
		DAEUtil.setAttr(el, "ref", this.ref);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "semantic", this.semantic);
		DAEUtil.setStringContent(el, this.data);
		return el;
	}
}
