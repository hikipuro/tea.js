import { DAEUtil } from "../../DAEUtil";
import { DAEInput } from "../data/DAEInput";
import { DAEExtra } from "../extensibility/DAEExtra";

export class DAEPolygonsP {
	data: Array<number>;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAEPolygonsP {
		if (el == null) {
			return null;
		}
		var value = new DAEPolygonsP();
		value.data = DAEUtil.intArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPolygonsP> {
		return DAEUtil.parseArray<DAEPolygonsP>(
			this.parse, parent, "p"
		);
	}
}

export class DAEPolygonsH {
	data: Array<number>;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAEPolygonsH {
		if (el == null) {
			return null;
		}
		var value = new DAEPolygonsH();
		value.data = DAEUtil.intArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPolygonsH> {
		return DAEUtil.parseArray<DAEPolygonsH>(
			this.parse, parent, "h"
		);
	}
}

export class DAEPolygonsPH {
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
			el.querySelector(":scope > p")
		);
		value.h = DAEPolygonsH.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEPolygonsPH> {
		return DAEUtil.parseArray<DAEPolygonsPH>(
			this.parse, parent, "ph"
		);
	}
}

// parent: mesh, convex_mesh
export class DAEPolygons {
	count: number;
	material: string;
	name?: string;
	inputs?: Array<DAEInput>;
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
			//console.error("parse error");
			return null;
		}
		var value = new DAEPolygons();
		value.count = DAEUtil.intAttrib(el, "count");
		value.material = DAEUtil.stringAttrib(el, "material");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.inputs = DAEInput.parseArray(el);
		value.p = DAEPolygonsP.parseArray(el);
		value.ph = DAEPolygonsPH.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}
}
