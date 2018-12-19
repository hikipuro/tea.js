import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAETechnique } from "./DAETechnique";
import { DAEElement } from "../../DAEElement";

// parent:
// core:
// animation, animation_clip, camera, COLLADA, controller,
// control_vertices, evaluate_scene, geometry, imager, joints, light,
// lines, linestrips, mesh, morph, node, optics, polygons, polylist, scene,
// skin, spline, targets, triangles, trifans , tristrips, vertex_weights,
// vertices, visual_scene
export class DAEExtra {
	static readonly TagName: string = "extra";
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
			return null;
		}
		var value = new DAEExtra();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.type = DAEUtil.getStringAttr(el, "type");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.techniques = DAETechnique.parseArray(el);
		return value;
	}

	static parseArray(parent: Document | Element): Array<DAEExtra> {
		return DAEUtil.parseArray<DAEExtra>(
			this.parse, parent, DAEExtra.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEExtra.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "type", this.type);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.techniques);
		return el;
	}
}
