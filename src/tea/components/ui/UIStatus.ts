import { UICollider } from "./UICollider";
import { UIComponent } from "./UIComponent";

export class UIStatus {
	component: UIComponent;
	collider: UICollider;
	isMouseOver: boolean;
	isMouseDown: boolean;

	constructor(component: UIComponent) {
		this.component = component;
		this.collider = new UICollider(component.app, component);
		this.isMouseOver = false;
		this.isMouseDown = false;
	}
}
