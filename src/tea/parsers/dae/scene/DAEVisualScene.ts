import { DAEUtil } from "../DAEUtil";

export class DAEVisualScene {

	constructor() {
	}

	static parse(el: Element): DAEVisualScene {
		if (el == null) {
			console.error("parse error");
			return null;
		}
		var value = new DAEVisualScene();
		return value;
	}

	static parseArray(parent: Element): Array<DAEVisualScene> {
		return DAEUtil.parseArray<DAEVisualScene>(
			this.parse, parent, "visual_scene"
		);
	}
}
