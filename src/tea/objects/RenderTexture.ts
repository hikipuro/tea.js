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
		this.setTextureSize();
		this.createBuffers();
	}

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}

	destroy(): void {
		//console.log("destroy RenderTexture", arguments.callee);
		var gl = this.gl;
		if (this.frameBuffer != null) {
			gl.deleteFramebuffer(this.frameBuffer);
			this.frameBuffer = undefined;
		}
		if (this.renderBuffer != null) {
			gl.deleteRenderbuffer(this.renderBuffer);
			this.renderBuffer = undefined;
		}
		super.destroy();
	}

	bindFramebuffer(): void {
		var status = this.app.status;
		if (status.frameBuffer === this.frameBuffer) {
			return;
		}
		status.frameBuffer = this.frameBuffer;
		var gl = this.gl;
		gl.bindFramebuffer(
			gl.FRAMEBUFFER,
			this.frameBuffer
		);
	}

	unbindFramebuffer(): void {
		var status = this.app.status;
		status.frameBuffer = null;
		var gl = this.gl;
		gl.bindFramebuffer(
			gl.FRAMEBUFFER,
			null
		);
	}

	protected setTextureSize(): void {
		var gl = this.app.gl;
		var maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
		this._width = Math.min(maxSize, this._width);
		this._height = Math.min(maxSize, this._height);
	}

	protected createBuffers(): void {
		var width = this._width;
		var height = this._height;
		this.createTexture(width, height);
		this.createRenderBuffer(width, height);
		this.createFrameBuffer();
	}

	protected createTexture(width: number, height: number): void {
		var gl = this.gl;
		this.texture = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
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
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	protected createRenderBuffer(width: number, height: number): void {
		var gl = this.gl;
		this.renderBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
		gl.renderbufferStorage(
			gl.RENDERBUFFER,
			gl.DEPTH_COMPONENT16,
			width, height
		);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	}

	protected createFrameBuffer(): void {
		var gl = this.gl;
		this.frameBuffer = gl.createFramebuffer();
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
			this.texture, 0
		);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
}
