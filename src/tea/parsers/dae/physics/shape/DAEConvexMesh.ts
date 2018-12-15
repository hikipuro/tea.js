import { DAEUtil } from "../../DAEUtil";
import { DAEGeometricElement } from "../../core/geometry/DAEGeometricElement";
import { DAESource } from "../../core/data/DAESource";
import { DAEVertices } from "../../core/geometry/DAEVertices";
import { DAELines } from "../../core/geometry/DAELines";
import { DAELinestrips } from "../../core/geometry/DAELineStrips";
import { DAEPolygons } from "../../core/geometry/DAEPolygons";
import { DAEPolylist } from "../../core/geometry/DAEPolylist";
import { DAETriangles } from "../../core/geometry/DAETriangles";
import { DAETrifans } from "../../core/geometry/DAETrifans";
import { DAETristrips } from "../../core/geometry/DAETristrips";
import { DAEExtra } from "../../core/extensibility/DAEExtra";
import { DAESemanticType } from "../../core/data/DAESemanticType";

// parent: geometry
export class DAEConvexMesh implements DAEGeometricElement {
	convexHullOf: string;
	sources: Array<DAESource>;
	vertices: DAEVertices;
	lines?: DAELines;
	linestrips?: DAELinestrips;
	polygons?: DAEPolygons;
	polylist?: DAEPolylist;
	triangles?: DAETriangles;
	trifans?: DAETrifans;
	tristrips?: DAETristrips;
	extras?: Array<DAEExtra>;

	constructor() {
		this.convexHullOf = null;
		this.sources = [];
		this.vertices = null;
		this.lines = null;
		this.linestrips = null;
		this.polygons = null;
		this.polylist = null;
		this.triangles = null;
		this.trifans = null;
		this.tristrips = null;
		this.extras = null;
	}

	static parse(el: Element): DAEConvexMesh {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEConvexMesh();
		value.convexHullOf = DAEUtil.stringAttrib(el, "convex_hull_of");
		value.sources = DAESource.parseArray(el);
		value.vertices = DAEVertices.parse(
			el.querySelector(":scope > vertices")
		);
		value.lines = DAELines.parse(
			el.querySelector(":scope > lines")
		);
		value.linestrips = DAELinestrips.parse(
			el.querySelector(":scope > linestrips")
		);
		value.polygons = DAEPolygons.parse(
			el.querySelector(":scope > polygons")
		);
		value.polylist = DAEPolylist.parse(
			el.querySelector(":scope > polylist")
		);
		value.triangles = DAETriangles.parse(
			el.querySelector(":scope > triangles")
		);
		value.trifans = DAETrifans.parse(
			el.querySelector(":scope > trifans")
		);
		value.tristrips = DAETristrips.parse(
			el.querySelector(":scope > tristrips")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement("convex_mesh");
		return el;
	}
}
