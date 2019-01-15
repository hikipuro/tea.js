import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Switch extends UIComponent {
	static readonly className: string = "Switch";
	protected static readonly DefaultButtonSize: number = 20;
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _checked: boolean;
	protected _baseColorOff: Tea.Color;
	protected _baseColorOn: Tea.Color;
	protected _thumbColor: Tea.Color;
	protected _thumbMargin: number;
	protected _border: boolean;
	protected _borderWidth: number;
	protected _borderColor: Tea.Color;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 35;
		this._height = 20;
		this._graphics = new Tea.Graphics2D(
			this._width, this._height
		);
		this._isChanged = true;
		this._checked = false;
		this._baseColorOff = new Tea.Color(0.6, 0.6, 0.6, 1.0);
		this._baseColorOn = new Tea.Color(0.3, 0.8, 0.4, 1.0);
		this._thumbColor = new Tea.Color(0.9, 0.9, 0.9, 1.0);
		this._thumbMargin = 4;
		this._border = false;
		this._borderWidth = 1.0;
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

	get checked(): boolean {
		return this._checked;
	}
	set checked(value: boolean) {
		if (value == null || value === this._checked) {
			return;
		}
		this._checked = value;
		this._isChanged = true;
	}

	get baseColorOff(): Tea.Color {
		return this._baseColorOff;
	}
	set baseColorOff(value: Tea.Color) {
		if (value == null || value.equals(this._baseColorOff)) {
			return;
		}
		this._baseColorOff = value;
		this._isChanged = true;
	}

	get baseColorOn(): Tea.Color {
		return this._baseColorOn;
	}
	set baseColorOn(value: Tea.Color) {
		if (value == null || value.equals(this._baseColorOn)) {
			return;
		}
		this._baseColorOn = value;
		this._isChanged = true;
	}

	get thumbColor(): Tea.Color {
		return this._thumbColor;
	}
	set thumbColor(value: Tea.Color) {
		if (value == null || value.equals(this._thumbColor)) {
			return;
		}
		this._thumbColor = value;
		this._isChanged = true;
	}

	get thumbMargin(): number {
		return this._thumbMargin;
	}
	set thumbMargin(value: number) {
		if (value == null || value === this._thumbMargin) {
			return;
		}
		this._thumbMargin = value;
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
		if (Tea.JSONUtil.isValidSceneJSON(json, Switch.className) === false) {
			callback(null);
			return;
		}
		var sw = new Switch(app);
		sw._width = json.width;
		sw._height = json.height;
		sw._graphics.resize(json.width, json.height);
		sw.checked = json.checked;
		sw.baseColorOff = Tea.Color.fromArray(json.baseColorOff);
		sw.baseColorOn = Tea.Color.fromArray(json.baseColorOn);
		sw.thumbColor = Tea.Color.fromArray(json.thumbColor);
		sw.thumbMargin = json.thumbMargin;
		sw.border = json.border;
		sw.borderWidth = json.borderWidth;
		sw.borderColor = Tea.Color.fromArray(json.borderColor);
		callback(sw);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		this._isChanged = undefined;
		this._checked = undefined;
		this._baseColorOff = undefined;
		this._baseColorOn = undefined;
		this._thumbColor = undefined;
		this._thumbMargin = undefined;
		this._border = undefined;
		this._borderWidth = undefined;
		this._borderColor = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Switch.className;
		json.checked = this._checked;
		json.baseColorOff = this._baseColorOff;
		json.baseColorOn = this._baseColorOn;
		json.thumbColor = this._thumbColor;
		json.thumbMargin = this._thumbMargin;
		json.border = this._border;
		json.borderWidth = this._borderWidth;
		json.borderColor = this._borderColor;
		return json;
	}

	update(): void {
		super.update();
		if (this._isChanged === false) {
			return;
		}
		this._graphics.clear();
		if (this._width > this._height) {
			this.drawBaseH();
			this.drawButtonH();
		} else {
			this.drawBaseV();
			this.drawButtonV();
		}
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
	}

	onMouseUp(): void {
		if (!this._status.isMouseOver) {
			return;
		}
		var color = this._colorMultiplier;
		color[0] = 1.1;
		color[1] = 1.1;
		color[2] = 1.1;
	}

	onClick(): void {
		this.checked = !this._checked;
	}

	protected drawBaseH(): void {
		var g = this._graphics;
		var borderWidth = this._borderWidth;
		if (!this._border) {
			borderWidth = 0;
		}
		var x = borderWidth / 2;
		var y = borderWidth / 2;
		var width = this._width - borderWidth;
		var height = this._height - borderWidth;
		var right = x + width;
		var bottom = y + height;
		var halfHeight = height / 2;
		g.save();
		g.beginPath();
		g.moveTo(x + halfHeight, y);
		g.lineTo(right - halfHeight, y);
		g.arcTo(right, y, right, y + halfHeight, halfHeight);
		g.arcTo(right, bottom, right - halfHeight, bottom, halfHeight);
		g.lineTo(x + halfHeight, bottom);
		g.arcTo(x, bottom, x, y + halfHeight, halfHeight);
		g.arcTo(x, y, x + halfHeight, y, halfHeight);
		g.closePath();
		if (this._checked) {
			g.fillStyle = this._baseColorOn.toCssColor();
		} else {
			g.fillStyle = this._baseColorOff.toCssColor();
		}
		g.fill();
		if (this._border) {
			g.strokeStyle = this._borderColor.toCssColor();
			g.lineWidth = borderWidth;
			g.stroke();
		}
		g.restore();
	}

	protected drawBaseV(): void {
		var g = this._graphics;
		var borderWidth = this._borderWidth;
		if (!this._border) {
			borderWidth = 0;
		}
		var x = borderWidth / 2;
		var y = borderWidth / 2;
		var width = this._width - borderWidth;
		var height = this._height - borderWidth;
		var right = x + width;
		var bottom = y + height;
		var halfWidth = width / 2;
		g.save();
		g.beginPath();
		g.moveTo(x, y + halfWidth);
		g.lineTo(x, bottom - halfWidth);
		g.arcTo(x, bottom, x + halfWidth, bottom, halfWidth);
		g.arcTo(right, bottom, right, bottom - halfWidth, halfWidth);
		g.lineTo(right, y + halfWidth);
		g.arcTo(right, y, x + halfWidth, y, halfWidth);
		g.arcTo(x, y, x, y + halfWidth, halfWidth);
		g.closePath();
		if (this._checked) {
			g.fillStyle = this._baseColorOn.toCssColor();
		} else {
			g.fillStyle = this._baseColorOff.toCssColor();
		}
		g.fill();
		if (this._border) {
			g.strokeStyle = this._borderColor.toCssColor();
			g.lineWidth = borderWidth;
			g.stroke();
		}
		g.restore();
	}

	protected drawButtonH(): void {
		var g = this._graphics;
		var borderWidth = this._borderWidth;
		if (!this._border) {
			borderWidth = 0;
		}
		var buttonSize = this._height;
		var paddingX = buttonSize / 2;
		var paddingY = buttonSize / 2;
		if (this._checked) {
			paddingX = this._width - paddingX;
		}
		buttonSize -= borderWidth + this._thumbMargin;
		buttonSize /= 2;
		if (buttonSize < 0) {
			buttonSize = 0;
		}
		g.save();
		g.translate(paddingX, paddingY);
		g.fillStyle = this._thumbColor.toCssColor();
		g.fillCircle(0, 0, buttonSize);
		if (this._border) {
			g.strokeStyle = this._borderColor.toCssColor();
			g.lineWidth = borderWidth;
			g.strokeCircle(0, 0, buttonSize);
		}
		g.restore();
	}

	protected drawButtonV(): void {
		var g = this._graphics;
		var borderWidth = this._borderWidth;
		if (!this._border) {
			borderWidth = 0;
		}
		var buttonSize = this._width;
		var paddingX = buttonSize / 2;
		var paddingY = this._height - buttonSize / 2;
		if (this._checked) {
			paddingY = buttonSize / 2;
		}
		buttonSize -= borderWidth + this._thumbMargin;
		buttonSize /= 2;
		if (buttonSize < 0) {
			buttonSize = 0;
		}
		g.save();
		g.translate(paddingX, paddingY);
		g.fillStyle = this._thumbColor.toCssColor();
		g.fillCircle(0, 0, buttonSize);
		if (this._border) {
			g.strokeStyle = this._borderColor.toCssColor();
			g.lineWidth = borderWidth;
			g.strokeCircle(0, 0, buttonSize);
		}
		g.restore();
	}
}
