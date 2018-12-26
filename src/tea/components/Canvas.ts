import * as Tea from "../Tea";
import { Component } from "./Component";

export class Canvas extends Component {
	static readonly className: string = "Canvas";
	
	constructor(app: Tea.App) {
		super(app);
	}

	destroy(): void {
		super.destroy();
	}

	toJSON(): Object {
		var json = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Canvas.className;
		return json;
	}
}
