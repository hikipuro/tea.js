import * as Tea from "../../../Tea";
import { DAEUtil } from "../DAEUtil";
import { DAESource } from "../data/DAESource";
import { DAEVertices } from "./DAEVertices";
import { DAETriangles } from "./DAETriangles";
import { DAESemantic } from "../data/DAESemantic";

export class DAEMesh {
	id: string;
	sources: Array<DAESource>;
	vertices: DAEVertices;
	triangles: DAETriangles;

	constructor() {
		this.id = "";
		this.sources = [];
		this.vertices = null;
		this.triangles = null;
	}

	static parse(el: Element): DAEMesh {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEMesh();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.sources = DAESource.parseArray(el);
		value.vertices = DAEVertices.parse(
			el.querySelector("vertices")
		);
		value.triangles = DAETriangles.parse(
			el.querySelector("triangles")
		);
		return value;
	}

	static parseArray(el: Element): Array<DAEMesh> {
		return DAEUtil.parseArray<DAEMesh>(
			this.parse, el, "mesh"
		);
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
		DAEUtil.setAttribute(el, "id", this.id);
		return el;
	}
}
