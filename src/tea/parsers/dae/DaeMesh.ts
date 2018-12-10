import * as Tea from "../../Tea";
import { DaeSource } from "./DaeSource";
import { DaeVertices } from "./DaeVertices";
import { DaeTriangles } from "./DaeTriangles";

export class DaeMesh {
	id: string;
	sources: Array<DaeSource>;
	vertices: DaeVertices;
	triangles: DaeTriangles;

	constructor() {
		this.id = "";
		this.sources = [];
		this.vertices = null;
		this.triangles = null;
	}

	static parse(el: Element): DaeMesh {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var mesh = new DaeMesh();
		mesh.id = el.id;
		var $sources = el.querySelectorAll("source");
		for (var i = 0; i < $sources.length; i++) {
			var $source = $sources[i];
			var source = DaeSource.parse($source);
			if (source == null) {
				continue;
			}
			mesh.sources.push(source);
		}
		var $vertices = el.querySelector("vertices");
		mesh.vertices = DaeVertices.parse($vertices);
		var $triangles = el.querySelector("triangles");
		mesh.triangles = DaeTriangles.parse($triangles);
		return mesh;
	}

	findSource(id: string): DaeSource {
		if (id.substr(0, 1) === "#") {
			id = id.substr(1);
		}
		var sources = this.sources;
		return sources.find((source: DaeSource): boolean => {
			return source.id === id;
		});
	}

	findVertexSource(): DaeSource {
		var vertices = this.vertices;
		if (vertices == null) {
			return null;
		}
		var input = vertices.findInput("POSITION");
		if (input == null) {
			return null;
		}
		return this.findSource(input.source);
	}

	findNormalSource(): DaeSource {
		var triangles = this.triangles;
		if (triangles == null) {
			return null;
		}
		var input = triangles.findInput("NORMAL");
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
}
