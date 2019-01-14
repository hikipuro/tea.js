import * as Tea from "../../Tea";
import { ScrollView } from "./ScrollView";

export class Panel extends ScrollView {
	static readonly className: string = "Panel";
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _background: Tea.Color;
	protected _border: boolean;
	protected _borderWidth: number;
	protected _borderRadius: number;
	protected _borderColor: Tea.Color;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 100;
		this._height = 100;
		this._graphics = new Tea.Graphics2D(
			this._width, this._height
		);
		this._isChanged = true;
		this._background = new Tea.Color(0.8, 0.8, 0.8, 1.0);
		this._border = true;
		this._borderWidth = 1.0;
		this._borderRadius = 5.0;
		this._borderColor = new Tea.Color(0.5, 0.5, 0.5, 1.0);
	}

	get width(): number {
		return this._width;
	}
	set width(value: number) {
		if (value == null || value === this._width) {
			return;
		}
		this._width = value;
		this._clippingRect[2] = value - ScrollView.ClipMargin * 2;
		this._graphics.resize(value, this._height);
		this._isSizeChanged = true;
		this._isChanged = true;
	}

	get height(): number {
		return this._height;
	}
	set height(value: number) {
		if (value == null || value === this._height) {
			return;
		}
		this._height = value;
		this._clippingRect[3] = value - ScrollView.ClipMargin * 2;
		this._graphics.resize(this._width, value);
		this._isSizeChanged = true;
		this._isChanged = true;
	}

	get background(): Tea.Color {
		return this._background;
	}
	set background(value: Tea.Color) {
		if (value == null || value.equals(this._background)) {
			return;
		}
		this._background = value;
		this._isChanged = true;
	}

	get border(): boolean {
		return this._border;
	}
	set border(value: boolean) {
		if (value == null || value === this._border) {
			return;
		}
		this._border = value;
		this._isChanged = true;
	}

	get borderWidth(): number {
		return this._borderWidth;
	}
	set borderWidth(value: number) {
		if (value == null || value === this._borderWidth) {
			return;
		}
		this._borderWidth = value;
		this._isChanged = true;
	}

	get borderRadius(): number {
		return this._borderRadius;
	}
	set borderRadius(value: number) {
		if (value == null || value === this._borderRadius) {
			return;
		}
		this._borderRadius = value;
		this._isChanged = true;
	}

	get borderColor(): Tea.Color {
		return this._borderColor;
	}
	set borderColor(value: Tea.Color) {
		if (value == null || value.equals(this._borderColor)) {
			return;
		}
		this._borderColor = value;
		this._isChanged = true;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Panel.className) === false) {
			callback(null);
			return;
		}
		var panel = new Panel(app);
		panel._width = json.width;
		panel._height = json.height;
		panel._graphics.resize(json.width, json.height);
		var margin = ScrollView.ClipMargin * 2;
		panel._clippingRect[2] = json.width - margin;
		panel._clippingRect[3] = json.height - margin;
		panel.background = Tea.Color.fromArray(json.background);
		panel.border = json.border;
		panel.borderWidth = json.borderWidth;
		panel.borderRadius = json.borderRadius;
		panel.borderColor = Tea.Color.fromArray(json.borderColor);
		callback(panel);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		this._isChanged = undefined;
		this._background = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Panel.className;
		json.background = this._background;
		json.border = this._border;
		json.borderWidth = this._borderWidth;
		json.borderRadius = this._borderRadius;
		json.borderColor = this._borderColor;
		return json;
	}

	update(): void {
		super.update();
		if (this._isChanged === false) {
			return;
		}
		this._graphics.clear();
		this.drawPanel();
		this.texture.image = this._graphics.canvas;
		this._isChanged = false;
	}

	protected drawPanel(): void {
		var g = this._graphics;
		var width = this._width;
		var height = this._height;
		var borderRadius = this._borderRadius;
		if (!this._border) {
			g.save();
			g.fillStyle = this._background.toCssColor();
			g.fillRoundRect(0, 0, width, height, borderRadius);
			g.restore();
			return;
		}
		var borderWidth = this._borderWidth;
		var padding = borderWidth / 2;
		width -= borderWidth;
		height -= borderWidth;
		g.save();
		g.translate(padding, padding);
		g.fillStyle = this._background.toCssColor();
		g.fillRoundRect(0, 0, width, height, borderRadius);
		g.strokeStyle = this._borderColor.toCssColor();
		g.lineWidth = borderWidth;
		g.storokeRoundRect(0, 0, width, height, borderRadius);
		g.restore();
	}
}
