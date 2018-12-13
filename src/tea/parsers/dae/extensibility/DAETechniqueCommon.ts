import { DAEAccessor } from "../data/DAEAccessor";

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
		var value = new DAETechniqueCommon();
		value.accessor = DAEAccessor.parse(
			el.querySelector("accessor")
		);
		return value;
	}
}
