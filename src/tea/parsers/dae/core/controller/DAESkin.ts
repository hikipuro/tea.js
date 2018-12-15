import { DAEUtil } from "../../DAEUtil";
import { DAESource } from "../data/DAESource";
import { DAEJoints } from "./DAEJoints";
import { DAEVertexWeights } from "./DAEVertexWeights";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: controller
export class DAESkin {
	source: string;
	//bindShapeMatrix: any;
	sources: Array<DAESource>;
	joints: DAEJoints;
	vertexWeights: DAEVertexWeights;
	extras?: Array<DAEExtra>;

	constructor() {
		this.source = "";
		this.sources = null;
		this.joints = null;
		this.vertexWeights = null;
		this.extras = null;
	}

	static parse(el: Element): DAESkin {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAESkin();
		value.source = DAEUtil.stringAttrib(el, "source");
		value.sources = DAESource.parseArray(el);
		value.joints = DAEJoints.parse(
			el.querySelector(":scope > joints")
		);
		value.vertexWeights = DAEVertexWeights.parse(
			el.querySelector(":scope > vertex_weights")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement("skin");
		DAEUtil.setAttribute(el, "source", this.source);
		DAEUtil.addXMLArray(el, this.sources);
		DAEUtil.addXML(el, this.joints);
		DAEUtil.addXML(el, this.vertexWeights);
		DAEUtil.addXMLArray(el, this.extras);
		return el;
	}
}
