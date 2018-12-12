import { DAEContributor } from "./DAEContributor";
import { DAEUnit } from "./DAEUnit";
import { DAEUtil } from "./DAEUtil";

export class DAEAsset {
	contributor: DAEContributor;
	created: Date;
	modified: Date;
	unit: DAEUnit;
	upAxis: string;

	constructor() {
		this.contributor = null;
		this.created = null;
		this.modified = null;
		this.unit = null;
		this.upAxis = "";
	}

	static parse(el: Element): DAEAsset {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var asset = new DAEAsset();
		var $contributor = el.querySelector("contributor");
		asset.contributor = DAEContributor.parse($contributor);
		asset.created = new Date(DAEUtil.textContent(el, "created"));
		asset.modified = new Date(DAEUtil.textContent(el, "modified"));
		var $unit = el.querySelector("unit");
		asset.unit = DAEUnit.parse($unit);
		asset.upAxis = DAEUtil.textContent(el, "up_axis")
		return asset;
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
