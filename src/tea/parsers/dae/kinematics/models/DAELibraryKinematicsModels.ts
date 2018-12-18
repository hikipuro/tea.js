import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEKinematicsModel } from "./DAEKinematicsModel";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryKinematicsModels {
	static readonly TagName: string = "library_kinematics_models";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	kinematicsModels: Array<DAEKinematicsModel>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.kinematicsModels = null;
		this.extras = null;
	}

	static parse(el: Element): DAELibraryKinematicsModels {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryKinematicsModels();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.kinematicsModels = DAEKinematicsModel.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryKinematicsModels.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.kinematicsModels);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
