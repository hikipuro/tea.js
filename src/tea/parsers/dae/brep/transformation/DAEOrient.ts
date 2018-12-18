import { DAEUtil } from "../../DAEUtil";

// parent: curve, surface (B-Rep)
export class DAEOrient {
	static readonly TagName: string = "orient";
	data: Array<number>;

	constructor() {
		this.data = null;
	}

	static parse(el: Element): DAEOrient {
		if (el == null) {
			return null;
		}
		var value = new DAEOrient();
		value.data = DAEUtil.getFloatArrayContent(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEOrient> {
		return DAEUtil.parseArray<DAEOrient>(
			this.parse, parent, DAEOrient.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEOrient.TagName);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
