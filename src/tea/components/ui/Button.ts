import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Button extends UIComponent {
	static readonly className: string = "Button";
	protected static readonly DefaultFontSize: number = 14;
	protected static readonly DefaultFont: string = "sans-serif";
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _text: string;
	protected _font: string;
	protected _fontSize: number;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 100;
		this._height = 30;
		this._graphics = new Tea.Graphics2D(100, 30);
		this._isChanged = true;
		this._text = "Button";
		this._font = Button.DefaultFont;
		this._fontSize = Button.DefaultFontSize;
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

	get text(): string {
		return this._text;
	}
	set text(value: string) {
		if (this._text === value) {
			return;
		}
		this._text = value;
		this._isChanged = true;
	}

	get font(): string {
		return this._font;
	}
	set font(value: string) {
		if (this._font === value) {
			return;
		}
		if (value === "") {
			value = Button.DefaultFont;
		}
		this._font = value;
		this._isChanged = true;
	}

	get fontSize(): number {
		return this._fontSize;
	}
	set fontSize(value: number) {
		if (this._fontSize === value) {
			return;
		}
		this._fontSize = value;
		this._isChanged = true;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Button.className) === false) {
			callback(null);
			return;
		}
		var button = new Button(app);
		button._width = json.width;
		button._height = json.height;
		button._graphics.resize(json.width, json.height);
		button._text = json.text;
		button._fontSize = json.fontSize;
		button._font = json.font;
		callback(button);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		this._isChanged = undefined;
		this._text = undefined;
		this._font = undefined;
		this._fontSize = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Button.className;
		json.text = this._text;
		json.fontSize = this._fontSize;
		json.font = this._font;
		return json;
	}

	update(): void {
		super.update();
		if (this._isChanged === false) {
			return;
		}
		this._graphics.clear();
		this.drawButtonFace();
		this.drawButtonText();
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

	protected drawButtonFace(): void {
		var g = this._graphics;
		var lineWidth = 1;
		var padding = lineWidth / 2;
		var w = this._width - lineWidth;
		var h = this._height - lineWidth;
		var gradient = g.createLinearGradient(
			0, padding, 0, h
		);
		gradient.addColorStop(0, "#FFF");
		gradient.addColorStop(1, "#AAA");
		g.fillStyle = gradient;
		g.strokeStyle = "#888";
		g.lineWidth = lineWidth;
		g.fillRoundRect(padding, padding, w, h, 5);
		g.storokeRoundRect(padding, padding, w, h, 5);
	}

	protected drawButtonText(): void {
		var g = this._graphics;
		var w = this._width;
		var h = this._height;
		g.textAlign = "center";
		g.textBaseline = "middle";
		g.font = this.getFont();
		g.fillStyle = "#333";
		g.fillTextMultiLine(this._text, w / 2, h / 2);
	}

	protected getFont(): string {
		//var style = Tea.FontStyle.toCssString(this._fontStyle);
		var size = this.getFontSize();
		var values = [];
		//values.push(style);
		values.push(size + Tea.HTMLScale.px);
		values.push(this._font);
		return values.join(" ");
	}

	protected getFontSize(): number {
		var fontSize = this._fontSize;
		if (fontSize <= 0) {
			fontSize = Button.DefaultFontSize;
		}
		return fontSize;
	}
}
