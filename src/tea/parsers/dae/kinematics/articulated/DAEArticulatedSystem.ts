import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEKinematics } from "./DAEKinematics";
import { DAEMotion } from "./DAEMotion";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: library_articulated_systems
export class DAEArticulatedSystem {
	static readonly TagName: string = "articulated_system";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	kinematics: DAEKinematics;
	motion: DAEMotion;
	extras?: Array<DAEExtra>;
	
	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.kinematics = null;
		this.motion = null;
		this.extras = null;
	}

	static parse(el: Element): DAEArticulatedSystem {
		if (el == null) {
			return null;
		}
		var value = new DAEArticulatedSystem();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.kinematics = DAEKinematics.parse(
			DAEUtil.queryChildSelector(el, DAEKinematics.TagName)
		);
		value.motion = DAEMotion.parse(
			DAEUtil.queryChildSelector(el, DAEMotion.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEArticulatedSystem> {
		return DAEUtil.parseArray<DAEArticulatedSystem>(
			this.parse, parent, DAEArticulatedSystem.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEArticulatedSystem.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		if (this.kinematics != null) {
			DAEUtil.addElement(el, this.kinematics);
		} else {
			DAEUtil.addElement(el, this.motion);
		}
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
