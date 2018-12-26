import * as Tea from "../../Tea";
import { Component } from "../Component";

export class UIComponent extends Component {
	static readonly className: string = "UIComponent";
	protected _x: number;
	protected _y: number;
	protected _width: number;
	protected _height: number;
	texture: Tea.Texture;
	
	constructor(app: Tea.App) {
		super(app);
		this._x = 0.0;
		this._y = 0.0;
		this._width = 0.0;
		this._height = 0.0;
		this.texture = new Tea.Texture(app);
		this.texture.filterMode = Tea.FilterMode.Point;
	}

	get x(): number {
		return this._x;
	}
	set x(value: number) {
		this._x = value;
	}

	get y(): number {
		return this._y;
	}
	set y(value: number) {
		this._y = value;
	}

	get width(): number {
		return this._width;
	}
	set width(value: number) {
		this._width = value;
	}

	get height(): number {
		return this._height;
	}
	set height(value: number) {
		this._height = value;
	}

	destroy(): void {
		this.x = undefined;
		this.y = undefined;
		this._width = undefined;
		if (this.texture != null) {
			this.texture.destroy();
			this.texture = undefined;
		}
		super.destroy();
	}
}
