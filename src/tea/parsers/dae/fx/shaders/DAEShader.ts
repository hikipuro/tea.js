import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAEShader {
	static readonly TagName: string = "shader";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAEShader {
		if (el == null) {
			return null;
		}
		var value = new DAEShader();
		return value;
	}

	static parseArray(parent: Element): Array<DAEShader> {
		return DAEUtil.parseArray<DAEShader>(
			this.parse, parent, DAEShader.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEShader.TagName);
		return el;
	}
}
