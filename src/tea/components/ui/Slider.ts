import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Slider extends UIComponent {
	static readonly className: string = "Slider";
	protected static readonly DefaultButtonSize: number = 16;
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _value: number;
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

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Slider.className) === false) {
			callback(null);
			return;
		}
		var slider = new Slider(app);
		slider._width = json.width;
		slider._height = json.height;
		slider._graphics.resize(json.width, json.height);
		slider._value = json.value;
		callback(slider);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		this._isChanged = undefined;
		this._value = undefined;
		this._mouseDownValue = undefined;
		this._grabbed = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Slider.className;
		json.value = this._value;
		return json;
	}

	update(): void {
		super.update();
		if (this._isChanged === false) {
			return;
		}
		this._graphics.clear();
		this.drawSliderBase();
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
		var buttonSize = Slider.DefaultButtonSize;
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
		var buttonSize = Slider.DefaultButtonSize;
		var width = this._width - buttonSize;
		var x = position[0] - downPosition[0];
		var value = this._mouseDownValue + x / width;
		this.value = Math.max(0, Math.min(1, value));
	}

	protected drawSliderBase(): void {
		var g = this._graphics;
		var buttonSize = Slider.DefaultButtonSize;
		var baseHeight = buttonSize / 5;
		var lineWidth = 1;
		var radius = baseHeight / 2;
		var paddingX = lineWidth / 2;
		var paddingY = (this._height - baseHeight) / 2;
		var w = this._width - lineWidth;
		g.save();
		g.fillStyle = "#FFF";
		g.strokeStyle = "#888";
		g.lineWidth = lineWidth;
		g.translate(paddingX, paddingY);
		g.fillRoundRect(0, 0, w, baseHeight, radius);
		g.storokeRoundRect(0, 0, w, baseHeight, radius);
		g.restore();
	}

	protected drawButton(): void {
		var g = this._graphics;
		var size = Slider.DefaultButtonSize;
		var lineWidth = 1;
		var paddingX = lineWidth / 2;
		var paddingY = lineWidth / 2 + (this._height - size) / 2;
		paddingX += this._value * (this._width - size);
		size -= lineWidth;
		var gradient = g.createLinearGradient(
			0, 0, 0, size
		);
		gradient.addColorStop(0, "#FFF");
		gradient.addColorStop(1, "#AAA");
		g.save();
		g.fillStyle = gradient;
		g.strokeStyle = "#888";
		g.lineWidth = lineWidth;
		g.translate(paddingX, paddingY);
		size /= 2;
		g.fillCircle(size, size, size);
		g.strokeCircle(size, size, size);
		g.restore();
	}
}
