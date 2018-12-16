import { DAEUtil } from "../../DAEUtil";
import { DAEGeometricElement } from "../../core/geometry/DAEGeometricElement";
import { DAESource } from "../../core/data/DAESource";
import { DAEVertices } from "../../core/geometry/DAEVertices";
import { DAEPrimitiveElement } from "../../core/geometry/DAEPrimitiveElement";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: geometry
export class DAEConvexMesh implements DAEGeometricElement {
	static readonly TagName: string = "convex_mesh";
	convexHullOf: string;
	sources: Array<DAESource>;
	vertices?: DAEVertices;
	primitiveElements: Array<DAEPrimitiveElement>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.convexHullOf = null;
		this.sources = [];
		this.vertices = null;
		this.primitiveElements = null;
		this.extras = null;
	}

	static parse(el: Element): DAEConvexMesh {
		if (el == null) {
			return null;
		}
		var value = new DAEConvexMesh();
		value.convexHullOf = DAEUtil.getStringAttr(el, "convex_hull_of");
		value.sources = DAESource.parseArray(el);
		value.vertices = DAEVertices.parse(
			DAEUtil.queryChildSelector(el, "vertices")
		);
		value.primitiveElements = DAEPrimitiveElement.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEConvexMesh.TagName);
		DAEUtil.setAttr(el, "convex_hull_of", this.convexHullOf);
		DAEUtil.addElementArray(el, this.sources);
		DAEUtil.addElement(el, this.vertices);
		DAEUtil.addElementArray(el, this.primitiveElements);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
