import { DAEUtil } from "../../DAEUtil";
import { DAESurfaceElement } from "./DAESurfaceElement";
import { DAEOrient } from "../transformation/DAEOrient";
import { DAEOrigin } from "../transformation/DAEOrigin";

// parent: surfaces
export class DAESurfaceBrep {
	static readonly TagName: string = "surface";
	sid?: string;
	name?: string;
	surfaceElement: DAESurfaceElement;
	orients?: Array<DAEOrient>;
	origin: DAEOrigin;

	constructor() {
		this.sid = null;
		this.name = null;
		this.surfaceElement = null;
		this.orients = null;
		this.origin = null;
	}

	static parse(el: Element): DAESurfaceBrep {
		if (el == null) {
			return null;
		}
		var value = new DAESurfaceBrep();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.surfaceElement = DAESurfaceElement.parse(el);
		value.orients = DAEOrient.parseArray(el);
		value.origin = DAEOrigin.parse(
			DAEUtil.queryChildSelector(el, DAEOrigin.TagName)
		);
		return value;
	}

	static parseArray(parent: Element): Array<DAESurfaceBrep> {
		return DAEUtil.parseArray<DAESurfaceBrep>(
			this.parse, parent, DAESurfaceBrep.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAESurfaceBrep.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.surfaceElement);
		DAEUtil.addElementArray(el, this.orients);
		DAEUtil.addElement(el, this.origin);
		return el;
	}
}
