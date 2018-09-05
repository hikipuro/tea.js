import * as Tea from "../Tea";
import { Texture } from "./Texture";

export enum RenderTextureFormat {
	RGBA4,
	RGB5_A1,
	RGB565,
	DEPTH_COMPONENT16,
	STENCIL_INDEX8
}

export class RenderTexture extends Texture {
	frameBuffer: WebGLFramebuffer;
	renderBuffer: WebGLRenderbuffer;
	protected _width: number;
	protected _height: number;

	constructor(app: Tea.App, width: number = 256, height: number = 256) {
		super(app);
		this._width = Tea.Mathf.closestPowerOfTwo(width);
		this._height = Tea.Mathf.closestPowerOfTwo(height);
		this.createBuffers();
	}

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}

	bind(): void {
		var gl = this.app.gl;
		gl.bindFramebuffer(
			gl.FRAMEBUFFER,
			this.frameBuffer
		);
	}

	unbind(): void {
		var gl = this.app.gl;
		gl.bindFramebuffer(
			gl.FRAMEBUFFER,
			null
		);
	}

	protected createBuffers(): void {
		var gl = this.app.gl;
		var width = this._width;
		var height = this._height;
		this.webgl.texture = gl.createTexture();
		this.renderBuffer = gl.createRenderbuffer();
		this.frameBuffer = gl.createFramebuffer();
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.webgl.texture);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0, gl.RGBA,
			width, height,
			0, gl.RGBA,
			gl.UNSIGNED_BYTE,
			null
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
		gl.renderbufferStorage(
			gl.RENDERBUFFER,
			gl.DEPTH_COMPONENT16,
			width, height
		);
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
		gl.framebufferRenderbuffer(
			gl.FRAMEBUFFER,
			gl.DEPTH_ATTACHMENT,
			gl.RENDERBUFFER,
			this.renderBuffer
		);
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,
			gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D,
			this.webgl.texture, 0
		);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
}
