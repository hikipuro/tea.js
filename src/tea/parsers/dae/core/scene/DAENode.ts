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
	static readonly TagName: string = "node";
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
			return null;
		}
		var value = new DAENode();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.type = DAEUtil.getStringAttr(el, "type");
		value.layer = DAEUtil.getStringAttr(el, "layer");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
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
			this.parse, parent, DAENode.TagName
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
				case DAELookat.TagName:
					child = DAELookat.parse(el);
					break;
				case DAEMatrix.TagName:
					child = DAEMatrix.parse(el);
					break;
				case DAERotate.TagName:
					child = DAERotate.parse(el);
					break;
				case DAEScale.TagName:
					child = DAEScale.parse(el);
					break;
				case DAESkew.TagName:
					child = DAESkew.parse(el);
					break;
				case DAETranslate.TagName:
					child = DAETranslate.parse(el);
					break;
				case DAEAsset.TagName:
				case DAEInstanceCamera.TagName:
				case DAEInstanceController.TagName:
				case DAEInstanceGeometry.TagName:
				case DAEInstanceLight.TagName:
				case DAEInstanceNode.TagName:
				case DAENode.TagName:
				case DAEExtra.TagName:
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
		var el = document.createElement(DAENode.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.setAttr(el, "type", this.type);
		DAEUtil.setAttr(el, "layer", this.layer);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.transformationElements);
		DAEUtil.addElementArray(el, this.instanceCameras);
		DAEUtil.addElementArray(el, this.instanceControllers);
		DAEUtil.addElementArray(el, this.instanceGeometries);
		DAEUtil.addElementArray(el, this.instanceLights);
		DAEUtil.addElementArray(el, this.instanceNodes);
		DAEUtil.addElementArray(el, this.nodes);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
