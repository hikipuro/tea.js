import * as Tea from "../../../../Tea";
import { DAESource } from "../data/DAESource";
import { DAEVertices } from "./DAEVertices";
import { DAELines } from "./DAELines";
import { DAELinestrips } from "./DAELineStrips";
import { DAEPolygons } from "./DAEPolygons";
import { DAEPolylist } from "./DAEPolylist";
import { DAETriangles } from "./DAETriangles";
import { DAETrifans } from "./DAETrifans";
import { DAETristrips } from "./DAETristrips";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAESemantic } from "../data/DAESemantic";

// parent: geometry
export class DAEMesh {
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

	static parse(el: Element): DAEMesh {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEMesh();
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

	findSource(id: string): DAESource {
		if (id.substr(0, 1) === "#") {
			id = id.substr(1);
		}
		var sources = this.sources;
		return sources.find((source: DAESource): boolean => {
			return source.id === id;
		});
	}

	findVertexSource(): DAESource {
		var vertices = this.vertices;
		if (vertices == null) {
			return null;
		}
		var input = vertices.findInput(DAESemantic.POSITION);
		if (input == null) {
			return null;
		}
		return this.findSource(input.source);
	}

	findNormalSource(): DAESource {
		var triangles = this.triangles;
		if (triangles == null) {
			return null;
		}
		var input = triangles.findInput(DAESemantic.NORMAL);
		if (input == null) {
			return null;
		}
		return this.findSource(input.source);
	}

	toMesh(): Tea.Mesh {
		var vertexSource = this.findVertexSource();
		var normalSource = this.findNormalSource();
		if (vertexSource == null || normalSource == null) {
			console.log(vertexSource, normalSource);
			return null;
		}
		var vertices = vertexSource.toVector3Array();
		var tmpNormals = normalSource.toVector3Array();
		var triangles = this.triangles.toVector3Array(0, vertices.length * 3, 2);
		var normals = [];
		var indices = this.triangles.toVector3Array(1, tmpNormals.length, 2);
		for (var i = 0; i < indices.length; i++) {
			var index = indices[i][0];
			normals.push(tmpNormals[index]);
		}
		//console.log(vertices);
		//console.log(triangles);
		//console.log(normals);
		var mesh = new Tea.Mesh();
		mesh.vertices = vertices;
		//mesh.normals = normals;
		mesh.triangles = triangles;
		mesh.calculateNormals();
		mesh.calculateBounds();
		mesh.uploadMeshData();
		return mesh;
	}

	toXML(): Element {
		var el = document.createElement("mesh");
		return el;
	}
}
