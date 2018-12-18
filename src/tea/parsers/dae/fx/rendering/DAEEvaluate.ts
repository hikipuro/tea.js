import { DAEUtil } from "../../DAEUtil";
import { DAEColorTarget } from "./DAEColorTarget";
import { DAEDepthTarget } from "./DAEDepthTarget";
import { DAEStencilTarget } from "./DAEStencilTarget";
import { DAEColorClear } from "./DAEColorClear";
import { DAEDepthClear } from "./DAEDepthClear";
import { DAEStencilClear } from "./DAEStencilClear";
import { DAEDraw } from "./DAEDraw";

// parent: pass
export class DAEEvaluate {
	static readonly TagName: string = "evaluate";
	colorTarget?: DAEColorTarget;
	depthTarget?: DAEDepthTarget;
	stencilTarget?: DAEStencilTarget;
	colorClear?: DAEColorClear;
	depthClear?: DAEDepthClear;
	stencilClear?: DAEStencilClear;
	draw?: DAEDraw;

	constructor() {
		this.colorTarget = null;
		this.depthTarget = null;
		this.stencilTarget = null;
		this.colorClear = null;
		this.depthClear = null;
		this.stencilClear = null;
		this.draw = null;
	}

	static parse(el: Element): DAEEvaluate {
		if (el == null) {
			return null;
		}
		var value = new DAEEvaluate();
		value.colorTarget = DAEColorTarget.parse(
			DAEUtil.queryChildSelector(el, DAEColorTarget.TagName)
		);
		value.depthTarget = DAEDepthTarget.parse(
			DAEUtil.queryChildSelector(el, DAEDepthTarget.TagName)
		);
		value.stencilTarget = DAEStencilTarget.parse(
			DAEUtil.queryChildSelector(el, DAEStencilTarget.TagName)
		);
		value.colorClear = DAEColorClear.parse(
			DAEUtil.queryChildSelector(el, DAEColorClear.TagName)
		);
		value.depthClear = DAEDepthClear.parse(
			DAEUtil.queryChildSelector(el, DAEDepthClear.TagName)
		);
		value.stencilClear = DAEStencilClear.parse(
			DAEUtil.queryChildSelector(el, DAEStencilClear.TagName)
		);
		value.draw = DAEDraw.parse(
			DAEUtil.queryChildSelector(el, DAEDraw.TagName)
		);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEEvaluate.TagName);
		DAEUtil.addElement(el, this.colorTarget);
		DAEUtil.addElement(el, this.depthTarget);
		DAEUtil.addElement(el, this.stencilTarget);
		DAEUtil.addElement(el, this.colorClear);
		DAEUtil.addElement(el, this.depthClear);
		DAEUtil.addElement(el, this.stencilClear);
		DAEUtil.addElement(el, this.draw);
		return el;
	}
}
