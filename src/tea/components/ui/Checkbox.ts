import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Checkbox extends UIComponent {
	static readonly className: string = "Checkbox";
	protected static readonly DefaultFontSize: number = 14;
	protected static readonly DefaultButtonSize: number = 20;
	protected static readonly DefaultFont: string = "sans-serif";
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _checked: boolean;
	protected _text: string;
	protected _font: string;
	protected _fontSize: number;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 80;
		this._height = 20;
		this._graphics = new Tea.Graphics2D(
			this._width, this._height
		);
		this._isChanged = true;
		this._checked = false;
		this._text = "Check";
		this._font = Checkbox.DefaultFont;
		this._fontSize = Checkbox.DefaultFontSize;
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
		if (this._checked === value) {
			return;
		}
		this._checked = value;
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
			value = Checkbox.DefaultFont;
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
		if (Tea.JSONUtil.isValidSceneJSON(json, Checkbox.className) === false) {
			callback(null);
			return;
		}
		var checkbox = new Checkbox(app);
		checkbox._width = json.width;
		checkbox._height = json.height;
		checkbox._graphics.resize(json.width, json.height);
		checkbox._checked = json.checked;
		checkbox._text = json.text;
		checkbox._fontSize = json.fontSize;
		checkbox._font = json.font;
		callback(checkbox);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Checkbox.className;
		json.checked = this._checked;
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
		if (this._checked) {
			this.drawCheck();
		}
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
		var color = this._colorMultiplier;
		color[0] = 1.1;
		color[1] = 1.1;
		color[2] = 1.1;
	}

	onClick(): void {
		this.checked = !this._checked;
	}

	protected drawButtonFace(): void {
		var g = this._graphics;
		var size = Checkbox.DefaultButtonSize;
		var lineWidth = 1;
		var paddingX = lineWidth / 2;
		var paddingY = lineWidth / 2 + (this._height - size) / 2;
		var w = size - lineWidth;
		var h = size - lineWidth;
		var gradient = g.createLinearGradient(
			0, paddingY, 0, paddingY + h
		);
		gradient.addColorStop(0, "#FFF");
		gradient.addColorStop(1, "#AAA");
		g.save();
		g.fillStyle = gradient;
		g.strokeStyle = "#888";
		g.lineWidth = lineWidth;
		g.fillRoundRect(paddingX, paddingY, w, h, 5);
		g.storokeRoundRect(paddingX, paddingY, w, h, 5);
		g.restore();
	}

	protected drawCheck(): void {
		var g = this._graphics;
		var size = Checkbox.DefaultButtonSize;
		var paddingY = (this._height - size) / 2;
		g.save();
		g.strokeStyle = "#333";
		g.lineWidth = 3;
		g.lineJoin = "round";
		g.lineCap = "round";
		g.translate(0, paddingY);
		g.beginPath();
		g.moveTo(size / 4, size / 1.7);
		g.lineTo(size / 2.3, size * 3 / 4);
		g.lineTo(size * 3 / 4, size / 4);
		g.stroke();
		g.restore();
	}

	protected drawButtonText(): void {
		var g = this._graphics;
		var x = Checkbox.DefaultButtonSize + 4;
		var y = this._height / 2;
		g.save();
		g.textAlign = "left";
		g.textBaseline = "middle";
		g.font = this.getFont();
		g.fillStyle = "#333";
		//g.strokeStyle = "#FFF";
		//g.lineWidth = 4;
		//g.lineJoin = "round";
		//g.strokeTextMultiLine(this._text, x, y);
		g.fillTextMultiLine(this._text, x, y);
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
			fontSize = Checkbox.DefaultFontSize;
		}
		return fontSize;
	}
}
