import * as Tea from "../../Tea";
import { Component } from "../Component";

export class UIComponent extends Component {
	static readonly className: string = "UIComponent";
	protected _width: number;
	protected _height: number;
	texture: Tea.Texture;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 0.0;
		this._height = 0.0;
		this.texture = new Tea.Texture(app);
		this.texture.filterMode = Tea.FilterMode.Point;
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
		this._width = undefined;
		this._height = undefined;
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
}
