import * as Tea from "../../Tea";
import { Component } from "../Component";

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

	update(): void {
		/*
		var object3d = this.object3d;
		if (object3d == null) {
			return;
		}
		var mouse = this.app.mouse;
		var mousePosition = mouse.uiPosition;
		var isMouseDown = mouse.isDown(0);
		var isMouseUp = mouse.isUp(0);
		var components = object3d.getComponentsInChildren(Tea.UI.UIComponent);
		if (components == null || components.length <= 0) {
			return;
		}
		var length = components.length;
		for (var i = 0; i < length; i++) {
			var component = components[i];
			if (component == null || component.object3d == null) {
				return;
			}
			if (component.collider.containsPoint(mousePosition)) {
				component.object3d.sendMessage("onMouseOver");
				if (isMouseDown) {
					component.object3d.sendMessage("onMouseDown");
				} else if (isMouseUp) {
					component.object3d.sendMessage("onMouseUp");
				}
				//console.log("mouse over", component.object3d.name);
			}
		}
		*/
	}

	toJSON(): Object {
		var json = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Canvas.className;
		return json;
	}
}
