import * as Tea from "../Tea";
import { Component } from "./Component";

export class Canvas extends Component {
	static readonly className: string = "Canvas";
	
	constructor(app: Tea.App) {
		super(app);
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Canvas.className) === false) {
			callback(null);
			return;
		}
		var canvas = new Canvas(app);
		callback(canvas);
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
