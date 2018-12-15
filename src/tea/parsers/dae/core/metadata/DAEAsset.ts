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
			//console.error("parse error");
			return null;
		}
		var value = new DAEAsset();
		value.contributor = DAEContributor.parse(
			el.querySelector(":scope > contributor")
		);
		value.created = new Date(DAEUtil.textContent(el, "created"));
		value.keywords = DAEUtil.stringArray(
			el.querySelector(":scope > keywords")
		);
		value.modified = new Date(DAEUtil.textContent(el, "modified"));
		value.revision = DAEUtil.textContent(el, "revision");
		value.subject = DAEUtil.textContent(el, "subject");
		value.title = DAEUtil.textContent(el, "title");
		value.unit = DAEUnit.parse(
			el.querySelector(":scope > unit")
		);
		value.upAxis = DAEUtil.textContent(el, "up_axis");
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEAsset> {
		return DAEUtil.parseArray<DAEAsset>(
			this.parse, parent, "asset"
		);
	}

	toXML(): Element {
		var el = document.createElement("asset");
		DAEUtil.addXML(el, this.contributor);
		var created = this.toDateElement("created", this.created);
		if (created != null) {
			el.appendChild(created);
		}
		DAEUtil.addTextArray(el, "keywords", this.keywords);
		var modified = this.toDateElement("modified", this.modified);
		if (modified != null) {
			el.appendChild(modified);
		}
		DAEUtil.addTextContent(el, "revision", this.revision);
		DAEUtil.addTextContent(el, "subject", this.subject);
		DAEUtil.addTextContent(el, "title", this.title);
		DAEUtil.addXML(el, this.unit);
		DAEUtil.addTextContent(el, "up_axis", this.upAxis);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}

	protected toDateElement(name: string, date: Date): Element {
		if (name == null || date == null) {
			return null;
		}
		var el = document.createElement(name);
		el.textContent = DAEUtil.formatDate(date);
		return el;
	}
}
