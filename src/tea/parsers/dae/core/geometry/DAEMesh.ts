import * as Tea from "../../../../Tea";
import { DAEUtil } from "../../DAEUtil";
import { DAEGeometricElement } from "./DAEGeometricElement";
import { DAEPrimitiveElement } from "./DAEPrimitiveElement";
import { DAESource } from "../data/DAESource";
import { DAEVertices } from "./DAEVertices";
import { DAEExtra } from "../extensibility/DAEExtra";
import { DAESemanticType } from "../data/DAESemanticType";

// parent: geometry
export class DAEMesh implements DAEGeometricElement {
	static readonly TagName: string = "mesh";
	sources: Array<DAESource>;
	vertices: DAEVertices;
	primitiveElements?: Array<DAEPrimitiveElement>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.sources = [];
		this.vertices = null;
		this.primitiveElements = null;
		this.extras = null;
	}

	static parse(el: Element): DAEMesh {
		if (el == null) {
			return null;
		}
		var value = new DAEMesh();
		value.sources = DAESource.parseArray(el);
		value.vertices = DAEVertices.parse(
			DAEUtil.queryChildSelector(el, DAEVertices.TagName)
		);
		value.primitiveElements = DAEPrimitiveElement.parseArray(el);
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
		var input = vertices.findInput(DAESemanticType.POSITION);
		if (input == null) {
			return null;
		}
		return this.findSource(input.source);
	}

	findNormalSource(): DAESource {
		return null;
		/*
		var triangles = this.triangles;
		if (triangles == null) {
			return null;
		}
		var input = triangles.findInput(DAESemantic.NORMAL);
		if (input == null) {
			return null;
		}
		return this.findSource(input.source);
		*/
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
		/*
		var triangles = this.triangles.toVector3Array(0, vertices.length * 3, 2);
		var normals = [];
		var indices = this.triangles.toVector3Array(1, tmpNormals.length, 2);
		for (var i = 0; i < indices.length; i++) {
			var index = indices[i][0];
			normals.push(tmpNormals[index]);
		}
		*/
		//console.log(vertices);
		//console.log(triangles);
		//console.log(normals);
		var mesh = new Tea.Mesh();
		mesh.vertices = vertices;
		//mesh.normals = normals;
		//mesh.triangles = triangles;
		mesh.calculateNormals();
		mesh.calculateBounds();
		mesh.uploadMeshData();
		return mesh;
	}

	toXML(): Element {
		var el = document.createElement(DAEMesh.TagName);
		DAEUtil.addElementArray(el, this.sources);
		DAEUtil.addElement(el, this.vertices);
		DAEUtil.addElementArray(el, this.primitiveElements);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
