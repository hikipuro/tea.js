import { DAEUtil } from "./../DAEUtil";
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
			el.querySelector("contributor")
		);
		value.created = new Date(DAEUtil.textContent(el, "created"));
		value.keywords = DAEUtil.stringArray(
			el.querySelector("keywords")
		);
		value.modified = new Date(DAEUtil.textContent(el, "modified"));
		value.revision = DAEUtil.textContent(el, "revision");
		value.subject = DAEUtil.textContent(el, "subject");
		value.title = DAEUtil.textContent(el, "title");
		value.unit = DAEUnit.parse(
			el.querySelector("unit")
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
		if (this.contributor) {
			el.appendChild(this.contributor.toXML());
		}
		if (this.created) {
			var created = document.createElement("created");
			created.textContent = DAEUtil.formatDate(this.created);
			el.appendChild(created);
		}
		if (this.modified) {
			var modified = document.createElement("modified");
			modified.textContent = DAEUtil.formatDate(this.modified);
			el.appendChild(modified);
		}
		if (this.unit) {
			el.appendChild(this.unit.toXML());
		}
		if (this.upAxis) {
			var upAxis = document.createElement("up_axis");
			upAxis.textContent = this.upAxis;
			el.appendChild(upAxis);
		}
		return el;
	}
}
