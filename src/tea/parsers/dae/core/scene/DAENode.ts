import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAETransformationElement } from "../transform/DAETransformationElement";
import { DAELookat } from "../transform/DAELookat";
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
	transformationElements?: Array<DAETransformationElement>;
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
		this.transformationElements = null;
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
			el.querySelector(":scope > asset")
		);
		value.transformationElements = DAENode.parseTransformationElements(el);
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

	protected static parseTransformationElements(el: Element): Array<DAETransformationElement> {
		if (el == null || el.childElementCount <= 0) {
			return null;
		}
		var elements = [];
		var el = el.firstElementChild;
		while (el != null) {
			var name = el.tagName;
			var child = null;
			switch (name) {
				case "Lookat":
					child = DAELookat.parse(el);
					break;
				case "matrix":
					child = DAEMatrix.parse(el);
					break;
				case "rotate":
					child = DAERotate.parse(el);
					break;
				case "scale":
					child = DAEScale.parse(el);
					break;
				case "skew":
					child = DAESkew.parse(el);
					break;
				case "translate":
					child = DAETranslate.parse(el);
					break;
				default:
					console.warn("unknown tag:", name);
					break;
			}
			if (child != null) {
				elements.push(child);
			}
			el = el.nextElementSibling;
		}
		return elements;
	}

	toXML(): Element {
		var el = document.createElement("node");
		DAEUtil.setAttribute(el, "id", this.id);
		DAEUtil.setAttribute(el, "name", this.name);
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.setAttribute(el, "type", this.type);
		DAEUtil.setAttribute(el, "layer", this.layer);
		DAEUtil.addXML(el, this.asset);
		DAEUtil.addXMLArray(el, this.transformationElements);
		DAEUtil.addXMLArray(el, this.instanceCameras);
		DAEUtil.addXMLArray(el, this.instanceControllers);
		DAEUtil.addXMLArray(el, this.instanceGeometries);
		DAEUtil.addXMLArray(el, this.instanceLights);
		DAEUtil.addXMLArray(el, this.instanceNodes);
		DAEUtil.addXMLArray(el, this.nodes);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
