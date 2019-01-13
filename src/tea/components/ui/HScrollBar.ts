import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class HScrollBar extends UIComponent {
	static readonly className: string = "HScrollBar";
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _value: number;
	protected _max: number;
	protected _thumbRatio: number;
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
		if (v == null || this._value === v) {
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

	protected get thumbSize(): number {
		var lineWidth = 1;
		var width = this._width - lineWidth;
		var height = this._height - lineWidth;
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
		scrollBar._value = json.value;
		scrollBar._max = json.max;
		if (json.thumbRatio) {
			scrollBar._thumbRatio = json.thumbRatio;
		}
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
		return json;
	}

	update(): void {
		super.update();
		if (this._isChanged === false) {
			return;
		}
		this._graphics.clear();
		this.drawBarBase();
		this.drawButton();
		this.texture.image = this._graphics.canvas;
		this._isChanged = false;
	}

	onMouseDown(): void {
		var position = this._status.mouseDownPosition;
		var x = position[0];
		var ratio = this._value / this._max;
		var lineWidth = 1;
		var thumbSize = this.thumbSize;
		var width = this._width - lineWidth - thumbSize;
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

	protected drawBarBase(): void {
		var g = this._graphics;
		var lineWidth = 1;
		var paddingX = lineWidth / 2;
		var paddingY = lineWidth / 2;
		var w = this._width - lineWidth;
		var h = this._height - lineWidth;
		g.save();
		g.fillStyle = "#AAA";
		g.strokeStyle = "#888";
		g.lineWidth = lineWidth;
		g.translate(paddingX, paddingY);
		g.fillRoundRect(0, 0, w, h, 5);
		g.storokeRoundRect(0, 0, w, h, 5);
		g.restore();
	}

	protected drawButton(): void {
		var g = this._graphics;
		var lineWidth = 1;
		var width = this._width - lineWidth;
		var ratio = this._value / this._max;
		var thumbSize = this.thumbSize;
		var paddingX = lineWidth / 2 + ratio * (width - thumbSize);
		var paddingY = lineWidth / 2;
		var h = this._height - lineWidth;
		g.save();
		g.fillStyle = "#DDD";
		g.strokeStyle = "#888";
		g.lineWidth = lineWidth;
		g.translate(paddingX, paddingY);
		g.fillRoundRect(0, 0, thumbSize, h, 5);
		g.storokeRoundRect(0, 0, thumbSize, h, 5);
		g.restore();
	}
}
