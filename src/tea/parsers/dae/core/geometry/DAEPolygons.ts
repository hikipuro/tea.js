import { DAEUtil } from "../../DAEUtil";
import { DAEPrimitiveElement } from "./DAEPrimitiveElement";
import { DAESharedInput } from "../data/DAESharedInput";
import { DAEExtra } from "../extensibility/DAEExtra";

export class DAEPolygonsP {
	static readonly TagName: string = "p";
	data: Array<number>;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAEPolygonsP {
		if (el == null) {
			return null;
		}
		var value = new DAEPolygonsP();
		value.data = DAEUtil.getIntArrayContent(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPolygonsP> {
		return DAEUtil.parseArray<DAEPolygonsP>(
			this.parse, parent, DAEPolygonsP.TagName
		);
	}
}

export class DAEPolygonsH {
	static readonly TagName: string = "h";
	data: Array<number>;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAEPolygonsH {
		if (el == null) {
			return null;
		}
		var value = new DAEPolygonsH();
		value.data = DAEUtil.getIntArrayContent(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPolygonsH> {
		return DAEUtil.parseArray<DAEPolygonsH>(
			this.parse, parent, DAEPolygonsH.TagName
		);
	}
}

export class DAEPolygonsPH {
	static readonly TagName: string = "ph";
	p: DAEPolygonsP;
	h: Array<DAEPolygonsH>;

	constructor() {
		this.p = null;
		this.h = null;
	}

	static parse(el: Element): DAEPolygonsPH {
		if (el == null) {
			return null;
		}
		var value = new DAEPolygonsPH();
		value.p = DAEPolygonsP.parse(
			DAEUtil.queryChildSelector(el, DAEPolygonsP.TagName)
		);
		value.h = DAEPolygonsH.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPolygonsPH> {
		return DAEUtil.parseArray<DAEPolygonsPH>(
			this.parse, parent, DAEPolygonsPH.TagName
		);
	}
}

// parent: mesh, convex_mesh
export class DAEPolygons implements DAEPrimitiveElement {
	static readonly TagName: string = "polygons";
	count: number;
	material: string;
	name?: string;
	inputs?: Array<DAESharedInput>;
	p: Array<DAEPolygonsP>;
	ph: Array<DAEPolygonsPH>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.count = 0;
		this.material = "";
		this.name = null;
		this.inputs = null;
	}

	static parse(el: Element): DAEPolygons {
		if (el == null) {
			return null;
		}
		var value = new DAEPolygons();
		value.count = DAEUtil.getIntAttr(el, "count");
		value.material = DAEUtil.getStringAttr(el, "material");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.inputs = DAESharedInput.parseArray(el);
		value.p = DAEPolygonsP.parseArray(el);
		value.ph = DAEPolygonsPH.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPolygons> {
		return DAEUtil.parseArray<DAEPolygons>(
			this.parse, parent, DAEPolygons.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEPolygons.TagName);
		DAEUtil.setAttr(el, "count", this.count);
		DAEUtil.setAttr(el, "material", this.material);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElementArray(el, this.inputs);
		DAEUtil.addElementArray(el, this.p);
		DAEUtil.addElementArray(el, this.ph);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
