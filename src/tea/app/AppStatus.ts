import * as Tea from "../Tea";

export class AppStatus {
	frontFace: number;
	viewport: Tea.Rect;
	frameBuffer: WebGLFramebuffer;
	OES_element_index_uint: OES_element_index_uint;
	ANGLE_instanced_arrays: ANGLE_instanced_arrays;
	protected _gl: WebGLRenderingContext;

	constructor(gl: WebGLRenderingContext) {
		this._gl = gl;
		this.frontFace = gl.CCW;
		this.viewport = new Tea.Rect(0.0, 0.0, 1.0, 1.0);
		this.frameBuffer = null;
		this.OES_element_index_uint = null;
		this.ANGLE_instanced_arrays = null;
	}
}
