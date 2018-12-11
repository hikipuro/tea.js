import * as Tea from "../../Tea";
import { FbxHeader } from "./FbxHeader";
import { FbxNode } from "./FbxNode";
import { isArray } from "util";

export class FbxDocument {
	header: FbxHeader;
	nodes: Array<FbxNode>;

	constructor() {
		this.header = null;
		this.nodes = [];
	}

	static parse(reader: Tea.BinaryReader): FbxDocument {
		var document = new FbxDocument();
		document.header = FbxHeader.parse(reader);
		while (reader.isCompleted === false) {
			var node = FbxNode.parse(reader);
			document.nodes.push(node);
			if (node.endOffset === 0) {
				break;
			}
			reader.offset = node.endOffset;
		}
		return document;
	}

	toJSON(): Object {
		if (this.nodes == null) {
			return null;
		}
		var json = {} as any;
		this.nodes.forEach((node: FbxNode) => {
			var nodeJson = node.toJSON();
			if (nodeJson == null) {
				return;
			}
			if (json[node.name] == null) {
				json[node.name] = [];
			}
			json[node.name].push(nodeJson);
		});
		var keys = Object.keys(json);
		keys.forEach((key: string) => {
			if (json[key].length === 1) {
				json[key] = json[key][0];
			}
		});
		return json;
	}

	toMeshes(): Array<Tea.Mesh> {
		var json = this.toJSON() as any;
		if (json == null) {
			return null;
		}
		var geometry = json.Objects.Geometry;
		var mesh = this.createMesh(geometry);
		return [mesh];
	}

	protected createMesh(geometry: any): Tea.Mesh {
		var vertices = geometry.Vertices;
		var indices = geometry.PolygonVertexIndex;
		var normal = geometry.LayerElementNormal;

		switch (normal.MappingInformationType) {
			case "ByPolygon":
				break;
			case "ByVertex":
			case "ByVertice":
				break;
			case "ByPolygonVertex":
				break;
			case "ByEdge":
				break;
			case "AllSame":
				break;
		}

		for (var i = 0; i < indices.length; i++) {
			if (indices[i] < 0) {
				indices[i] = ~indices[i];
			}
		}
		var triangles = [];
		for (var i = 0; i < indices.length; i += 4) {
			var i0 = indices[i + 0];
			var i1 = indices[i + 1];
			var i2 = indices[i + 2];
			var i3 = indices[i + 3];
			triangles.push(i0, i1, i3);
			triangles.push(i1, i2, i3);
		}
		console.log(normal.MappingInformationType)
		console.log(vertices, triangles, normal);
		var mesh = new Tea.Mesh();
		mesh.setVertices(vertices);
		//mesh.normals = normals;
		mesh.setTriangles(triangles);
		mesh.calculateNormals();
		mesh.calculateBounds();
		mesh.uploadMeshData();
		return mesh;
	}
}
