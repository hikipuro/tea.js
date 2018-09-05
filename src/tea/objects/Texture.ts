import * as Tea from "../Tea";

type TextureImage = (
	ImageBitmap |
	ImageData |
	HTMLVideoElement |
	HTMLImageElement |
	HTMLCanvasElement
);

export class Texture {
	app: Tea.App;
	webgl: any = {
		texture: WebGLTexture
	};

	protected _image: TextureImage;
	protected _filterMode: Tea.FilterMode;
	protected _wrapMode: Tea.TextureWrapMode;
	protected _updateCount: number;

	constructor(app: Tea.App) {
		this.app = app;
		this._filterMode = Tea.FilterMode.Point;
		this._wrapMode = Tea.TextureWrapMode.Repeat;
		this._updateCount = 0;
		const gl = this.app.gl;
		this.webgl.texture = gl.createTexture();
	}

	static getEmpty(app: Tea.App): Texture {
		var texture = new Tea.Texture(app);
		var array = new Uint8ClampedArray([255, 255, 255, 255]);
		var imageData = new ImageData(array, 1, 1);
		texture.image = imageData;
		return texture;
	}

	get texture(): WebGLTexture {
		return this.webgl.texture;
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
		var gl = this.app.gl;
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
		var gl = this.app.gl;
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
		var gl = this.app.gl;
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
		var gl = this.app.gl;
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

	isGLTexture(texture: WebGLTexture): boolean {
		const gl = this.app.gl;
		return gl.isTexture(texture);
	}

	remove(): void {
		const gl = this.app.gl;
		if (this.webgl.texture != null) {
			gl.deleteTexture(this.webgl.texture);
			this.webgl.texture = null;
		}
	}

	get image(): TextureImage {
		return this._image;
	}

	set image(image: TextureImage) {
		this._image = image;
		this.bind();
		var gl = this.app.gl;
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
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
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		this._updateCount++;
	}

	protected generateMipmap(image: TextureImage): void {
		if (Tea.Mathf.isPowerOf2(image.width, image.height) === false) {
			return;
		}
		var gl = this.app.gl;
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	protected bind(): void {
		var gl = this.app.gl;
		gl.bindTexture(gl.TEXTURE_2D, this.webgl.texture);
	}

	protected unbind(): void {
		var gl = this.app.gl;
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	protected convertFilterMode(mode: Tea.FilterMode): number {
		var gl = this.app.gl;
		switch (mode) {
			case Tea.FilterMode.Point:
				return gl.LINEAR;
			case Tea.FilterMode.Bilinear:
				return gl.NEAREST;
		}
		return gl.LINEAR;
	}

	protected convertWrapMode(mode: Tea.TextureWrapMode): number {
		var gl = this.app.gl;
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
}
