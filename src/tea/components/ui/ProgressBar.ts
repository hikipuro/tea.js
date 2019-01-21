import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class ProgressBar extends UIComponent {
	static readonly className: string = "ProgressBar";
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _value: number;
	protected _barColor: Tea.Color;
	protected _railColor: Tea.Color;
	protected _border: boolean;
	protected _borderRadius: number;
	protected _borderColor: Tea.Color;
	protected _borderWidth: number;
	
	constructor(app: Tea.App) {
		super(app);
		this.useMouseEvents = false;
		this._width = 100;
		this._height = 20;
		this._graphics = new Tea.Graphics2D(
			this._width, this._height
		);
		this._isChanged = true;
		this._value = 0.0;
		this._barColor = new Tea.Color(0.3, 0.8, 0.4, 1.0);
		this._railColor = new Tea.Color(0.9, 0.9, 0.9, 1.0);
		this._border = true;
		this._borderRadius = 5;
		this._borderColor = new Tea.Color(0.5, 0.5, 0.5, 1.0);
		this._borderWidth = 2.0;
	}

	get width(): number {
		return this._width;
	}
	set width(value: number) {
		if (value == null || value === this._width) {
			return;
		}
		this._width = value;
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
		this._graphics.resize(this._width, value);
		this._isSizeChanged = true;
		this._isChanged = true;
	}

	get value(): number {
		return this._value;
	}
	set value(v: number) {
		if (v == null) {
			return;
		}
		v = Math.max(v, 0);
		v = Math.min(v, 1);
		if (this._value === v) {
			return;
		}
		this._value = v;
		this._isChanged = true;
	}

	get barColor(): Tea.Color {
		return this._barColor;
	}
	set barColor(value: Tea.Color) {
		if (value == null || value.equals(this._barColor)) {
			return;
		}
		this._barColor = value;
		this._isChanged = true;
	}

	get railColor(): Tea.Color {
		return this._railColor;
	}
	set railColor(value: Tea.Color) {
		if (value == null || value.equals(this._railColor)) {
			return;
		}
		this._railColor = value;
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

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, ProgressBar.className) === false) {
			callback(null);
			return;
		}
		var progress = new ProgressBar(app);
		progress.enabled = json.enabled;
		progress._width = json.width;
		progress._height = json.height;
		progress._graphics.resize(json.width, json.height);
		progress.value = json.value;
		progress.barColor = Tea.Color.fromArray(json.barColor);
		progress.railColor = Tea.Color.fromArray(json.railColor);
		progress.border = json.border;
		progress.borderRadius = json.borderRadius;
		progress.borderColor = Tea.Color.fromArray(json.borderColor);
		progress.borderWidth = json.borderWidth;
		callback(progress);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		this._isChanged = undefined;
		this._value = undefined;
		this._barColor = undefined;
		this._railColor = undefined;
		this._border = undefined;
		this._borderRadius = undefined;
		this._borderColor = undefined;
		this._borderWidth = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = ProgressBar.className;
		json.value = this._value;
		json.barColor = this._barColor;
		json.railColor = this._railColor;
		json.border = this._border;
		json.borderRadius = this._borderRadius;
		json.borderColor = this._borderColor;
		json.borderWidth = this._borderWidth;
		return json;
	}

	update(): void {
		super.update();
		if (this._isChanged === false) {
			return;
		}
		this._graphics.clear();
		this.draw();
		this.texture.image = this._graphics.canvas;
		this._isChanged = false;
	}

	protected draw(): void {
		var g = this._graphics;
		var value = this._value;
		var width = this._width;
		var height = this._height;
		var borderRadius = this._borderRadius;
		var borderWidth = this._borderWidth;
		if (!this._border || borderWidth <= 0) {
			g.save();
			g.fillStyle = this._railColor.toCssColor();
			g.fillRoundRect(0, 0, width, height, borderRadius);
			if (value !== 0) {
				g.fillStyle = this._barColor.toCssColor();
				g.fillRect(0, 0, width * value, height);
				//g.fillRoundRect(0, 0, width * value, height, borderRadius);
				g.save();
				g.globalCompositeOperation = "destination-in";
				g.fillStyle = "#FFF";
				g.fillRoundRect(0, 0, width, height, borderRadius);
				g.restore();
			}
			g.restore();
			return;
		}
		var padding = borderWidth / 2;
		width -= borderWidth;
		height -= borderWidth;
		g.save();
		g.translate(padding, padding);
		g.fillStyle = this._railColor.toCssColor();
		g.fillRoundRect(0, 0, width, height, borderRadius);
		if (value !== 0) {
			g.fillStyle = this._barColor.toCssColor();
			g.fillRect(padding - 0.5, 0, (width - borderWidth + 1) * value, height);
			//g.fillRoundRect(0, 0, width * value, height, borderRadius);
			g.save();
			g.globalCompositeOperation = "destination-in";
			g.fillStyle = "#FFF";
			g.fillRoundRect(0, 0, width, height, borderRadius);
			g.restore();
		}
		g.strokeStyle = this._borderColor.toCssColor();
		g.lineWidth = borderWidth;
		g.storokeRoundRect(0, 0, width, height, borderRadius);
		g.restore();
	}
}
