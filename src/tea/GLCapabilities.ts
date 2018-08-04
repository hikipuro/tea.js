
export class GLCapabilities {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get isEnabledBlend(): boolean {
		const gl = this._context;
		return gl.isEnabled(gl.BLEND);
	}

	get isEnabledCullFace(): boolean {
		const gl = this._context;
		return gl.isEnabled(gl.CULL_FACE);
	}

	get isEnabledDepthTest(): boolean {
		const gl = this._context;
		return gl.isEnabled(gl.DEPTH_TEST);
	}

	get isEnabledDither(): boolean {
		const gl = this._context;
		return gl.isEnabled(gl.DITHER);
	}

	get isEnabledPolygonOffsetFill(): boolean {
		const gl = this._context;
		return gl.isEnabled(gl.POLYGON_OFFSET_FILL);
	}

	get isEnabledSampleAlphaToCoverage(): boolean {
		const gl = this._context;
		return gl.isEnabled(gl.SAMPLE_ALPHA_TO_COVERAGE);
	}

	get isEnabledSampleCoverage(): boolean {
		const gl = this._context;
		return gl.isEnabled(gl.SAMPLE_COVERAGE);
	}

	get isEnabledScissorTest(): boolean {
		const gl = this._context;
		return gl.isEnabled(gl.SCISSOR_TEST);
	}

	get isEnabledStencilTest(): boolean {
		const gl = this._context;
		return gl.isEnabled(gl.STENCIL_TEST);
	}

	enableBlend(): void {
		const gl = this._context;
		gl.enable(gl.BLEND);
	}

	enableCullFace(): void {
		const gl = this._context;
		gl.enable(gl.CULL_FACE);
	}

	enableDepthTest(): void {
		const gl = this._context;
		gl.enable(gl.DEPTH_TEST);
	}

	enableDither(): void {
		const gl = this._context;
		gl.enable(gl.DITHER);
	}

	enablePolygonOffsetFill(): void {
		const gl = this._context;
		gl.enable(gl.POLYGON_OFFSET_FILL);
	}

	enableSampleAlphaToCoverage(): void {
		const gl = this._context;
		gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
	}

	enableSampleCoverage(): void {
		const gl = this._context;
		gl.enable(gl.SAMPLE_COVERAGE);
	}

	enableScissorTest(): void {
		const gl = this._context;
		gl.enable(gl.SCISSOR_TEST);
	}

	enableStencilTest(): void {
		const gl = this._context;
		gl.enable(gl.STENCIL_TEST);
	}

	/*
	enableRasterizerDiscard(): void {
		const gl = this._context;
		gl.enable(gl.RASTERIZER_DISCARD);
	}
	*/

	disableBlend(): void {
		const gl = this._context;
		gl.disable(gl.BLEND);
	}

	disableCullFace(): void {
		const gl = this._context;
		gl.disable(gl.CULL_FACE);
	}

	disableDepthTest(): void {
		const gl = this._context;
		gl.disable(gl.DEPTH_TEST);
	}

	disableDither(): void {
		const gl = this._context;
		gl.disable(gl.DITHER);
	}

	disablePolygonOffsetFill(): void {
		const gl = this._context;
		gl.disable(gl.POLYGON_OFFSET_FILL);
	}

	disableSampleAlphaToCoverage(): void {
		const gl = this._context;
		gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
	}

	disableSampleCoverage(): void {
		const gl = this._context;
		gl.disable(gl.SAMPLE_COVERAGE);
	}

	disableScissorTest(): void {
		const gl = this._context;
		gl.disable(gl.SCISSOR_TEST);
	}

	disableStencilTest(): void {
		const gl = this._context;
		gl.disable(gl.STENCIL_TEST);
	}

	/*
	disableRasterizerDiscard(): void {
		const gl = this._context;
		gl.disable(gl.RASTERIZER_DISCARD);
	}
	*/
}
