import { Buffer } from "./Buffer";

export class WebGL {
	gl: WebGLRenderingContext;

	constructor(gl: WebGLRenderingContext) {
		this.gl = gl;
	}

	public init(): void {
		var gl = this.gl;
	}
}