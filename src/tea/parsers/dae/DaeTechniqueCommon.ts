import { DaeAccessor } from "./DaeAccessor";

export class DaeTechniqueCommon {
	accessor: DaeAccessor;

	constructor() {
		this.accessor = null;
	}

	static parse(el: Element): DaeTechniqueCommon {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var technique = new DaeTechniqueCommon();
		var $accessor = el.querySelector("accessor");
		var accessor = DaeAccessor.parse($accessor);
		technique.accessor = accessor;
		return technique;
	}
}
