import * as Tea from "../../Tea";
import { DAEMesh } from "./DAEMesh";
import { DAEUtil } from "./DAEUtil";

export class DAEGeometry {
	id?: string;
	name?: string;
	meshes: Array<DAEMesh>;

	constructor() {
		this.id = null;
		this.name = null;
		this.meshes = [];
	}

	static parse(el: Element): DAEGeometry {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var geometry = new DAEGeometry();
		geometry.id = el.id;
		geometry.name = el.getAttribute("name");
		geometry.meshes = DAEMesh.parseArray(el, "mesh");
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

	toXML(): Element {
		var el = document.createElement("geometry");
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		if (this.meshes) {
			this.meshes.forEach((mesh: DAEMesh) => {
				if (mesh == null) {
					return;
				}
				el.appendChild(mesh.toXML());
			});
		}
		return el;
	}
}
