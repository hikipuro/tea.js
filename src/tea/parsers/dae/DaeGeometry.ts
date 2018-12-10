import * as Tea from "../../Tea";
import { DaeMesh } from "./DaeMesh";

export class DaeGeometry {
	id: string;
	name: string;
	meshes: Array<DaeMesh>;

	constructor() {
		this.id = "";
		this.name = "";
		this.meshes = [];
	}

	static parse(el: Element): DaeGeometry {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var geometry = new DaeGeometry();
		geometry.id = el.id;
		geometry.name = el.getAttribute("name");
		var $meshes = el.querySelectorAll("mesh");
		for (var i = 0; i < $meshes.length; i++) {
			var $mesh = $meshes[i];
			var mesh = DaeMesh.parse($mesh);
			if (mesh == null) {
				continue;
			}
			geometry.meshes.push(mesh);
		}
		return geometry;
	}

	toMeshes(): Array<Tea.Mesh> {
		var meshes = this.meshes;
		if (meshes == null || meshes.length <= 0) {
			return null;
		}
		var array = [];
		var length = meshes.length;
		for (var i = 0; i < length; i++) {
			var daeMesh = meshes[i];
			var mesh = daeMesh.toMesh();
			if (mesh == null) {
				continue;
			}
			array.push(mesh);
		}
		return array;
	}
}
