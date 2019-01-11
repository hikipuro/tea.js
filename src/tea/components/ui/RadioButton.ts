import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class RadioButton extends UIComponent {
	static readonly className: string = "RadioButton";
	protected static readonly DefaultFontSize: number = 14;
	protected static readonly DefaultButtonSize: number = 20;
	protected static readonly DefaultFont: string = "sans-serif";
	protected static readonly DefaultText: string = "Radio";
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
		this._text = RadioButton.DefaultText;
		this._font = RadioButton.DefaultFont;
		this._fontSize = RadioButton.DefaultFontSize;
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
			value = RadioButton.DefaultFont;
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
		if (Tea.JSONUtil.isValidSceneJSON(json, RadioButton.className) === false) {
			callback(null);
			return;
		}
		var radio = new RadioButton(app);
		radio._width = json.width;
		radio._height = json.height;
		radio._graphics.resize(json.width, json.height);
		radio._checked = json.checked;
		radio._text = json.text;
		radio._fontSize = json.fontSize;
		radio._font = json.font;
		callback(radio);
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
		json[Tea.JSONUtil.TypeName] = RadioButton.className;
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
		var checked = this._checked;
		if (checked) {
			return;
		}
		this.uncheckSiblings();
		this.checked = true;
	}

	protected uncheckSiblings(): void {
		var object3d = this.object3d;
		if (object3d == null || object3d.parent == null) {
			return;
		}
		var children = object3d.parent.children;
		if (children == null || children.length <= 0) {
			return;
		}
		var length = children.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
			var items = child.getComponents(Tea.UI.RadioButton);
			if (items == null || items.length <= 0) {
				continue;;
			}
			for (var n = 0; n < items.length; n++) {
				items[n].checked = false;
			}
		}
	}

	protected drawButtonFace(): void {
		var g = this._graphics;
		var size = RadioButton.DefaultButtonSize;
		var lineWidth = 1;
		var paddingX = lineWidth / 2;
		var paddingY = lineWidth / 2 + (this._height - size) / 2;
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

	protected drawCheck(): void {
		var g = this._graphics;
		var size = RadioButton.DefaultButtonSize;
		var paddingY = (this._height - size) / 2;
		g.save();
		g.fillStyle = "#333";
		g.translate(0, paddingY);
		var radius = size / 5;
		size /= 2;
		g.fillCircle(size, size, radius);
		g.restore();
	}

	protected drawButtonText(): void {
		var g = this._graphics;
		var x = RadioButton.DefaultButtonSize + 4;
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
			fontSize = RadioButton.DefaultFontSize;
		}
		return fontSize;
	}
}
