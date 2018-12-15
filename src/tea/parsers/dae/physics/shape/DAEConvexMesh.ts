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
	static readonly TagName: string = "convex_mesh";
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
			DAEUtil.queryChildSelector(el, "vertices")
		);
		value.lines = DAELines.parse(
			DAEUtil.queryChildSelector(el, DAELines.TagName)
		);
		value.linestrips = DAELinestrips.parse(
			DAEUtil.queryChildSelector(el, DAELinestrips.TagName)
		);
		value.polygons = DAEPolygons.parse(
			DAEUtil.queryChildSelector(el, DAEPolygons.TagName)
		);
		value.polylist = DAEPolylist.parse(
			DAEUtil.queryChildSelector(el, DAEPolylist.TagName)
		);
		value.triangles = DAETriangles.parse(
			DAEUtil.queryChildSelector(el, DAETriangles.TagName)
		);
		value.trifans = DAETrifans.parse(
			DAEUtil.queryChildSelector(el, DAETrifans.TagName)
		);
		value.tristrips = DAETristrips.parse(
			DAEUtil.queryChildSelector(el, DAETristrips.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEConvexMesh.TagName);
		return el;
	}
}
