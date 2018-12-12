import { DAEContributor } from "./DAEContributor";
import { DAEUnit } from "./DAEUnit";

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
		var $created = el.querySelector("created");
		asset.created = new Date($created.textContent);
		var $modified = el.querySelector("modified");
		asset.modified = new Date($modified.textContent);
		var $unit = el.querySelector("unit");
		asset.unit = DAEUnit.parse($unit);
		var $upAxis = el.querySelector("up_axis");
		asset.upAxis = $upAxis.textContent;
		return asset;
	}
}
