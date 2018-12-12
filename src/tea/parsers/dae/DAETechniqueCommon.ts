import { DAEAccessor } from "./DAEAccessor";

export class DAETechniqueCommon {
	accessor: DAEAccessor;

	constructor() {
		this.accessor = null;
	}

	static parse(el: Element): DAETechniqueCommon {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var technique = new DAETechniqueCommon();
		var $accessor = el.querySelector("accessor");
		technique.accessor = DAEAccessor.parse($accessor);
		return technique;
	}
}
