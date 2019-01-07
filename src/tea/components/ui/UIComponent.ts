import * as Tea from "../../Tea";
import { Component } from "../Component";
import { UICollider } from "./UICollider";

export class UIComponent extends Component {
	static readonly className: string = "UIComponent";
	protected _width: number;
	protected _height: number;
	protected _isSizeChanged: boolean;
	protected _colorOffset: Tea.Color;
	protected _colorMultiplier: Tea.Color;
	protected _collider: UICollider;
	texture: Tea.Texture;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 0.0;
		this._height = 0.0;
		this._isSizeChanged = true;
		this._colorOffset = new Tea.Color();
		this._colorMultiplier = new Tea.Color(1.0, 1.0, 1.0, 1.0);
		this._collider = new UICollider(app, this);
		this.texture = Tea.Texture.getEmpty(app);
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
		return this._collider;
	}

	destroy(): void {
		this._width = undefined;
		this._height = undefined;
		this._isSizeChanged = undefined;
		this._colorOffset = undefined;
		this._colorMultiplier = undefined;
		this._collider = undefined;
		if (this.texture != null) {
			this.texture.destroy();
			this.texture = undefined;
		}
		super.destroy();
	}

	update(): void {
		if (this._isSizeChanged) {
			var collider = this._collider;
			var width = this._width;
			var height = this._height;
			collider.center[0] = width * 0.5;
			collider.center[1] = height * 0.5;
			collider.size[0] = width;
			collider.size[1] = height;
			this._isSizeChanged = false;
		}
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = UIComponent.className;
		json.width = this._width;
		json.height = this._height;
		return json;
	}
}
