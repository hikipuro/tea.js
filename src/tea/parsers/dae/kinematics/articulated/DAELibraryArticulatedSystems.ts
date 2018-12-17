import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEArticulatedSystem } from "./DAEArticulatedSystem";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryArticulatedSystems {
	static readonly TagName: string = "library_articulated_systems";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	articulatedSystems: Array<DAEArticulatedSystem>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.articulatedSystems = null;
		this.extras = null;
	}

	static parse(el: Element): DAELibraryArticulatedSystems {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryArticulatedSystems();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.articulatedSystems = DAEArticulatedSystem.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryArticulatedSystems.TagName);
		return el;
	}
}
