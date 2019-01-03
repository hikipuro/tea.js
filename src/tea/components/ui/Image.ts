import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Image extends UIComponent {
	static readonly className: string = "Image";
	protected _image: HTMLImageElement;
	
	constructor(app: Tea.App) {
		super(app);
		//this._width = 64;
		//this._height = 64;
		this._image = document.createElement("img") as HTMLImageElement;
		this._image.addEventListener("load", this.onLoadImage);
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Image.className) === false) {
			callback(null);
			return;
		}
		var image = new Image(app);
		image.src = json.src;
		callback(image);
	}

	get src(): string {
		return this._image.src;
	}
	set src(value: string) {
		//console.log("set src", value);
		this._image.src = value;
	}

	destroy(): void {
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
		json.src = this.src;
		return json;
	}

	protected onLoadImage = (e: Event): void => {
		//console.log("onLoadImage");
		var image = this._image;
		this._width = image.width;
		this._height = image.height;
		this.texture.image = image;
	}
}
