import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class HScrollBar extends UIComponent {
	static readonly className: string = "HScrollBar";
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _value: number;
	protected _max: number;
	protected _thumbRatio: number;
	protected _thumbColor: Tea.Color;
	protected _railColor: Tea.Color;
	protected _border: boolean;
	protected _borderRadius: number;
	protected _borderColor: Tea.Color;
	protected _borderWidth: number;
	protected _mouseDownValue: number;
	protected _grabbed: boolean;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 100;
		this._height = 16;
		this._graphics = new Tea.Graphics2D(
			this._width, this._height
		);
		this._isChanged = true;
		this._value = 0.0;
		this._max = 1.0;
		this._thumbRatio = 0.5;
		this._thumbColor = new Tea.Color(0.8, 0.8, 0.8, 1.0);
		this._railColor = new Tea.Color(0.6, 0.6, 0.6, 1.0);
		this._border = true;
		this._borderRadius = 5;
		this._borderColor = new Tea.Color(0.5, 0.5, 0.5, 1.0);
		this._borderWidth = 1.0;
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
		if (v == null) {
			return;
		}
		v = Math.max(v, 0);
		v = Math.min(v, this._max);
		if (this._value === v) {
			return;
		}
		this._value = v;
		this._isChanged = true;
	}

	get max(): number {
		return this._max;
	}
	set max(value: number) {
		if (value == null || this._max === value) {
			return;
		}
		this._max = value;
		this._isChanged = true;
	}

	get thumbRatio(): number {
		return this._thumbRatio;
	}
	set thumbRatio(value: number) {
		if (value == null || this._thumbRatio === value) {
			return;
		}
		this._thumbRatio = value;
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

	protected get thumbSize(): number {
		var borderWidth = this._borderWidth;
		var width = this._width - borderWidth;
		var height = this._height - borderWidth;
		var size = width * this._thumbRatio;
		size = Math.min(size, width);
		size = Math.max(size, height);
		return size;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, HScrollBar.className) === false) {
			callback(null);
			return;
		}
		var scrollBar = new HScrollBar(app);
		scrollBar._width = json.width;
		scrollBar._height = json.height;
		scrollBar._graphics.resize(json.width, json.height);
		scrollBar.max = json.max;
		scrollBar.value = json.value;
		scrollBar.thumbRatio = json.thumbRatio;
		scrollBar.thumbColor = Tea.Color.fromArray(json.thumbColor);
		scrollBar.railColor = Tea.Color.fromArray(json.railColor);
		scrollBar.border = json.border;
		scrollBar.borderRadius = json.borderRadius;
		scrollBar.borderColor = Tea.Color.fromArray(json.borderColor);
		scrollBar.borderWidth = json.borderWidth;
		callback(scrollBar);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		this._isChanged = undefined;
		this._value = undefined;
		this._max = undefined;
		this._thumbRatio = undefined;
		this._thumbColor = undefined;
		this._railColor = undefined;
		this._border = undefined;
		this._borderRadius = undefined;
		this._borderColor = undefined;
		this._borderWidth = undefined;
		this._mouseDownValue = undefined;
		this._grabbed = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = HScrollBar.className;
		json.value = this._value;
		json.max = this._max;
		json.thumbRatio = this._thumbRatio;
		json.thumbColor = this._thumbColor;
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
		this.drawRail();
		this.drawButton();
		this.texture.image = this._graphics.canvas;
		this._isChanged = false;
	}

	onMouseDown(): void {
		var position = this._status.mouseDownPosition;
		var x = position[0];
		var ratio = this._value / this._max;
		var borderWidth = this._borderWidth;
		var thumbSize = this.thumbSize;
		var width = this._width - borderWidth - thumbSize;
		var left = ratio * width;
		var right = left + thumbSize;
		if (x < left || x > right) {
			x -= thumbSize / 2;
			var value = x / width;
			this.value = Math.max(0, Math.min(1, value)) * this._max;
		}
		this._mouseDownValue = this._value;
		this._grabbed = true;
	}

	onMouseUp(): void {
		this._grabbed = false;
	}

	onMouseMove(): void {
		if (!this._grabbed) {
			return;
		}
		var downPosition = this._status.mouseDownPosition;
		var position = this._status.mouseMovePosition;
		var width = this._width - this.thumbSize;
		var x = position[0] - downPosition[0];
		var value = x / width;
		value = this._mouseDownValue + value * this._max;
		this.value = Math.max(0, Math.min(this._max, value));
	}

	protected drawRail(): void {
		var g = this._graphics;
		var width = this._width;
		var height = this._height;
		var borderRadius = this._borderRadius;
		if (!this._border) {
			g.save();
			g.fillStyle = this._railColor.toCssColor();
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
		g.fillStyle = this._railColor.toCssColor();
		g.fillRoundRect(0, 0, width, height, borderRadius);
		g.strokeStyle = this._borderColor.toCssColor();
		g.lineWidth = borderWidth;
		g.storokeRoundRect(0, 0, width, height, borderRadius);
		g.restore();
	}

	protected drawButton(): void {
		var g = this._graphics;
		var ratio = this._value / this._max;
		var width = this._width;
		var height = this._height;
		var thumbSize = this.thumbSize;
		var borderRadius = this._borderRadius;
		var paddingX = ratio * (width - thumbSize);
		var paddingY = 0;
		if (!this._border) {
			g.save();
			g.translate(paddingX, paddingY);
			g.fillStyle = this._thumbColor.toCssColor();
			g.fillRoundRect(0, 0, thumbSize, height, borderRadius);
			g.restore();
			return;
		}
		var borderWidth = this._borderWidth;
		width -= borderWidth;
		height -= borderWidth;
		paddingX = borderWidth / 2 + ratio * (width - thumbSize);
		paddingY = borderWidth / 2;
		g.save();
		g.translate(paddingX, paddingY);
		g.fillStyle = this._thumbColor.toCssColor();
		g.fillRoundRect(0, 0, thumbSize, height, borderRadius);
		g.strokeStyle = this._borderColor.toCssColor();
		g.lineWidth = borderWidth;
		g.storokeRoundRect(0, 0, thumbSize, height, borderRadius);
		g.restore();
	}
}
