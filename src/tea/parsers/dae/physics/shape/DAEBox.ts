import { DAEUtil } from "../../DAEUtil";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: shape
export class DAEBox {
	static readonly TagName: string = "box";
	halfExtents: Array<number>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.halfExtents = null;
		this.extras = null;
	}

	static parse(el: Element): DAEBox {
		if (el == null) {
			return null;
		}
		var value = new DAEBox();
		value.halfExtents = DAEUtil.getFloatArrayContent(
			DAEUtil.queryChildSelector(el, "half_extents")
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBox.TagName);
		DAEUtil.addArrayContent(el, "half_extents", this.halfExtents);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
