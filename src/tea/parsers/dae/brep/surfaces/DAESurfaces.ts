import { DAEUtil } from "../../DAEUtil";
import { DAESurfaceBrep } from "./DAESurfaceBrep";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: brep
export class DAESurfaces {
	static readonly TagName: string = "surfaces";
	surfaces: Array<DAESurfaceBrep>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.surfaces = null;
		this.extras = null;
	}

	static parse(el: Element): DAESurfaces {
		if (el == null) {
			return null;
		}
		var value = new DAESurfaces();
		value.surfaces = DAESurfaceBrep.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESurfaces.TagName);
		DAEUtil.addElementArray(el, this.surfaces);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
