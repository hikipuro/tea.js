import { DAEUtil } from "../../DAEUtil";

// parent: curve, line, surface (B-rep), swept_surface
export class DAEOrigin {
	static readonly TagName: string = "origin";
	data: Array<number>;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAEOrigin {
		if (el == null) {
			return null;
		}
		var value = new DAEOrigin();
		value.data = DAEUtil.getFloatArrayContent(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEOrigin> {
		return DAEUtil.parseArray<DAEOrigin>(
			this.parse, parent, DAEOrigin.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEOrigin.TagName);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
