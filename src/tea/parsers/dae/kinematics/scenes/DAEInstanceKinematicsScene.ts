import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAENewparam } from "../../core/parameters/DAENewparam";
import { DAESetparam } from "../../core/parameters/DAESetParam";
import { DAEBindKinematicsModel } from "./DAEBindKinematicsModel";
import { DAEBindJointAxis } from "./DAEBindJointAxis";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: scene
export class DAEInstanceKinematicsScene {
	static readonly TagName: string = "instance_kinematics_scene";
	sid?: string;
	name?: string;
	url: string;
	asset?: DAEAsset;
	newparams?: Array<DAENewparam>;
	setparams?: Array<DAESetparam>;
	bindKinematicsModels?: Array<DAEBindKinematicsModel>;
	bindJointAxes?: Array<DAEBindJointAxis>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sid = null;
		this.name = null;
		this.url = "";
		this.asset = null;
		this.newparams = null;
		this.setparams = null;
		this.bindKinematicsModels = null;
		this.bindJointAxes = null;
		this.extras = null;
	}

	static parse(el: Element): DAEInstanceKinematicsScene {
		if (el == null) {
			return null;
		}
		var value = new DAEInstanceKinematicsScene();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.url = DAEUtil.getStringAttr(el, "url");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.newparams = DAENewparam.parseArray(el);
		value.setparams = DAESetparam.parseArray(el);
		value.bindKinematicsModels = DAEBindKinematicsModel.parseArray(el);
		value.bindJointAxes = DAEBindJointAxis.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEInstanceKinematicsScene.TagName);
		return el;
	}
}
