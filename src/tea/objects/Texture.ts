import * as Tea from "../Tea";

type TextureImage = (
	ImageBitmap |
	ImageData |
	HTMLVideoElement |
	HTMLImageElement |
	HTMLCanvasElement
);

export class Texture {
	static readonly className: string = "Texture";
	protected static _emptyImageData: ImageData;
	protected static _graphics: Tea.Graphics2D;
	app: Tea.App;
	url: string;
	texture: WebGLTexture;
	flipY: boolean = true;
	premultiplyAlpha: boolean = false;

	protected gl: WebGLRenderingContext;
	protected _image: TextureImage;
	protected _filterMode: Tea.FilterMode;
	protected _wrapMode: Tea.TextureWrapMode;
	protected _updateCount: number;
	protected _isEmpty: boolean;
	protected _emptyColor: Tea.Color;

	constructor(app: Tea.App) {
		this.app = app;
		this.url = null;
		this.gl = app.gl;
		this._filterMode = Tea.FilterMode.Point;
		this._wrapMode = Tea.TextureWrapMode.Repeat;
		this._updateCount = 0;
		this._isEmpty = false;
		this._emptyColor = Tea.Color.white.clone();
		var gl = this.gl;
		this.texture = gl.createTexture();
	}

	static init(): void {
		Texture._graphics = new Tea.Graphics2D(8, 8);
	}

	static getEmpty(app: Tea.App, r: number = 1.0, g: number = 1.0, b: number = 1.0, a: number = 1.0): Texture {
		if (r === 1.0 && g === 1.0 && b === 1.0 && a === 1.0) {
			if (Texture._emptyImageData == null) {
				Texture._emptyImageData = Texture.createEmptyImageData();
			}
			var t = Texture.createEmptyTexture(app, Texture._emptyImageData);
			t._emptyColor.set(r, g, b, a);
			return t;
		}
		var imageData = Texture.createEmptyImageData(r, g, b, a);
		var t = Texture.createEmptyTexture(app, imageData);
		t._emptyColor.set(r, g, b, a);
		return t;
	}

	static getDefaultParticle(app: Tea.App): Texture {
		var texture = new Tea.Texture(app);
		var size = 64;
		var center = size / 2;
		var data = new Array(4 * size * size);
		data.fill(0.0);
		var hPI = Math.PI / 2.0;
		for (var y = 0; y < size; y++) {
			for (var x = 0; x < size; x++) {
				var dx = Math.abs(x - center);
				var dy = Math.abs(y - center);
				var distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < center) {
					var index = (y * size + x) * 4;
					var value = distance / center;
					value = Math.cos(hPI * value);
					data[index + 0] = 255;
					data[index + 1] = 255;
					data[index + 2] = 255;
					data[index + 3] = 255 * value;
				}
			}
		}
		var array = new Uint8ClampedArray(data);
		var imageData = new ImageData(array, size, size);
		texture.image = imageData;
		return texture;
	}

	protected static createEmptyImageData(r: number = 1.0, g: number = 1.0, b: number = 1.0, a: number = 1.0): ImageData {
		var array = new Uint8ClampedArray([255.0 * r, 255.0 * g, 255.0 * b, 255.0 * a]);
		return new ImageData(array, 1, 1);
	}

	protected static createEmptyTexture(app: Tea.App, imageData: ImageData): Texture {
		var texture = new Tea.Texture(app);
		texture.image = imageData;
		texture._isEmpty = true;
		return texture;
	}

	get width(): number {
		if (this._image == null) {
			return 0;
		}
		return this._image.width;
	}

	get height(): number {
		if (this._image == null) {
			return 0;
		}
		return this._image.height;
	}

	get dimension(): Tea.TextureDimension {
		return Tea.TextureDimension.Tex2D;
	}

	get filterMode(): Tea.FilterMode {
		return this._filterMode;
	}
	set filterMode(value: Tea.FilterMode) {
		this._filterMode = value;
		this.bind();
		var param = this.convertFilterMode(value);
		var gl = this.gl;
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MAG_FILTER,
			param
		);
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MIN_FILTER,
			param
		);
		this.unbind();
	}

	get wrapMode(): Tea.TextureWrapMode {
		return this._wrapMode;
	}
	set wrapMode(value: Tea.TextureWrapMode) {
		this._wrapMode = value;
		this.bind();
		var param = this.convertWrapMode(value);
		var gl = this.gl;
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_S,
			param
		);
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_T,
			param
		);
		this.unbind();
	}

	set wrapModeU(value: Tea.TextureWrapMode) {
		this.bind();
		var param = this.convertWrapMode(value);
		var gl = this.gl;
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_S,
			param
		);
		this.unbind();
	}

	set wrapModeV(value: Tea.TextureWrapMode) {
		this.bind();
		var param = this.convertWrapMode(value);
		var gl = this.gl;
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_WRAP_T,
			param
		);
		this.unbind();
	}

	get updateCount(): number {
		return this._updateCount;
	}

	get image(): TextureImage {
		return this._image;
	}

	set image(image: TextureImage) {
		this._image = image;
		this.bind();
		var gl = this.gl;
		if (this.flipY) {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		}
		if (this.premultiplyAlpha) {
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
		}
		image = this.resizeImage(image);
		gl.texImage2D(
			gl.TEXTURE_2D, 0,
			gl.RGBA, gl.RGBA,
			gl.UNSIGNED_BYTE,
			image
		);
		this.generateMipmap(image);
		this.filterMode = this._filterMode;
		this.wrapMode = this._wrapMode;
		this.unbind();
		if (this.flipY) {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
		}
		if (this.premultiplyAlpha) {
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
		}
		this._updateCount++;
	}

	load(url: string, callback: (err: string, url: string) => void = null): void {
		if (url == null || url === "") {
			var err = "invalid url";
			console.error("Texture.load()", err);
			if (callback) {
				callback(err, url);
			}
			return;
		}
		if (this.app.status.isEditor
		&&  url.indexOf("/") !== 0) {
			url = process.cwd() + "/assets/" + url;
		}
		Tea.File.readImage(url, (err, image) => {
			if (err) {
				console.error("Texture.load()", url, err);
				if (callback) {
					callback(err, url);
				}
				return;
			}
			//console.log("load texture", url);
			this._isEmpty = false;
			this.url = url;
			this.image = image;
			if (callback) {
				callback(null, url);
			}
		});
	}

	destroy(): void {
		if (this.texture != null) {
			this.gl.deleteTexture(this.texture);
			this.texture = null;
		}
		this.app = undefined;
		this.url = undefined;
		this.gl = undefined;
		this._image = undefined;
		this._filterMode = undefined;
		this._wrapMode = undefined;
		this._updateCount = undefined;
		this._isEmpty = undefined;
		this._emptyColor = undefined;
	}

	toJSON(): Object {
		var json = Tea.JSONUtil.createSceneJSON(Texture.className);
		json.url = this.url;
		json.isEmpty = this._isEmpty;
		json.emptyColor = this._emptyColor;
		return json;
	}

	static fromJSON(app: Tea.App, json: any, callback: (texture: Texture) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Texture.className) === false) {
			callback(null);
			return;
		}
		var texture: Texture = null;
		if (json.isEmpty) {
			var color = Tea.Color.fromArray(json.emptyColor);
			texture = Texture.getEmpty(
				app, color[0], color[1], color[2], color[3]
			);
		} else {
			texture = Texture.getEmpty(app);
			if (json.url) {
				texture.load(json.url, (err: string, url: string) => {
					if (err) {
						callback(null);
						return;
					}
					callback(texture);
				});
				return;
			}
		}
		callback(texture);
	}

	protected generateMipmap(image: TextureImage): void {
		if (Tea.Mathf.isPowerOf2(image.width, image.height) === false) {
			return;
		}
		var gl = this.gl;
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	protected bind(): void {
		var gl = this.gl;
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}

	protected unbind(): void {
		var gl = this.gl;
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	protected convertFilterMode(mode: Tea.FilterMode): number {
		var gl = this.gl;
		switch (mode) {
			case Tea.FilterMode.Point:
				return gl.LINEAR;
			case Tea.FilterMode.Bilinear:
				return gl.NEAREST;
		}
		return gl.LINEAR;
	}

	protected convertWrapMode(mode: Tea.TextureWrapMode): number {
		var gl = this.gl;
		switch (mode) {
			case Tea.TextureWrapMode.Repeat:
				return gl.REPEAT;
			case Tea.TextureWrapMode.Clamp:
				return gl.CLAMP_TO_EDGE;
			case Tea.TextureWrapMode.Mirror:
				return gl.MIRRORED_REPEAT;
		}
		return gl.REPEAT;
	}

	protected resizeImage(image: TextureImage): TextureImage {
		if (image == null) {
			return null;
		}
		if (Tea.Mathf.isPowerOf2(image.width, image.height)) {
			return image;
		}
		var graphics = Texture._graphics;
		graphics.resize(image.width, image.height);
		graphics.drawImage(image, 0, 0, graphics.width, graphics.height);
		return graphics.canvas;
	}
}

Texture.init();
