import { DAEUtil } from "../../DAEUtil";
import { DAESource } from "../data/DAESource";
import { DAEJoints } from "./DAEJoints";
import { DAEVertexWeights } from "./DAEVertexWeights";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: controller
export class DAESkin {
	static readonly TagName: string = "skin";
	source: string;
	//bindShapeMatrix: DAEBindShapeMatrix;
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
			return null;
		}
		var value = new DAESkin();
		value.source = DAEUtil.getStringAttr(el, "source");
		value.sources = DAESource.parseArray(el);
		value.joints = DAEJoints.parse(
			DAEUtil.queryChildSelector(el, DAEJoints.TagName)
		);
		value.vertexWeights = DAEVertexWeights.parse(
			DAEUtil.queryChildSelector(el, DAEVertexWeights.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESkin.TagName);
		DAEUtil.setAttr(el, "source", this.source);
		DAEUtil.addElementArray(el, this.sources);
		DAEUtil.addElement(el, this.joints);
		DAEUtil.addElement(el, this.vertexWeights);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
