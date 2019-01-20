import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Image extends UIComponent {
	static readonly className: string = "Image";
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _image: HTMLImageElement;
	protected _url: string;
	
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
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Image.className;
		json.url = this.url;
		return json;
	}

	update(): void {
		super.update();
		if (this._isChanged === false) {
			return;
		}
		this._graphics.clear();
		this.drawImage();
		this.texture.image = this._graphics.canvas;
		this._isChanged = false;
	}

	protected drawImage(): void {
		var image = this._image;
		this._graphics.drawImage(image, 0, 0);
	}

	protected onLoadImage = (e: Event): void => {
		this._isChanged = true;
	}
}
