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
	protected _fontColor: Tea.Color;
	protected _background: Tea.Color;
	protected _border: boolean;
	protected _borderWidth: number;
	protected _borderRadius: number;
	protected _borderColor: Tea.Color;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 100;
		this._height = 30;
		this._graphics = new Tea.Graphics2D(100, 30);
		this._isChanged = true;
		this._text = "Button";
		this._font = Button.DefaultFont;
		this._fontSize = Button.DefaultFontSize;
		this._fontColor = new Tea.Color(0.2, 0.2, 0.2, 1.0);
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

	get fontColor(): Tea.Color {
		return this._fontColor;
	}
	set fontColor(value: Tea.Color) {
		if (value == null || value.equals(this._fontColor)) {
			return;
		}
		this._fontColor = value;
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
		if (Tea.JSONUtil.isValidSceneJSON(json, Button.className) === false) {
			callback(null);
			return;
		}
		var button = new Button(app);
		button._width = json.width;
		button._height = json.height;
		button._graphics.resize(json.width, json.height);
		button.text = json.text;
		button.fontSize = json.fontSize;
		button.font = json.font;
		button.fontColor = Tea.Color.fromArray(json.fontColor);
		button.background = Tea.Color.fromArray(json.background);
		button.border = json.border;
		button.borderWidth = json.borderWidth;
		button.borderRadius = json.borderRadius;
		button.borderColor = Tea.Color.fromArray(json.borderColor);
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
		this._fontColor = undefined;
		this._background = undefined;
		this._border = undefined;
		this._borderWidth = undefined;
		this._borderRadius = undefined;
		this._borderColor = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Button.className;
		json.text = this._text;
		json.fontSize = this._fontSize;
		json.font = this._font;
		json.fontColor = this._fontColor;
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
		this.drawButton();
		this.drawText();
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

	protected drawButton(): void {
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
		/*
		var gradient = g.createLinearGradient(
			0, padding, 0, h
		);
		gradient.addColorStop(0, "#FFF");
		gradient.addColorStop(1, "#AAA");
		g.fillStyle = gradient;
		//*/
		g.fillRoundRect(0, 0, width, height, borderRadius);
		g.strokeStyle = this._borderColor.toCssColor();
		g.lineWidth = borderWidth;
		g.storokeRoundRect(0, 0, width, height, borderRadius);
		g.restore();
	}

	protected drawText(): void {
		var g = this._graphics;
		var w = this._width;
		var h = this._height;
		g.save();
		g.textAlign = "center";
		g.textVerticalAlign = "middle";
		g.textBaseline = "middle";
		g.font = this.getFont();
		g.fillStyle = this._fontColor.toCssColor();
		g.fillTextMultiLine(this._text, w / 2, h / 2);
		g.restore();
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
