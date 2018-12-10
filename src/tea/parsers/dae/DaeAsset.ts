import { DaeContributor } from "./DaeContributor";
import { DaeUnit } from "./DaeUnit";

export class DaeAsset {
	contributor: DaeContributor;
	created: Date;
	modified: Date;
	unit: DaeUnit;
	upAxis: string;

	constructor() {
		this.contributor = null;
		this.created = null;
		this.modified = null;
		this.unit = null;
		this.upAxis = "";
	}

	static parse(el: Element): DaeAsset {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var asset = new DaeAsset();
		var $contributor = el.querySelector("contributor");
		asset.contributor = DaeContributor.parse($contributor);
		var $created = el.querySelector("created");
		asset.created = new Date($created.textContent);
		var $modified = el.querySelector("modified");
		asset.modified = new Date($modified.textContent);
		var $unit = el.querySelector("unit");
		asset.unit = DaeUnit.parse($unit);
		var $upAxis = el.querySelector("up_axis");
		asset.upAxis = $upAxis.textContent;
		return asset;
	}
}
