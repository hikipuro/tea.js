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

	constructor(app: Tea.App) {
		this.app = app;
		const gl = this.app.gl;
		this.webgl.texture = gl.createTexture();
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
		const gl = this.app.gl;
		this._image = image;
		gl.bindTexture(gl.TEXTURE_2D, this.webgl.texture);
		//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(
			gl.TEXTURE_2D, 0,
			gl.RGBA, gl.RGBA,
			gl.UNSIGNED_BYTE,
			image
		);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	bind(): void {
		const gl = this.app.gl;
		gl.bindTexture(gl.TEXTURE_2D, this.webgl.texture);
	}

	generateMipmap(): void {
		const gl = this.app.gl;
		gl.generateMipmap(gl.TEXTURE_2D);
	}
}
