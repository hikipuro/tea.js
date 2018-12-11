import * as Tea from "../../Tea";
import { FbxHeader } from "./FbxHeader";
import { FbxNode } from "./FbxNode";

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
		if (geometry == null) {
			return null;
		}
		var vertices = this.createVertices(geometry.Vertices);
		var triangles = this.createTriangles(geometry.PolygonVertexIndex);
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

		console.log(normal.MappingInformationType)
		console.log(vertices, triangles, normal);
		var mesh = new Tea.Mesh();
		mesh.vertices = vertices;
		//mesh.normals = normals;
		mesh.triangles = triangles;
		mesh.calculateNormals();
		mesh.calculateBounds();
		mesh.uploadMeshData();
		return mesh;
	}

	protected createVertices(vertices: any): Array<Tea.Vector3> {
		if (vertices == null) {
			return null;
		}
		var result = [];
		var length = vertices.length;
		for (var i = 0; i < length; i += 3) {
			var x = vertices[i + 0];
			var y = vertices[i + 1];
			var z = vertices[i + 2];
			result.push(new Tea.Vector3(x, y, z));
		}
		return result;
	}

	protected createTriangles(indices: any): Array<Tea.Vector3> {
		if (indices == null) {
			return null;
		}
		var length = indices.length;
		for (var i = 0; i < length; i++) {
			if (indices[i] < 0) {
				indices[i] = ~indices[i];
			}
		}
		var result = [];
		for (var i = 0; i < length; i += 4) {
			var i0 = indices[i + 0];
			var i1 = indices[i + 1];
			var i2 = indices[i + 2];
			var i3 = indices[i + 3];
			result.push(new Tea.Vector3(i0, i1, i3));
			result.push(new Tea.Vector3(i1, i2, i3));
		}
		return result;
	}
}
