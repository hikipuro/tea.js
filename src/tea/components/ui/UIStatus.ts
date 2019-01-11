import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";
import { UICollider } from "./UICollider";

export class UIStatus {
	component: UIComponent;
	collider: UICollider;
	isMouseOver: boolean;
	isMouseDown: boolean;
	mouseDownPosition: Tea.Vector2;
	mouseMovePosition: Tea.Vector2;

	constructor(component: UIComponent) {
		this.component = component;
		this.collider = new UICollider(component.app, component);
		this.isMouseOver = false;
		this.isMouseDown = false;
		this.mouseDownPosition = new Tea.Vector2();
		this.mouseMovePosition = new Tea.Vector2();
	}

	toLocalPosition(screenPosition: Tea.Vector2): Tea.Vector2 {
		var object3d = this.component.object3d;
		if (object3d == null) {
			return screenPosition;
		}
		var position = object3d.position;
		var x = screenPosition[0] - position[0];
		var y = screenPosition[1] - position[1];
		return new Tea.Vector2(x, y);
	}
}
