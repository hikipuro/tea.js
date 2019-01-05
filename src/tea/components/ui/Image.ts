import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Image extends UIComponent {
	static readonly className: string = "Image";
	protected _graphics: Tea.Graphics2D;
	protected _image: HTMLImageElement;
	protected _url: string;
	
	constructor(app: Tea.App) {
		super(app);
		//this._width = 64;
		//this._height = 64;
		this._graphics = new Tea.Graphics2D(64, 64);
		this._image = document.createElement("img") as HTMLImageElement;
		this._image.addEventListener("load", this.onLoadImage);
		this._url = null;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Image.className) === false) {
			callback(null);
			return;
		}
		var image = new Image(app);
		if (json.url == null || json.url === "") {
			callback(image);
			return;
		}
		var onLoad = () => {
			image._image.removeEventListener("load", onLoad);
			callback(image);
		};
		image._image.addEventListener("load", onLoad);
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
		super.destroy();
	}

	update(): void {
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Image.className;
		json.url = this.url;
		return json;
	}

	protected onLoadImage = (e: Event): void => {
		//console.log("onLoadImage");
		var image = this._image;
		this._width = image.width;
		this._height = image.height;
		this._graphics.resize(image.width, image.height);
		this._graphics.drawImage(image, 0, 0);
		//this._image.src = "";
		this.texture.image = this._graphics.canvas;
	}
}
