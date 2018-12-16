import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAERender {
	static readonly TagName: string = "render";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAERender {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAERender();
		return value;
	}

	static parseArray(parent: Element): Array<DAERender> {
		return DAEUtil.parseArray<DAERender>(
			this.parse, parent, DAERender.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAERender.TagName);
		return el;
	}
}
