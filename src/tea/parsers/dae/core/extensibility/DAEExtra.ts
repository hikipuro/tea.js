import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAETechnique } from "./DAETechnique";

// parent:
// core:
// animation, animation_clip, camera, COLLADA, controller,
// control_vertices, evaluate_scene, geometry, imager, joints, light,
// lines, linestrips, mesh, morph, node, optics, polygons, polylist, scene,
// skin, spline, targets, triangles, trifans , tristrips, vertex_weights,
// vertices, visual_scene
export class DAEExtra {
	id?: string;
	name?: string;
	type?: string;
	asset?: DAEAsset;
	techniques: Array<DAETechnique>;

	constructor() {
		this.id = null;
		this.name = null;
		this.type = null;
		this.asset = null;
		this.techniques = null;
	}

	static parse(el: Element): DAEExtra {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEExtra();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.type = DAEUtil.stringAttrib(el, "type");
		value.asset = DAEAsset.parse(
			el.querySelector(":scope > asset")
		);
		value.techniques = DAETechnique.parseArray(el);
		return value;
	}

	static parseArray(parent: Document | Element): Array<DAEExtra> {
		return DAEUtil.parseArray<DAEExtra>(
			this.parse, parent, "extra"
		);
	}

	toXML(): Element {
		var el = document.createElement("extra");
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "type", this.type);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXMLArray(el, this.techniques);
		return el;
	}
}
