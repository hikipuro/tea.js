import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Text extends UIComponent {
	static readonly className: string = "Text";
	protected static readonly DefaultFontSize: number = 14;
	protected static readonly DefaultFont: string = "sans-serif";
	protected _isChanged: boolean;
	protected _graphics: Tea.Graphics2D;
	protected _lineSpacing: number;
	protected _alignment: Tea.TextAlignment;
	protected _color: Tea.Color;
	protected _font: string;
	protected _fontSize: number;
	protected _fontStyle: Tea.FontStyle;
	protected _text: string;
	protected _padding: number;
	
	constructor(app: Tea.App) {
		super(app);
		//this._width = 50;
		//this._height = 33;
		var graphics = new Tea.Graphics2D(64, 64);
		//graphics.canvas.style["webkitFontSmoothing"] = "none";
		/*
		graphics.textBaseline = "top";
		graphics.fillStyle = "black";
		graphics.fillRect();
		graphics.fillStyle = "white";
		graphics.fillText("Text", 0, 0);
		*/
		this._isChanged = true;
		this._graphics = graphics;
		this._lineSpacing = 1;
		this._alignment = Tea.TextAlignment.Left;
		var color = Tea.Color.white.clone();
		this._color = color;
		this._colorOffset.set(color[0], color[1], color[2], 0.0);
		this._colorMultiplier.set(1.0, 1.0, 1.0, color[3]);
		this._font = Text.DefaultFont;
		this._fontSize = Text.DefaultFontSize;
		this._fontStyle = Tea.FontStyle.Normal;
		this._text = "Text";
		this._padding = 0;
		//this.texture.image = graphics.canvas;
	}

	//get canvas(): HTMLCanvasElement {
	//	return this._graphics.canvas;
	//}

	get width(): number {
		return this._width;
	}
	set width(value: number) {
		if (value == null || value === this._width) {
			return;
		}
		this._width = value;
		this._graphics.resize(value, this._height);
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
		this._isChanged = true;
	}

	get lineSpacing(): number {
		return this._lineSpacing;
	}
	set lineSpacing(value: number) {
		if (this._lineSpacing === value) {
			return;
		}
		this._lineSpacing = value;
		this._isChanged = true;
	}

	get alignment(): Tea.TextAlignment {
		return this._alignment;
	}
	set alignment(value: Tea.TextAlignment) {
		if (this._alignment === value) {
			return;
		}
		this._alignment = value;
		this._isChanged = true;
	}

	get color(): Tea.Color {
		return this._color;
	}
	set color(value: Tea.Color) {
		if (value == null) {
			return;
		}
		if (this._color.equals(value)) {
			return;
		}
		this._color.copy(value);
		this._colorOffset.set(value[0], value[1], value[2], 0.0);
		this._colorMultiplier.set(1.0, 1.0, 1.0, value[3]);
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
			value = Text.DefaultFont;
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

	get fontStyle(): Tea.FontStyle {
		return this._fontStyle;
	}
	set fontStyle(value: Tea.FontStyle) {
		if (this._fontStyle === value) {
			return;
		}
		this._fontStyle = value;
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

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Text.className) === false) {
			callback(null);
			return;
		}
		var text = new Text(app);
		text._lineSpacing = json.lineSpacing;
		text._alignment = Tea.TextAlignment.fromString(json.alignment);
		text.color = Tea.Color.fromArray(json.color);
		text._font = json.font;
		text._fontSize = json.fontSize;
		text._fontStyle = Tea.FontStyle.fromString(json.fontStyle);
		text._text = json.text;
		text._padding = json.padding;
		callback(text);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		this._isChanged = undefined;
		this._alignment = undefined;
		this._lineSpacing = undefined;
		this._color = undefined;
		this._font = undefined;
		this._fontSize = undefined;
		this._fontStyle = undefined;
		this._text = undefined;
		this._padding = undefined;
		super.destroy();
	}

	update(): void {
		if (this._isChanged === false) {
			return;
		}
		this.draw();
		this._isChanged = false;
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Text.className;
		json.lineSpacing = this._lineSpacing;
		json.alignment = Tea.TextAlignment.toString(this._alignment);
		json.color = this._color;
		json.font = this._font;
		json.fontSize = this._fontSize;
		json.fontStyle = Tea.FontStyle.toString(this._fontStyle);
		json.text = this._text;
		json.padding = this._padding;
		return json;
	}

	protected getFont(): string {
		var style = Tea.FontStyle.toCssString(this._fontStyle);
		var size = this.getFontSize();
		var values = [];
		values.push(style);
		values.push(size + Tea.HTMLScale.px);
		values.push(this._font);
		return values.join(" ");
	}

	protected getFontSize(): number {
		var fontSize = this._fontSize;
		if (fontSize <= 0) {
			fontSize = Text.DefaultFontSize;
		}
		return fontSize;
	}

	protected updateContext(): void {
		var graphics = this._graphics;
		//graphics.imageSmoothingEnabled = false;
		graphics.textAlign = "start";
		graphics.textBaseline = "middle";
		//graphics.fillStyle = this._color.toCssColor();
		graphics.fillStyle = "black";
		//graphics.shadowColor = "#000";
		//graphics.shadowBlur = 1;
		//graphics.clear();
		graphics.font = this.getFont();
	}

	protected resizeCanvas(): void {
		var graphics = this._graphics;
		graphics.font = this.getFont();

		var text = this._text.split(/\r\n|\r|\n/);
		var width = graphics.width;
		var height = graphics.height;
		var fontSize = this.getFontSize();
		var lineSpacing = this._lineSpacing * 1.2;
		var padding = this._padding * 2;

		var textWidth = 0;
		//var textHeight = (fontSize * (text.length - 1)) * lineSpacing + padding;
		var textHeight = (fontSize * text.length) * lineSpacing + padding;
		if (textHeight < 0) {
			textHeight = 0;
		}
		textHeight += fontSize;

		var length = text.length;
		for (var i = 0; i < length; i++) {
			var line = text[i];
			var metrics = graphics.measureText(line);
			var lineWidth = metrics.width + padding;
			if (textWidth < lineWidth) {
				textWidth = lineWidth;
			}
		}
		if (width !== textWidth) {
			graphics.width = textWidth;
		}
		if (height !== textHeight) {
			graphics.height = textHeight;
		}
		this._width = textWidth;
		this._height = textHeight;
		this.updateContext();
	}

	protected draw(): void {
		this.resizeCanvas();
		var textWidth = this._width;
		var graphics = this._graphics;
		var text = this._text.split(/\r\n|\r|\n/);
		var fontSize = this.getFontSize();
		var padding = this._padding;
		var lineSpacing = this._lineSpacing * 1.2;
		var halfLineHeight = fontSize;
		/*
		halfLineHeight *= lineSpacing;
		if (halfLineHeight < fontSize) {
			halfLineHeight = fontSize;
		}
		*/
		halfLineHeight *= 0.5;
		var length = text.length;
		for (var i = 0; i < length; i++) {
			var line = text[i];
			var x = padding;
			var y = padding + (fontSize * i) * lineSpacing + halfLineHeight;
			var metrics = graphics.measureText(line);
			switch (this._alignment) {
				case Tea.TextAlignment.Center:
					x = (textWidth - metrics.width) / 2;
					break;
				case Tea.TextAlignment.Right:
					x = textWidth - metrics.width;
					break;
			}
			//x = Math.floor(x);
			//y = Math.floor(y);
			graphics.fillText(line, x, y);
		}
		this.texture.image = graphics.canvas;
	}
}
