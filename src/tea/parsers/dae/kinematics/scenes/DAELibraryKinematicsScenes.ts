import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEExtra } from "../../core/extensibility/DAEExtra";
import { DAEKinematicsScene } from "./DAEKinematicsScene";

// parent: COLLADA
export class DAELibraryKinematicsScenes {
	static readonly TagName: string = "library_kinematics_scenes";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	kinematicsScenes: Array<DAEKinematicsScene>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.kinematicsScenes = null;
		this.extras = null;
	}

	static parse(el: Element): DAELibraryKinematicsScenes {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryKinematicsScenes();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.kinematicsScenes = DAEKinematicsScene.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryKinematicsScenes.TagName);
		return el;
	}
}
