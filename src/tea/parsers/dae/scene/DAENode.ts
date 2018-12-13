import { DAEUtil } from "../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAELookAt } from "../transform/DAELookAt";
import { DAEMatrix } from "../transform/DAEMatrix";
import { DAERotate } from "../transform/DAERotate";
import { DAEScale } from "../transform/DAEScale";
import { DAESkew } from "../transform/DAESkew";
import { DAETranslate } from "../transform/DAETranslate";
import { DAEInstanceCamera } from "../camera/DAEInstanceCamera";
import { DAEInstanceController } from "../controller/DAEInstanceController";
import { DAEInstanceGeometry } from "../geometry/DAEInstanceGeometry";
import { DAEInstanceLight } from "../lighting/DAEInstanceLight";
import { DAEInstanceNode } from "./DAEInstanceNode";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: library_nodes, node, visual_scene
export class DAENode {
	id?: string;
	name?: string;
	sid?: string;
	type?: string;
	layer?: string;
	asset?: DAEAsset;
	lookat?: DAELookAt;
	matrix?: DAEMatrix;
	rotate?: DAERotate;
	scale?: DAEScale;
	skew?: DAESkew;
	translate?: DAETranslate;
	instanceCameras?: Array<DAEInstanceCamera>;
	instanceControllers?: Array<DAEInstanceController>;
	instanceGeometries?: Array<DAEInstanceGeometry>;
	instanceLights?: Array<DAEInstanceLight>;
	instanceNodes?: Array<DAEInstanceNode>;
	nodes?: Array<DAENode>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.sid = null;
		this.type = null;
		this.layer = null;
		this.asset = null;
		this.lookat = null;
		this.matrix = null;
		this.rotate = null;
		this.scale = null;
		this.skew = null;
		this.translate = null;
		this.instanceCameras = null;
		this.instanceControllers = null;
		this.instanceGeometries = null;
		this.instanceLights = null;
		this.instanceNodes = null;
		this.nodes = null;
		this.extras = null;
	}

	static parse(el: Element): DAENode {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAENode();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.type = DAEUtil.stringAttrib(el, "type");
		value.layer = DAEUtil.stringAttrib(el, "layer");
		value.asset = DAEAsset.parse(
			el.querySelector("asset")
		);
		value.lookat = DAELookAt.parse(
			el.querySelector("Lookat")
		);
		value.matrix = DAEMatrix.parse(
			el.querySelector("matrix")
		);
		value.rotate = DAERotate.parse(
			el.querySelector("rotate")
		);
		value.scale = DAEScale.parse(
			el.querySelector("scale")
		);
		value.skew = DAESkew.parse(
			el.querySelector("skew")
		);
		value.translate = DAETranslate.parse(
			el.querySelector("translate")
		);
		value.instanceCameras = DAEInstanceCamera.parseArray(el);
		value.instanceControllers = DAEInstanceController.parseArray(el);
		value.instanceGeometries = DAEInstanceGeometry.parseArray(el);
		value.instanceLights = DAEInstanceLight.parseArray(el);
		value.instanceNodes = DAEInstanceNode.parseArray(el);
		value.nodes = DAENode.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAENode> {
		return DAEUtil.parseArray<DAENode>(
			this.parse, parent, "node"
		);
	}
}
