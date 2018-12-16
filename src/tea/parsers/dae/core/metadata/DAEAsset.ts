import { DAEUtil } from "../../DAEUtil";
import { DAEContributor } from "./DAEContributor";
import { DAEUnit } from "./DAEUnit";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: 
// core: animation, animation_clip, camera, COLLADA, controller,
// evaluate_scene, extra, geometry, light, node, source, visual_scene
// all section:
// library_*
export class DAEAsset {
	static readonly TagName: string = "asset";
	contributor?: DAEContributor;
	//coverage: DAECoverage;
	created: Date;
	keywords?: Array<string>;
	modified: Date;
	revision?: string;
	subject?: string;
	title?: string;
	unit?: DAEUnit;
	upAxis?: string;
	extras?: Array<DAEExtra>;

	constructor() {
		this.contributor = null;
		this.created = null;
		this.keywords = null;
		this.modified = null;
		this.revision = null;
		this.subject = null;
		this.title = null;
		this.unit = null;
		this.upAxis = null;
		this.extras = null;
	}

	static parse(el: Element): DAEAsset {
		if (el == null) {
			return null;
		}
		var value = new DAEAsset();
		value.contributor = DAEContributor.parse(
			DAEUtil.queryChildSelector(el, DAEContributor.TagName)
		);
		value.created = new Date(DAEUtil.getStringContent(el, "created"));
		value.keywords = DAEUtil.getStringArrayContent(
			DAEUtil.queryChildSelector(el, "keywords")
		);
		value.modified = new Date(DAEUtil.getStringContent(el, "modified"));
		value.revision = DAEUtil.getStringContent(el, "revision");
		value.subject = DAEUtil.getStringContent(el, "subject");
		value.title = DAEUtil.getStringContent(el, "title");
		value.unit = DAEUnit.parse(
			DAEUtil.queryChildSelector(el, DAEUnit.TagName)
		);
		value.upAxis = DAEUtil.getStringContent(el, "up_axis");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEAsset> {
		return DAEUtil.parseArray<DAEAsset>(
			this.parse, parent, DAEAsset.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEAsset.TagName);
		DAEUtil.addElement(el, this.contributor);
		DAEUtil.addDateContent(el, "created", this.created);
		DAEUtil.addStringArrayContent(el, "keywords", this.keywords);
		DAEUtil.addDateContent(el, "modified", this.modified);
		DAEUtil.addStringContent(el, "revision", this.revision);
		DAEUtil.addStringContent(el, "subject", this.subject);
		DAEUtil.addStringContent(el, "title", this.title);
		DAEUtil.addElement(el, this.unit);
		DAEUtil.addStringContent(el, "up_axis", this.upAxis);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
