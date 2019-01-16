import * as Tea from "../../Tea";
import { Component } from "../Component";
import { UICollider } from "./UICollider";
import { UIStatus } from "./UIStatus";

export class UIComponent extends Component {
	static readonly className: string = "UIComponent";
	useMouseEvents: boolean;
	protected _width: number;
	protected _height: number;
	protected _isSizeChanged: boolean;
	protected _colorOffset: Tea.Color;
	protected _colorMultiplier: Tea.Color;
	protected _status: UIStatus;
	texture: Tea.Texture;
	
	constructor(app: Tea.App) {
		super(app);
		this.useMouseEvents = true;
		this._width = 0.0;
		this._height = 0.0;
		this._isSizeChanged = true;
		this._colorOffset = new Tea.Color();
		this._colorMultiplier = new Tea.Color(1.0, 1.0, 1.0, 1.0);
		this._status = new UIStatus(this);
		this.texture = Tea.Texture.getEmpty(app, 0, 0, 0, 0);
		this.texture.wrapMode = Tea.TextureWrapMode.Clamp;
		this.texture.filterMode = Tea.FilterMode.Point;
	}

	get width(): number {
		return this._width;
	}
	set width(value: number) {
		if (value == null || value === this._width) {
			return;
		}
		this._width = value;
		this._isSizeChanged = true;
	}

	get height(): number {
		return this._height;
	}
	set height(value: number) {
		if (value == null || value === this._height) {
			return;
		}
		this._height = value;
		this._isSizeChanged = true;
	}

	/*
	get rect(): Tea.Rect {
		var object3d = this.object3d;
		if (object3d == null) {
			return new Tea.Rect();
		}
		var position = object3d.position;
		return new Tea.Rect(
			position[0], position[1],
			this._width, this._height
		);
	}
	//*/

	get colorOffset(): Tea.Color {
		return this._colorOffset;
	}
	set colorOffset(value: Tea.Color) {
		this._colorOffset = value;
	}

	get colorMultiplier(): Tea.Color {
		return this._colorMultiplier;
	}
	set colorMultiplier(value: Tea.Color) {
		this._colorMultiplier = value;
	}

	get collider(): UICollider {
		return this._status.collider;
	}

	destroy(): void {
		this.useMouseEvents = undefined;
		this._width = undefined;
		this._height = undefined;
		this._isSizeChanged = undefined;
		this._colorOffset = undefined;
		this._colorMultiplier = undefined;
		this._status = undefined;
		if (this.texture != null) {
			this.texture.destroy();
			this.texture = undefined;
		}
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = UIComponent.className;
		json.width = this._width;
		json.height = this._height;
		return json;
	}

	update(): void {
		if (this._isSizeChanged) {
			var collider = this._status.collider;
			var width = this._width;
			var height = this._height;
			collider.center[0] = width * 0.5;
			collider.center[1] = height * 0.5;
			collider.size[0] = width;
			collider.size[1] = height;
			this._isSizeChanged = false;
		}
		if (this.useMouseEvents) {
			this.updateMouseStatus();
		}
	}

	protected updateMouseStatus(): void {
		var object3d = this.object3d;
		if (object3d == null) {
			return;
		}
		var status = this._status;
		var mouse = this.app.mouse;
		var mousePosition = mouse.uiPosition;
		var isMouseUp = mouse.isUp(0);
		if (mousePosition[0] === Infinity) {
			if (status.isMouseOver === true) {
				status.isMouseOver = false;
				object3d.sendMessage("onMouseLeave");
			}
			if (isMouseUp) {
				if (status.isMouseDown === true) {
					status.isMouseDown = false;
					object3d.sendMessage("onMouseUp");
				}
			}
			return;
		}
		if (mouse.isMoved) {
			if (this.hitTest(mousePosition)) {
				if (status.isMouseOver === false) {
					status.isMouseOver = true;
					object3d.sendMessage("onMouseEnter");
				} else {
					var downPosition = status.toLocalPosition(mousePosition);
					status.mouseMovePosition.copy(downPosition);
					object3d.sendMessage("onMouseMove");
				}
			} else {
				if (status.isMouseOver === true) {
					status.isMouseOver = false;
					object3d.sendMessage("onMouseLeave");
				}
			}
		}
		if (status.isMouseOver) {
			//console.log("mouse over", object3d.name);
			var isMouseDown = mouse.isDown(0);
			if (isMouseDown) {
				status.isMouseDown = true;
				var downPosition = status.toLocalPosition(mousePosition);
				status.mouseDownPosition.copy(downPosition);
				object3d.sendMessage("onMouseDown");
			} else if (isMouseUp) {
				if (status.isMouseDown === true) {
					status.isMouseDown = false;
					object3d.sendMessage("onClick");
				}
				if (mouse.isDoubleClick(0)) {
					object3d.sendMessage("onDoubleClick");
				}
				object3d.sendMessage("onMouseUp");
			}
		} else {
			if (isMouseUp) {
				if (status.isMouseDown === true) {
					status.isMouseDown = false;
					object3d.sendMessage("onMouseUp");
				}
			}
		}
	}

	protected hitTest(position: Tea.Vector2): boolean {
		var object3d = this.object3d;
		if (object3d == null || object3d.parent == null) {
			return this.collider.containsPoint(position);
		}
		var parent = object3d.parent;
		var component = parent.getComponent(Tea.UI.ScrollView);
		if (component == null) {
			return this.collider.containsPoint(position);
		}
		var rect = component.clippingRect;
		if (rect.contains(position) === false) {
			return false;
		}
		var collider = this.collider.clone();
		var scroll = component.scroll;
		collider.center[0] -= scroll[0];
		collider.center[1] -= scroll[1];
		return collider.containsPoint(position);
	}
}
