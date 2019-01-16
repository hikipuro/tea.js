import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Slider extends UIComponent {
	static readonly className: string = "Slider";
	protected static readonly DefaultButtonSize: number = 16;
	protected static readonly DefaultRailSize: number = 4;
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _value: number;
	protected _buttonColor: Tea.Color;
	protected _railColor: Tea.Color;
	protected _borderColor: Tea.Color;
	protected _border: boolean;
	protected _borderWidth: number;
	protected _buttonSize: number;
	protected _railSize: number;
	protected _mouseDownValue: number;
	protected _grabbed: boolean;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 80;
		this._height = 20;
		this._graphics = new Tea.Graphics2D(
			this._width, this._height
		);
		this._isChanged = true;
		this._value = 0.0;
		this._buttonColor = new Tea.Color(0.9, 0.9, 0.9, 1.0);
		this._railColor = new Tea.Color(0.8, 0.8, 0.8, 1.0);
		this._borderColor = new Tea.Color(0.5, 0.5, 0.5, 1.0);
		this._border = true;
		this._borderWidth = 1.0;
		this._buttonSize = Slider.DefaultButtonSize;
		this._railSize = Slider.DefaultRailSize;
		this._mouseDownValue = 0.0;
		this._grabbed = false;
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
		if (v == null || v === this._value) {
			return;
		}
		this._value = v;
		this._isChanged = true;
	}

	get buttonColor(): Tea.Color {
		return this._buttonColor;
	}
	set buttonColor(value: Tea.Color) {
		if (value == null || value.equals(this._buttonColor)) {
			return;
		}
		this._buttonColor = value;
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

	get buttonSize(): number {
		return this._buttonSize;
	}
	set buttonSize(value: number) {
		if (value == null || value === this._buttonSize) {
			return;
		}
		this._buttonSize = value;
		this._isChanged = true;
	}

	get railSize(): number {
		return this._railSize;
	}
	set railSize(value: number) {
		if (value == null || value === this._railSize) {
			return;
		}
		this._railSize = value;
		this._isChanged = true;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Slider.className) === false) {
			callback(null);
			return;
		}
		var slider = new Slider(app);
		slider.enabled = json.enabled;
		slider._width = json.width;
		slider._height = json.height;
		slider._graphics.resize(json.width, json.height);
		slider.value = json.value;
		slider.buttonColor = Tea.Color.fromArray(json.buttonColor);
		slider.railColor = Tea.Color.fromArray(json.railColor);
		slider.borderColor = Tea.Color.fromArray(json.borderColor);
		slider.border = json.border;
		slider.borderWidth = json.borderWidth;
		slider.buttonSize = json.buttonSize;
		slider.railSize = json.railSize;
		callback(slider);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		this._isChanged = undefined;
		this._value = undefined;
		this._buttonColor = undefined;
		this._railColor = undefined;
		this._borderColor = undefined;
		this._border = undefined;
		this._borderWidth = undefined;
		this._buttonSize = undefined;
		this._railSize = undefined;
		this._mouseDownValue = undefined;
		this._grabbed = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Slider.className;
		json.value = this._value;
		json.buttonColor = this._buttonColor;
		json.railColor = this._railColor;
		json.borderColor = this._borderColor;
		json.border = this._border;
		json.borderWidth = this._borderWidth;
		json.buttonSize = this._buttonSize;
		json.railSize = this._railSize;
		return json;
	}

	update(): void {
		super.update();
		if (this._isChanged === false) {
			return;
		}
		this._graphics.clear();
		this.drawRail();
		this.drawButton();
		this.texture.image = this._graphics.canvas;
		this._isChanged = false;
	}

	onMouseEnter(): void {
		var color = this._colorMultiplier;
		if (this._status.isMouseDown) {
			color[0] = 0.9;
			color[1] = 0.9;
			color[2] = 0.9;
		} else {
			color[0] = 1.1;
			color[1] = 1.1;
			color[2] = 1.1;
		}
	}

	onMouseLeave(): void {
		var color = this._colorMultiplier;
		color[0] = 1.0;
		color[1] = 1.0;
		color[2] = 1.0;
	}

	onMouseDown(): void {
		var color = this._colorMultiplier;
		color[0] = 0.9;
		color[1] = 0.9;
		color[2] = 0.9;
		var position = this._status.mouseDownPosition;
		var x = position[0], y = position[1];
		var ratio = this._value;
		var buttonSize = this._buttonSize;
		var width = this._width - buttonSize;
		var left = ratio * width;
		var right = left + buttonSize;
		var top = (this._height - buttonSize) / 2;
		var bottom = top + buttonSize;
		if (x < left
		||  x > right
		||  y < top
		||  y > bottom) {
			x -= buttonSize / 2;
			var value = x / width;
			this.value = Math.max(0, Math.min(1, value));
		}
		this._mouseDownValue = this._value;
		this._grabbed = true;
	}

	onMouseUp(): void {
		this._grabbed = false;
		if (!this._status.isMouseOver) {
			return;
		}
		var color = this._colorMultiplier;
		color[0] = 1.1;
		color[1] = 1.1;
		color[2] = 1.1;
	}

	onMouseMove(): void {
		if (!this._grabbed) {
			return;
		}
		var downPosition = this._status.mouseDownPosition;
		var position = this._status.mouseMovePosition;
		var buttonSize = this._buttonSize;
		var width = this._width - buttonSize;
		var x = position[0] - downPosition[0];
		var value = this._mouseDownValue + x / width;
		this.value = Math.max(0, Math.min(1, value));
	}

	protected drawRail(): void {
		var g = this._graphics;
		var railSize = this._railSize;
		var radius = railSize / 2;
		var paddingX = 0;
		var paddingY = (this._height - railSize) / 2;
		var width = this._width;
		if (!this._border) {
			g.save();
			g.translate(paddingX, paddingY);
			g.fillStyle = this._railColor.toCssColor();
			g.fillRoundRect(0, 0, width, railSize, radius);
			g.restore();
			return;
		}
		var lineWidth = this._borderWidth;
		paddingX = lineWidth / 2;
		width -= lineWidth;
		g.save();
		g.translate(paddingX, paddingY);
		g.fillStyle = this._railColor.toCssColor();
		g.fillRoundRect(0, 0, width, railSize, radius);
		g.strokeStyle = this._borderColor.toCssColor();
		g.lineWidth = lineWidth;
		g.storokeRoundRect(0, 0, width, railSize, radius);
		g.restore();
	}

	protected drawButton(): void {
		var g = this._graphics;
		var buttonSize = this._buttonSize;
		var paddingX = this._value * (this._width - buttonSize);
		var paddingY = this._height / 2;
		if (!this._border) {
			g.save();
			g.translate(paddingX, paddingY);
			g.fillStyle = this._buttonColor.toCssColor();
			buttonSize /= 2;
			if (buttonSize < 0) {
				buttonSize = 0;
			}
			g.fillCircle(buttonSize, 0, buttonSize);
			g.restore();
			return;
		}
		var lineWidth = this._borderWidth;
		buttonSize -= lineWidth;
		paddingX += lineWidth / 2;
		g.save();
		g.translate(paddingX, paddingY);
		/*
		var gradient = g.createLinearGradient(
			0, 0, 0, buttonSize
		);
		gradient.addColorStop(0, "#FFF");
		gradient.addColorStop(1, "#AAA");
		g.fillStyle = gradient;
		//*/
		g.fillStyle = this._buttonColor.toCssColor();
		buttonSize /= 2;
		if (buttonSize < 0) {
			buttonSize = 0;
		}
		g.fillCircle(buttonSize, 0, buttonSize);
		g.strokeStyle = this._borderColor.toCssColor();
		g.lineWidth = lineWidth;
		g.strokeCircle(buttonSize, 0, buttonSize);
		g.restore();
	}
}
