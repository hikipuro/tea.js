import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEJoint } from "./DAEJoint";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryJoints {
	static readonly TagName: string = "library_joints";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	joints: Array<DAEJoint>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.joints = null;
		this.extras = null;
	}

	static parse(el: Element): DAELibraryJoints {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryJoints();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.joints = DAEJoint.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryJoints.TagName);
		return el;
	}
}
