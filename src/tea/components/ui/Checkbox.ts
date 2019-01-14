import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Checkbox extends UIComponent {
	static readonly className: string = "Checkbox";
	protected static readonly DefaultFontSize: number = 14;
	protected static readonly DefaultButtonSize: number = 20;
	protected static readonly DefaultFont: string = "sans-serif";
	protected static readonly DefaultText: string = "Check";
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _checked: boolean;
	protected _text: string;
	protected _font: string;
	protected _fontSize: number;
	protected _fontColor: Tea.Color;
	protected _buttonSize: number;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 80;
		this._height = 20;
		this._graphics = new Tea.Graphics2D(
			this._width, this._height
		);
		this._isChanged = true;
		this._checked = false;
		this._text = Checkbox.DefaultText;
		this._font = Checkbox.DefaultFont;
		this._fontSize = Checkbox.DefaultFontSize;
		this._fontColor = new Tea.Color(0.2, 0.2, 0.2, 1.0);
		this._buttonSize = Checkbox.DefaultButtonSize;
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
		if (value == null || value === this._checked) {
			return;
		}
		this._checked = value;
		this._isChanged = true;
	}

	get text(): string {
		return this._text;
	}
	set text(value: string) {
		if (value == null || value === this._text) {
			return;
		}
		this._text = value;
		this._isChanged = true;
	}

	get font(): string {
		return this._font;
	}
	set font(value: string) {
		if (value == null || value === this._font) {
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
		if (value == null || value === this._fontSize) {
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

	get buttonSize(): number {
		return this._buttonSize;
	}
	set buttonSize(value: number) {
		if (value == null || value === this._buttonSize) {
			return;
		}
		this._buttonSize = value;
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
		checkbox.checked = json.checked;
		checkbox.text = json.text;
		checkbox.fontSize = json.fontSize;
		checkbox.font = json.font;
		checkbox.fontColor = Tea.Color.fromArray(json.fontColor);
		checkbox.buttonSize = json.buttonSize;
		callback(checkbox);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		this._isChanged = undefined;
		this._checked = undefined;
		this._text = undefined;
		this._font = undefined;
		this._fontSize = undefined;
		this._fontColor = undefined;
		this._buttonSize = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Checkbox.className;
		json.checked = this._checked;
		json.text = this._text;
		json.fontSize = this._fontSize;
		json.font = this._font;
		json.fontColor = this._fontColor;
		json.buttonSize = this._buttonSize;
		return json;
	}

	update(): void {
		super.update();
		if (this._isChanged === false) {
			return;
		}
		this._graphics.clear();
		this.drawButton();
		if (this._checked) {
			this.drawCheck();
		}
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

	onClick(): void {
		this.checked = !this._checked;
	}

	protected drawButton(): void {
		var g = this._graphics;
		var buttonSize = this._buttonSize;
		var lineWidth = 1;
		var paddingX = lineWidth / 2;
		var paddingY = lineWidth / 2 + (this._height - buttonSize) / 2;
		var w = buttonSize - lineWidth;
		var h = buttonSize - lineWidth;
		g.save();
		g.translate(paddingX, paddingY);
		g.fillStyle = "#DDD";
		/*
		var gradient = g.createLinearGradient(
			0, 0, 0, h
		);
		gradient.addColorStop(0, "#FFF");
		gradient.addColorStop(1, "#AAA");
		g.fillStyle = gradient;
		//*/
		g.fillRoundRect(0, 0, w, h, 5);
		g.strokeStyle = "#888";
		g.lineWidth = lineWidth;
		g.storokeRoundRect(0, 0, w, h, 5);
		g.restore();
	}

	protected drawCheck(): void {
		var g = this._graphics;
		var buttonSize = this._buttonSize;
		var paddingY = (this._height - buttonSize) / 2;
		g.save();
		g.strokeStyle = "#333";
		g.lineWidth = buttonSize / 6;
		g.lineJoin = "round";
		g.lineCap = "round";
		g.translate(0, paddingY);
		g.beginPath();
		g.moveTo(buttonSize / 4, buttonSize / 1.7);
		g.lineTo(buttonSize / 2.3, buttonSize * 3 / 4);
		g.lineTo(buttonSize * 3 / 4, buttonSize / 4);
		g.stroke();
		g.restore();
	}

	protected drawText(): void {
		var g = this._graphics;
		var x = this._buttonSize + 4;
		var y = this._height / 2;
		g.save();
		g.textAlign = "left";
		g.textVerticalAlign = "middle";
		g.textBaseline = "middle";
		g.font = this.getFont();
		g.fillStyle = this._fontColor.toCssColor();
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
