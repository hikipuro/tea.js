import * as Tea from "../Tea";

export class AppStatus {
	isEditor: boolean;
	isEditing: boolean;
	frontFace: number;
	viewport: Tea.Rect;
	frameBuffer: WebGLFramebuffer;
	clearColor: Tea.Color;
	OES_element_index_uint: OES_element_index_uint;
	ANGLE_instanced_arrays: ANGLE_instanced_arrays;
	protected _gl: WebGLRenderingContext;
	protected _enabled: any;
	protected _depthMask: boolean;
	protected _colorMask: Tea.ShaderColorMask;

	constructor(gl: WebGLRenderingContext) {
		this._gl = gl;
		this.isEditor = false;
		this.isEditing = false;
		this.frontFace = gl.CCW;
		this.viewport = new Tea.Rect(0.0, 0.0, 1.0, 1.0);
		this.frameBuffer = null;
		this.clearColor = Tea.Color.black.clone();
		this.OES_element_index_uint = null;
		this.ANGLE_instanced_arrays = null;
		this._enabled = {};
		this._depthMask = true;
		this._colorMask = new Tea.ShaderColorMask();
	}

	enable(cap: number): void {
		if (this._enabled[cap] === true) {
			return;
		}
		this._enabled[cap] = true;
		this._gl.enable(cap);
	}

	disable(cap: number): void {
		if (this._enabled[cap] === false) {
			return;
		}
		this._enabled[cap] = false;
		this._gl.disable(cap);
	}

	depthMask(flag: boolean): void {
		if (this._depthMask === flag) {
			return;
		}
		this._depthMask = flag;
		this._gl.depthMask(flag);
	}

	colorMask(mask: Tea.ShaderColorMask): void {
		if (mask == null) {
			return;
		}
		var colorMask = this._colorMask;
		if (colorMask[0] === mask[0]
		&&  colorMask[1] === mask[1]
		&&  colorMask[2] === mask[2]
		&&  colorMask[3] === mask[3]) {
			return;
		}
		this._gl.colorMask(
			mask[0],
			mask[1],
			mask[2],
			mask[3]
		);
	}

	enableUint32Index(): void {
		if (this.OES_element_index_uint != null) {
			return;
		}
		var name = "OES_element_index_uint";
		var ext = this._gl.getExtension(name);
		if (ext == null) {
			console.warn("App.enableUint32Index(): " + name + " is not supported");
			return;
		}
		this.OES_element_index_uint = ext;
	}

	enableInstancedArrays(): void {
		if (this.ANGLE_instanced_arrays != null) {
			return;
		}
		var name = "ANGLE_instanced_arrays";
		var ext = this._gl.getExtension(name);
		if (ext == null) {
			console.warn("App.enableInstancedArrays(): " + name + " is not supported");
			return;
		}
		this.ANGLE_instanced_arrays = ext;
	}

	setClearColor(color: Tea.Color): void {
		if (color == null) {
			return;
		}
		var clearColor = this.clearColor;
		if (clearColor[0] === color[0]
		&&  clearColor[1] === color[1]
		&&  clearColor[2] === color[2]
		&&  clearColor[3] === color[3]) {
			return;
		}
		this._gl.clearColor(color[0], color[1], color[2], color[3]);
		clearColor[0] = color[0];
		clearColor[1] = color[1];
		clearColor[2] = color[2];
		clearColor[3] = color[3];
	}

	setFrontFace(face: number): void {
		if (this.frontFace === face) {
			return;
		}
		this._gl.frontFace(face);
		this.frontFace = face;
	}

	setViewport(x: number, y: number, width: number, height: number): void {
		var gl = this._gl;
		var viewport = this.viewport;
		if (viewport[0] === x
		&&  viewport[1] === y
		&&  viewport[2] === width
		&&  viewport[3] === height) {
			return;
		}
		gl.viewport(x, y, width, height);
		gl.scissor(x, y, width, height);
		viewport[0] = x;
		viewport[1] = y;
		viewport[2] = width;
		viewport[3] = height;
	}

	bindFramebuffer(frameBuffer: WebGLFramebuffer): void {
		if (this.frameBuffer === frameBuffer) {
			return;
		}
		this.frameBuffer = frameBuffer;
		var gl = this._gl;
		gl.bindFramebuffer(
			gl.FRAMEBUFFER,
			frameBuffer
		);
	}
}
