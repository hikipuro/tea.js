import * as Tea from "../../Tea";
import { DaeFloatArray } from "./DaeFloatArray";
import { DaeTechniqueCommon } from "./DaeTechniqueCommon";

export class DaeSource {
	id: string;
	floatArray: DaeFloatArray;
	techniqueCommon: DaeTechniqueCommon;

	constructor() {
		this.id = "";
		this.floatArray = null;
		this.techniqueCommon = null;
	}

	static parse(el: Element): DaeSource {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var source = new DaeSource();
		source.id = el.id;
		var $float_array = el.querySelector("float_array");
		var floatArray = DaeFloatArray.parse($float_array);
		source.floatArray = floatArray;
		var $technique_common = el.querySelector("technique_common");
		var techniqueCommon = DaeTechniqueCommon.parse($technique_common);
		source.techniqueCommon = techniqueCommon;
		return source;
	}

	toVector3Array(): Array<Tea.Vector3> {
		var floatArray = this.floatArray;
		if (floatArray == null) {
			return null;
		}
		return floatArray.toVector3Array();
	}
}
