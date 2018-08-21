import * as Tea from "../Tea";
import { Component } from "./Component";
import { Mesh } from "./Mesh";
import { Primitives } from "../Primitives";

export class TextMesh extends Mesh {
	protected static readonly DefaultFontSize: number = 14;
	lineSpacing: number;
	texture: Tea.Texture;
	protected _color: Tea.Color;
	protected _font: string;
	protected _fontSize: number;
	protected _fontStyle: Tea.FontStyle;
	protected _text: string;
	protected _padding: number;
	protected _canvas: HTMLCanvasElement;
	protected _context: CanvasRenderingContext2D;

	constructor(app: Tea.App) {
		super();
		var mesh = Primitives.createQuadMesh();
		this.vertices = mesh.vertices;
		this.triangles = mesh.triangles;
		this.normals = mesh.normals;
		this.uv = mesh.uv;
		this.colors = mesh.colors;
		this.isModified = mesh.isModified;

		this._canvas = document.createElement("canvas");
		this._canvas.width = 1;
		this._canvas.height = 1;
		//this._canvas.style["-webkit-font-smoothing"] = "none";
		//this._canvas.style["image-rendering"] = "pixelated";
		this._context = this._canvas.getContext("2d");

		this.texture = new Tea.Texture(app);
		this.texture.image = this._canvas;

		this._color = Tea.Color.white;
		this._font = "sans-serif";
		this._fontSize = TextMesh.DefaultFontSize;
		this._fontStyle = Tea.FontStyle.Normal;
		this._text = "Text";
		this.lineSpacing = 1;
		this._padding = 1;

		this.updateContext();
		this.draw();
	}

	get canvas(): HTMLCanvasElement {
		return this._canvas;
	}

	get color(): Tea.Color {
		return this._color;
	}
	set color(value: Tea.Color) {
		if (this._color.equals(value)) {
			return;
		}
		this._color = value;
		this.updateColor();
	}

	get font(): string {
		return this._font;
	}
	set font(value: string) {
		if (this._font === value) {
			return;
		}
		this._font = value;
		this.updateFont();
	}

	get fontSize(): number {
		return this._fontSize;
	}
	set fontSize(value: number) {
		if (this._fontSize === value) {
			return;
		}
		this._fontSize = value;
		this.updateFont();
	}

	get fontStyle(): Tea.FontStyle {
		return this._fontStyle;
	}
	set fontStyle(value: Tea.FontStyle) {
		if (this._fontStyle === value) {
			return;
		}
		this._fontStyle = value;
		this.updateFont();
	}

	get text(): string {
		return this._text;
	}
	set text(value: string) {
		if (this._text === value) {
			return;
		}
		this._text = value;
		this.draw();
	}

	update(): void {
		this.draw();
	}

	getImageData(): ImageData {
		return this._context.getImageData(
			0, 0, this._canvas.width, this._canvas.height
		);
	}

	protected clearRect(): void {
		var w = this._canvas.width;
		var h = this._canvas.height;
		this._context.clearRect(0, 0, w, h);
	}

	protected draw(): void {
		this.resizeCanvas();
		this.updateColor();

		var text = this._text.split(/\r\n|\r|\n/);
		var fontSize = this._fontSize;
		if (fontSize <= 0) {
			fontSize = TextMesh.DefaultFontSize;
		}
		var padding = this._padding;
		var lineSpacing = this.lineSpacing * 1.2;
		for (var i = 0; i < text.length; i++) {
			var line = text[i];
			var y = padding + (fontSize * i) * lineSpacing;
			this._context.fillText(
				line, padding, y
			);
		}
		this.texture.image = this._canvas;
	}

	protected resizeCanvas(): void {
		var context = this._context;
		var text = this._text.split(/\r\n|\r|\n/);
		var width = this._canvas.width;
		var height = this._canvas.height;
		var fontSize = this._fontSize;
		if (fontSize <= 0) {
			fontSize = TextMesh.DefaultFontSize;
		}
		var lineSpacing = this.lineSpacing * 1.2;
		var padding = this._padding * 2;
		var textWidth = 0;
		var textHeight = (fontSize * (text.length - 1)) * lineSpacing + padding;
		textHeight += fontSize;

		for (var i = 0; i < text.length; i++) {
			var line = text[i];
			var metrics = context.measureText(line);
			var lineWidth = metrics.width + padding;
			if (textWidth < lineWidth) {
				textWidth = lineWidth;
			}
		}

		textWidth = Tea.Mathf.closestPowerOfTwo(textWidth);
		textHeight = Tea.Mathf.closestPowerOfTwo(textHeight);

		var updateFlag = false;
		if (width < textWidth) {
			updateFlag = true;
			this._canvas.width = textWidth;
		}
		if (height < textHeight) {
			updateFlag = true;
			this._canvas.height = textHeight;
		}
		if (updateFlag) {
			this.updateContext();
		} else {
			this.clearRect();
		}
	}

	protected updateContext(): void {
		var context = this._context;
		//context.imageSmoothingEnabled = false;
		context.textAlign = "start";
		context.textBaseline = "top";
		this.updateColor();
		this.updateFont();
	}

	protected updateColor(): void {
		this._context.fillStyle = this._color.toCssColor();
	}

	protected updateFont(): void {
		var context = this._context;
		var font = "'" + this._font + "'";
		var size = this._fontSize;
		if (size <= 0) {
			size = TextMesh.DefaultFontSize;
		}
		var style = "";
		switch (this._fontStyle) {
			case Tea.FontStyle.Normal:
				break;
			case Tea.FontStyle.Bold:
				style = "bold ";
				break;
			case Tea.FontStyle.Italic:
				style = "italic ";
				break;
			case Tea.FontStyle.BoldAndItalic:
				style = "bold italic ";
				break;
		}
		context.font = style + size + "px " + font;
	}
}
