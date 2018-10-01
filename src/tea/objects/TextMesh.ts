import * as Tea from "../Tea";
import { Mesh } from "./Mesh";
import { Primitives } from "./Primitives";

export class TextMesh extends Mesh {
	protected static readonly DefaultFontSize: number = 14;
	alignment: Tea.TextAlignment;
	anchor: Tea.TextAnchor;
	characterSize: number;
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

		this._color = Tea.Color.white.clone();
		this._font = "sans-serif";
		this._fontSize = TextMesh.DefaultFontSize;
		this._fontStyle = Tea.FontStyle.Normal;
		this._text = "Text";
		this.alignment = Tea.TextAlignment.Left;
		this.anchor = Tea.TextAnchor.MiddleCenter;
		this.characterSize = 1;
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

	destroy(): void {
		this.alignment = undefined;
		this.anchor = undefined;
		this.characterSize = undefined;
		this.lineSpacing = undefined;
		if (this.texture != null) {
			this.texture.destroy();
			this.texture = undefined;
		}
		this.color = undefined;
		this._font = undefined;
		this._fontSize = undefined;
		this._fontStyle = undefined;
		this._text = undefined;
		this._padding = undefined;
		this._canvas = undefined;
		this._context = undefined;
		super.destroy();
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
		var textSize = this.resizeCanvas();
		var context = this._context;
		var text = this._text.split(/\r\n|\r|\n/);
		var fontSize = this._fontSize;
		if (fontSize <= 0) {
			fontSize = TextMesh.DefaultFontSize;
		}
		var padding = this._padding;
		var lineSpacing = this.lineSpacing * 1.2;
		for (var i = 0; i < text.length; i++) {
			var line = text[i];
			var x = padding;
			var y = padding + (fontSize * i) * lineSpacing;
			var metrics = context.measureText(line);
			switch (this.alignment) {
				case Tea.TextAlignment.Center:
					x = (textSize.width - metrics.width) / 2;
					break;
				case Tea.TextAlignment.Right:
					x = textSize.width - metrics.width;
					break;
			}
			this._context.fillText(line, x, y);
		}
		this.texture.image = this._canvas;
	}

	protected resizeCanvas(): any {
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

		var tw = textWidth;
		var th = textHeight;
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
			this.udpateVertices(tw, th);
		} else {
			this.clearRect();
		}
		return {
			width: tw,
			height: th
		};
	}

	protected updateContext(): void {
		var context = this._context;
		//context.imageSmoothingEnabled = false;
		context.textAlign = "start";
		context.textBaseline = "top";
		context.fillStyle = "#000";
		this.updateFont();
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

	protected udpateVertices(textWidth: number, textHeight: number): void {
		var scale = 12 / this.characterSize;
		var scale2 = scale * 2;
		var width = this._canvas.width / scale2;
		var height = this._canvas.height / scale2;
		var ow = (this._canvas.width - textWidth) / scale2;
		var oh = (this._canvas.height - textHeight) / scale2;
		var v0 = this.vertices[0];
		var v1 = this.vertices[1];
		var v2 = this.vertices[2];
		var v3 = this.vertices[3];
		switch (this.anchor) {
			case Tea.TextAnchor.UpperLeft:
				ow = width;
				oh = height;
				break;
			case Tea.TextAnchor.UpperCenter:
				oh = height;
				break;
			case Tea.TextAnchor.UpperRight:
				ow = ow * 2 - width;
				oh = height;
				break;
			case Tea.TextAnchor.MiddleLeft:
				ow = width;
				break;
			case Tea.TextAnchor.MiddleRight:
				ow = ow * 2 - width;
				break;
			case Tea.TextAnchor.LowerLeft:
				ow = width;
				oh = oh * 2 - height;
				break;
			case Tea.TextAnchor.LowerCenter:
				oh = oh * 2 - height;
				break;
			case Tea.TextAnchor.LowerRight:
				ow = ow * 2 - width;
				oh = oh * 2 - height;
				break;
		}
		v0.x = -width + ow; v0.y = -height - oh;
		v1.x =  width + ow; v1.y = -height - oh;
		v2.x =  width + ow; v2.y =  height - oh;
		v3.x = -width + ow; v3.y =  height - oh;
		this.calculateBounds();
		this.uploadMeshData();
	}
}
