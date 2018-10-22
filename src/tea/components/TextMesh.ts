import * as Tea from "../Tea";
import { Primitives } from "../objects/Primitives";
import { Component } from "./Component";

export class TextMesh extends Component {
	static editorView = Tea.Editor.TextMesh;
	protected static readonly DefaultFontSize: number = 14;
	material: Tea.Material;
	texture: Tea.Texture;
	protected _isChanged: boolean;
	protected _mesh: Tea.Mesh;
	protected _characterSize: number;
	protected _lineSpacing: number;
	protected _anchor: Tea.TextAnchor;
	protected _alignment: Tea.TextAlignment;
	protected _color: Tea.Color;
	protected _font: string;
	protected _fontSize: number;
	protected _fontStyle: Tea.FontStyle;
	protected _text: string;
	protected _padding: number;
	protected _canvas: HTMLCanvasElement;
	protected _context: CanvasRenderingContext2D;

	constructor(app: Tea.App) {
		super(app);
		this._mesh = Primitives.createQuadMesh();

		this._canvas = document.createElement("canvas");
		//this._canvas.width = 1;
		//this._canvas.height = 1;
		//this._canvas.style["-webkit-font-smoothing"] = "none";
		//this._canvas.style["image-rendering"] = "pixelated";
		this._context = this._canvas.getContext("2d");

		this.texture = new Tea.Texture(app);
		this.texture.image = this._canvas;

		this._isChanged = true;
		this._color = Tea.Color.white.clone();
		this._font = "sans-serif";
		this._fontSize = TextMesh.DefaultFontSize;
		this._fontStyle = Tea.FontStyle.Normal;
		this._text = "Text";
		this._alignment = Tea.TextAlignment.Left;
		this._anchor = Tea.TextAnchor.MiddleCenter;
		this._characterSize = 1;
		this._lineSpacing = 1;
		this._padding = 1;

		//this.updateContext();
		//this.draw();
	}

	get canvas(): HTMLCanvasElement {
		return this._canvas;
	}

	get mesh(): Tea.Mesh {
		return this._mesh;
	}

	get characterSize(): number {
		return this._characterSize;
	}
	set characterSize(value: number) {
		if (this._characterSize === value) {
			return;
		}
		this._characterSize = value;
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

	get anchor(): Tea.TextAnchor {
		return this._anchor;
	}
	set anchor(value: Tea.TextAnchor) {
		if (this._anchor === value) {
			return;
		}
		this._anchor = value;
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
		if (this.material) {
			this.material.color.copy(this.color);
		}
		//this._isChanged = true;
	}

	get font(): string {
		return this._font;
	}
	set font(value: string) {
		if (this._font === value) {
			return;
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

	destroy(): void {
		this._isChanged = undefined;
		this._alignment = undefined;
		this._anchor = undefined;
		this._characterSize = undefined;
		this._lineSpacing = undefined;
		if (this.texture != null) {
			this.texture.destroy();
			this.texture = undefined;
		}
		this._color = undefined;
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
		if (this._isChanged === false) {
			return;
		}
		this.updateContext();
		this.draw();
		this._isChanged = false;
	}

	getImageData(): ImageData {
		return this._context.getImageData(
			0, 0, this._canvas.width, this._canvas.height
		);
	}

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "TextMesh",
			material: this.material.toJSON(),
			characterSize: this._characterSize,
			lineSpacing: this._lineSpacing,
			anchor: Tea.TextAnchor.toString(this._anchor),
			alignment: Tea.TextAlignment.toString(this._alignment),
			color: this._color,
			font: this._font,
			fontSize: this._fontSize,
			fontStyle: Tea.FontStyle.toString(this._fontStyle),
			text: this._text,
			padding: this._padding
		});
		return json;
	}

	static fromJSON(app: Tea.App, json: any): TextMesh {
		if (json == null || json._type !== "TextMesh") {
			return null;
		}
		var textMesh = new TextMesh(app);
		//textMesh.material = Tea.Material.fromJSON(json.material);
		textMesh._characterSize = json.characterSize;
		textMesh._lineSpacing = json.lineSpacing;
		textMesh._anchor = Tea.TextAnchor[json.anchor as string];
		textMesh._alignment = Tea.TextAlignment[json.alignment as string];
		textMesh._color = Tea.Color.fromArray(json.color);
		textMesh._font = json.font;
		textMesh._fontSize = json.fontSize;
		textMesh._fontStyle = Tea.FontStyle[json.fontStyle as string];
		textMesh._text = json.text;
		textMesh._padding = json.padding;
		return textMesh;
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
		var lineSpacing = this._lineSpacing * 1.2;
		var length = text.length;
		for (var i = 0; i < length; i++) {
			var line = text[i];
			var x = padding;
			var y = padding + (fontSize * i) * lineSpacing;
			var metrics = context.measureText(line);
			switch (this._alignment) {
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
		var lineSpacing = this._lineSpacing * 1.2;
		var padding = this._padding * 2;
		var textWidth = 0;
		var textHeight = (fontSize * (text.length - 1)) * lineSpacing + padding;
		textHeight += fontSize;

		var length = text.length;
		for (var i = 0; i < length; i++) {
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

		//var updateFlag = false;
		if (width !== textWidth) {
			//updateFlag = true;
			this._canvas.width = textWidth;
		}
		if (height !== textHeight) {
			//updateFlag = true;
			this._canvas.height = textHeight;
		}
		//if (updateFlag) {
			this.updateContext();
			this.updateVertices(tw, th);
		//} else {
		//	this.clearRect();
		//}
		//console.log(tw, th);
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
		this.clearRect();
		this.updateFont();
	}

	protected updateFont(): void {
		var context = this._context;
		var font = this._font;
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

	protected updateVertices(textWidth: number, textHeight: number): void {
		var scale = 12 / this._characterSize;
		var scale2 = scale * 2;
		var width = this._canvas.width / scale2;
		var height = this._canvas.height / scale2;
		var ow = (this._canvas.width - textWidth) / scale2;
		var oh = (this._canvas.height - textHeight) / scale2;
		var mesh = this._mesh;
		var v0 = mesh.vertices[0];
		var v1 = mesh.vertices[1];
		var v2 = mesh.vertices[2];
		var v3 = mesh.vertices[3];
		switch (this._anchor) {
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
		mesh.calculateBounds();
		mesh.uploadMeshData();
	}
}
