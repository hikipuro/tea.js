import { DAEAsset } from "./DAEAsset";

export class DAEExtra {
	id?: string;
	name?: string;
	type?: string;
	asset?: DAEAsset;
	//technique: DAETechnique;

	constructor() {
		this.id = null;
		this.name = null;
		this.type = null;
		this.asset = null;
	}

	static parse(el: Element): DAEExtra {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var extra = new DAEExtra();
		extra.id = el.id;
		extra.name = el.getAttribute("name");
		extra.type = el.getAttribute("type");
		var $asset = el.querySelector("asset");
		extra.asset = DAEAsset.parse($asset);
		return extra;
	}
}
