import { DAEUtil } from "../../DAEUtil";
import { DAEBindKinematics } from "../articulated/DAEBindKinematics";
import { DAESetparam } from "../../core/parameters/DAESetParam";
import { DAENewparam } from "../../core/parameters/DAENewparam";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: kinematics_scene, kinematics
export class DAEInstanceKinematicsModel {
	static readonly TagName: string = "instance_kinematics_model";
	sid?: string;
	name?: string;
	url: string;
	binds?: Array<DAEBindKinematics>;
	setparams?: Array<DAESetparam>;
	newparams?: Array<DAENewparam>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.binds = null;
		this.setparams = null;
		this.newparams = null;
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceKinematicsModel {
		if (el == null) {
			return null;
		}
		var value = new DAEInstanceKinematicsModel();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url");
		value.binds = DAEBindKinematics.parseArray(el);
		value.setparams = DAESetparam.parseArray(el);
		value.newparams = DAENewparam.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEInstanceKinematicsModel> {
		return DAEUtil.parseArray<DAEInstanceKinematicsModel>(
			this.parse, parent, DAEInstanceKinematicsModel.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceKinematicsModel.TagName);
		return el;
	}
}
