import * as Tea from "../../../Tea";
import { DAEUtil } from "../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAEMesh } from "./DAEMesh";
import { DAESpline } from "./DAESpline";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: library_geometries
export class DAEGeometry {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	//convexMesh: any;
	mesh: DAEMesh;
	spline: DAESpline;
	//brep: any;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.mesh = null;
		this.spline = null;
		this.extras = null;
	}

	static parse(el: Element): DAEGeometry {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEGeometry();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector("asset")
		);
		value.mesh = DAEMesh.parse(
			el.querySelector("mesh")
		);
		value.spline = DAESpline.parse(
			el.querySelector("spline")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toMesh(): Tea.Mesh {
		var mesh = this.mesh;
		if (mesh == null) {
			return null;
		}
		return mesh.toMesh();
	}

	toXML(): Element {
		var el = document.createElement("geometry");
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		if (this.mesh) {
			el.appendChild(this.mesh.toXML());
		}
		return el;
	}
}
