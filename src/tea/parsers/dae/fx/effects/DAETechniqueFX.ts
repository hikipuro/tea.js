import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEAnnotate } from "./DAEAnnotate";
import { DAEBlinn } from "../rendering/DAEBlinn";
import { DAEConstant } from "../rendering/DAEConstant";
import { DAELambert } from "../rendering/DAELambert";
import { DAEPhong } from "../rendering/DAEPhong";
import { DAEPass } from "../rendering/DAEPass";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: profile_CG, profile_COMMON, profile_GLSL, profile_GLES, profile_GLES2
export class DAETechniqueFX {
	static readonly TagName: string = "technique";
	id?: string;
	sid: string;
	asset?: DAEAsset;
	annotates?: Array<DAEAnnotate>;
	blinn: DAEBlinn;
	constant: DAEConstant;
	lambert: DAELambert;
	phong: DAEPhong;
	passes: Array<DAEPass>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.sid = null;
		this.asset = null;
		this.annotates = null;
		this.blinn = null;
		this.constant = null;
		this.lambert = null;
		this.phong = null;
		this.passes = null;
		this.extras = null;
	}

	static parse(el: Element): DAETechniqueFX {
		if (el == null) {
			return null;
		}
		var value = new DAETechniqueFX();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.annotates = DAEAnnotate.parseArray(el);
		value.blinn = DAEBlinn.parse(
			DAEUtil.queryChildSelector(el, DAEBlinn.TagName)
		);
		value.constant = DAEConstant.parse(
			DAEUtil.queryChildSelector(el, DAEConstant.TagName)
		);
		value.lambert = DAELambert.parse(
			DAEUtil.queryChildSelector(el, DAELambert.TagName)
		);
		value.phong = DAEPhong.parse(
			DAEUtil.queryChildSelector(el, DAEPhong.TagName)
		);
		value.passes = DAEPass.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAETechniqueFX> {
		return DAEUtil.parseArray<DAETechniqueFX>(
			this.parse, parent, DAETechniqueFX.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAETechniqueFX.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.annotates);
		DAEUtil.addElement(el, this.blinn);
		DAEUtil.addElement(el, this.constant);
		DAEUtil.addElement(el, this.lambert);
		DAEUtil.addElement(el, this.phong);
		DAEUtil.addElementArray(el, this.passes);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
