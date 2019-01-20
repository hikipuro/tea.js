import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Image extends UIComponent {
	static readonly className: string = "Image";
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _image: HTMLImageElement;
	protected _url: string;
	protected _background: Tea.Color;
	protected _border: boolean;
	protected _borderWidth: number;
	protected _borderRadius: number;
	protected _borderColor: Tea.Color;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 64;
		this._height = 64;
		this._graphics = new Tea.Graphics2D(
			this._width, this._height
		);
		this._isChanged = true;
		this._image = document.createElement("img") as HTMLImageElement;
		this._image.addEventListener("load", this.onLoadImage);
		this._url = null;
		this._background = new Tea.Color(1.0, 1.0, 1.0, 1.0);
		this._border = false;
		this._borderWidth = 1.0;
		this._borderRadius = 0.0;
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

	get url(): string {
		return this._url;
	}
	set url(value: string) {
		if (this._url === value) {
			return;
		}
		this._url = value;
		if (value == null) {
			this.texture.image = null;
			return;
		}
		value = this.app.resolvePath(value);
		this._image.src = value;
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
		if (Tea.JSONUtil.isValidSceneJSON(json, Image.className) === false) {
			callback(null);
			return;
		}
		var image = new Image(app);
		image.enabled = json.enabled;
		image._width = json.width;
		image._height = json.height;
		image._graphics.resize(json.width, json.height);
		image.background = Tea.Color.fromArray(json.background);
		image.border = json.border;
		image.borderWidth = json.borderWidth;
		image.borderRadius = json.borderRadius;
		image.borderColor = Tea.Color.fromArray(json.borderColor);
		if (json.url == null || json.url === "") {
			callback(image);
			return;
		}
		var onLoad = () => {
			image._image.removeEventListener("load", onLoad);
			image._image.removeEventListener("error", onError);
			callback(image);
		};
		var onError = () => {
			image._image.removeEventListener("load", onLoad);
			image._image.removeEventListener("error", onError);
			callback(image);
		};
		image._image.addEventListener("load", onLoad);
		image._image.addEventListener("error", onError);
		image.url = json.url;
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		if (this._image != null) {
			this._image.removeEventListener("load", this.onLoadImage);
			this._image = undefined;
		}
		this._url = undefined;
		this._background = undefined;
		this._border = undefined;
		this._borderWidth = undefined;
		this._borderRadius = undefined;
		this._borderColor = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Image.className;
		json.url = this.url;
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
		this.drawImage();
		this.drawBorder();
		this.texture.image = this._graphics.canvas;
		this._isChanged = false;
	}

	protected drawImage(): void {
		var g = this._graphics;
		var image = this._image;
		var width = this._width;
		var height = this._height;
		var borderWidth = this._borderWidth;
		if (!this._border || borderWidth <= 0) {
			g.save();
			g.fillStyle = this._background.toCssColor();
			g.fillRect(0, 0, width, height);
			g.drawImage(image, 0, 0);
			g.restore();
			return;
		}
		var padding = borderWidth / 2;
		g.save();
		g.fillStyle = this._background.toCssColor();
		g.fillRect(0, 0, width, height);
		g.drawImage(image, padding, padding);
		g.restore();
	}

	protected drawBorder(): void {
		var g = this._graphics;
		var width = this._width;
		var height = this._height;
		var borderRadius = this._borderRadius;
		var borderWidth = this._borderWidth;
		if (!this._border || borderWidth <= 0) {
			if (borderRadius !== 0) {
				// mask
				g.save();
				g.globalCompositeOperation = "destination-in";
				g.fillRoundRect(0, 0, width, height, borderRadius);
				g.restore();
			}
			return;
		}
		var padding = borderWidth / 2;
		width -= borderWidth;
		height -= borderWidth;
		// mask
		g.save();
		g.translate(padding, padding);
		g.globalCompositeOperation = "destination-in";
		g.fillRoundRect(0, 0, width, height, borderRadius);
		g.restore();
		// border
		g.save();
		g.translate(padding, padding);
		g.strokeStyle = this._borderColor.toCssColor();
		g.lineWidth = borderWidth;
		g.storokeRoundRect(0, 0, width, height, borderRadius);
		g.restore();
	}

	protected onLoadImage = (e: Event): void => {
		this._isChanged = true;
	}
}
