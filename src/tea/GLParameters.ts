// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError
class Errors {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get NoError(): number {
		const gl = this._context;
		return gl.NO_ERROR;
	}

	get InvalidEnum(): number {
		const gl = this._context;
		return gl.INVALID_ENUM;
	}

	get InvalidValue(): number {
		const gl = this._context;
		return gl.INVALID_VALUE;
	}

	get InvalidOperation(): number {
		const gl = this._context;
		return gl.INVALID_OPERATION;
	}

	get InvalidFramebufferOperation(): number {
		const gl = this._context;
		return gl.INVALID_FRAMEBUFFER_OPERATION;
	}

	get OutOfMemory(): number {
		const gl = this._context;
		return gl.OUT_OF_MEMORY;
	}

	get ContextLostWebGL(): number {
		const gl = this._context;
		return gl.CONTEXT_LOST_WEBGL;
	}
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getExtension
class ExtensionName {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveUniform
class ActiveInfoType {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get Float(): number {
		const gl = this._context;
		return gl.FLOAT;
	}

	get FloatVec2(): number {
		const gl = this._context;
		return gl.FLOAT_VEC2;
	}

	get FloatVec3(): number {
		const gl = this._context;
		return gl.FLOAT_VEC3;
	}

	get FloatVec4(): number {
		const gl = this._context;
		return gl.FLOAT_VEC4;
	}

	get Int(): number {
		const gl = this._context;
		return gl.INT;
	}

	get IntVec2(): number {
		const gl = this._context;
		return gl.INT_VEC2;
	}

	get IntVec3(): number {
		const gl = this._context;
		return gl.INT_VEC3;
	}

	get IntVec4(): number {
		const gl = this._context;
		return gl.INT_VEC4;
	}

	get Bool(): number {
		const gl = this._context;
		return gl.BOOL;
	}

	get BoolVec2(): number {
		const gl = this._context;
		return gl.BOOL_VEC2;
	}

	get BoolVec3(): number {
		const gl = this._context;
		return gl.BOOL_VEC3;
	}

	get BoolVec4(): number {
		const gl = this._context;
		return gl.BOOL_VEC4;
	}

	get FloatMat2(): number {
		const gl = this._context;
		return gl.FLOAT_MAT2;
	}

	get FloatMat3(): number {
		const gl = this._context;
		return gl.FLOAT_MAT3;
	}

	get FloatMat4(): number {
		const gl = this._context;
		return gl.FLOAT_MAT4;
	}

	get Sampler2D(): number {
		const gl = this._context;
		return gl.SAMPLER_2D;
	}

	get SamplerCube(): number {
		const gl = this._context;
		return gl.SAMPLER_CUBE;
	}
}

class BufferTarget {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get ArrayBuffer(): number {
		const gl = this._context;
		return gl.ARRAY_BUFFER;
	}

	get ElementArrayBuffer(): number {
		const gl = this._context;
		return gl.ELEMENT_ARRAY_BUFFER;
	}
}

class BufferUsage {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get StaticDraw(): number {
		const gl = this._context;
		return gl.STATIC_DRAW;
	}

	get DynamicDraw(): number {
		const gl = this._context;
		return gl.DYNAMIC_DRAW;
	}

	get StreamDraw(): number {
		const gl = this._context;
		return gl.STREAM_DRAW;
	}
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getBufferParameter
class BufferPName {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get BufferSize(): number {
		const gl = this._context;
		return gl.BUFFER_SIZE;
	}

	get BufferUsage(): number {
		const gl = this._context;
		return gl.BUFFER_USAGE;
	}
}

class FramebufferTarget {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get Framebuffer(): number {
		const gl = this._context;
		return gl.FRAMEBUFFER;
	}
}

class FramebufferStatus {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get FramebufferComplete(): number {
		const gl = this._context;
		return gl.FRAMEBUFFER_COMPLETE;
	}

	get FramebufferIncompleteAttachment(): number {
		const gl = this._context;
		return gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
	}

	get FramebufferIncompleteMissingAttachment(): number {
		const gl = this._context;
		return gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;
	}

	get FramebufferIncompleteDimensions(): number {
		const gl = this._context;
		return gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS;
	}

	get FramebufferUnsupported(): number {
		const gl = this._context;
		return gl.FRAMEBUFFER_UNSUPPORTED;
	}
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getFramebufferAttachmentParameter
class FramebufferPName {

}

class RenderbufferTarget {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get Renderbuffer(): number {
		const gl = this._context;
		return gl.RENDERBUFFER;
	}
}

class RenderbufferAttachment {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get ColorAttachment0(): number {
		const gl = this._context;
		return gl.COLOR_ATTACHMENT0;
	}

	get DepthAttachment(): number {
		const gl = this._context;
		return gl.DEPTH_ATTACHMENT;
	}

	get DepthStencilAttachment(): number {
		const gl = this._context;
		return gl.DEPTH_STENCIL_ATTACHMENT;
	}

	get StencilAttachment(): number {
		const gl = this._context;
		return gl.STENCIL_ATTACHMENT;
	}
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getRenderbufferParameter
class RenderbufferParameter {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get RenderbufferWidth(): number {
		const gl = this._context;
		return gl.RENDERBUFFER_WIDTH;
	}
}

class BlendEquationMode {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get FuncAdd(): number {
		const gl = this._context;
		return gl.FUNC_ADD;
	}

	get FuncSubtract(): number {
		const gl = this._context;
		return gl.FUNC_SUBTRACT;
	}

	get FuncReverseSubtract(): number {
		const gl = this._context;
		return gl.FUNC_REVERSE_SUBTRACT;
	}

	/*
	get FuncMinExt(): number {
		const gl = this._context;
		return gl.MIN_EXT;
	}

	get FuncMaxExt(): number {
		const gl = this._context;
		return gl.MAX_EXT;
	}

	get FuncMin(): number {
		const gl = this._context;
		return gl.MIN;
	}

	get FuncMax(): number {
		const gl = this._context;
		return gl.MAX;
	}
	*/
}

class BlendFunc {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get Zero(): number {
		const gl = this._context;
		return gl.ZERO;
	}

	get One(): number {
		const gl = this._context;
		return gl.ONE;
	}

	get SrcColor(): number {
		const gl = this._context;
		return gl.SRC_COLOR;
	}

	get OneMinusSrcColor(): number {
		const gl = this._context;
		return gl.ONE_MINUS_SRC_COLOR;
	}

	get DstColor(): number {
		const gl = this._context;
		return gl.DST_COLOR;
	}

	get OneMinusDstColor(): number {
		const gl = this._context;
		return gl.ONE_MINUS_DST_COLOR;
	}

	get SrcAlpha(): number {
		const gl = this._context;
		return gl.SRC_ALPHA;
	}

	get OneMinusSrcAlpha(): number {
		const gl = this._context;
		return gl.ONE_MINUS_SRC_ALPHA;
	}

	get DstAlpha(): number {
		const gl = this._context;
		return gl.DST_ALPHA;
	}

	get OneMinusDstAlpha(): number {
		const gl = this._context;
		return gl.ONE_MINUS_DST_ALPHA;
	}

	get ConstantColor(): number {
		const gl = this._context;
		return gl.CONSTANT_COLOR;
	}

	get OneMinusConstantColor(): number {
		const gl = this._context;
		return gl.ONE_MINUS_CONSTANT_COLOR;
	}

	get ConstantAlpha(): number {
		const gl = this._context;
		return gl.CONSTANT_ALPHA;
	}

	get OneMinusConstantAlpha(): number {
		const gl = this._context;
		return gl.ONE_MINUS_CONSTANT_ALPHA;
	}

	get SrcAlphaSaturate(): number {
		const gl = this._context;
		return gl.SRC_ALPHA_SATURATE;
	}
}

class ClearMask {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get ColorBufferBit(): number {
		const gl = this._context;
		return gl.COLOR_BUFFER_BIT;
	}

	get DepthBufferBit(): number {
		const gl = this._context;
		return gl.DEPTH_BUFFER_BIT;
	}

	get StencilBufferBit(): number {
		const gl = this._context;
		return gl.STENCIL_BUFFER_BIT;
	}
}

class CullFaceMode {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get Front(): number {
		const gl = this._context;
		return gl.FRONT;
	}

	get Back(): number {
		const gl = this._context;
		return gl.BACK;
	}

	get FrontAndBack(): number {
		const gl = this._context;
		return gl.FRONT_AND_BACK;
	}
}

class TestFunc {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get Never(): number {
		const gl = this._context;
		return gl.NEVER;
	}

	get Less(): number {
		const gl = this._context;
		return gl.LESS;
	}

	get Equal(): number {
		const gl = this._context;
		return gl.EQUAL;
	}

	get LEqual(): number {
		const gl = this._context;
		return gl.LEQUAL;
	}

	get Greater(): number {
		const gl = this._context;
		return gl.GREATER;
	}

	get NotEqual(): number {
		const gl = this._context;
		return gl.NOTEQUAL;
	}

	get GEqual(): number {
		const gl = this._context;
		return gl.GEQUAL;
	}

	get Always(): number {
		const gl = this._context;
		return gl.ALWAYS;
	}
}

class WindingOrientation {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	/**
	 * Clock-wise winding.
	 * @readonly
	 */
	get CW(): number {
		const gl = this._context;
		return gl.CW;
	}

	/**
	 * Counter-clock-wise winding.
	 * @readonly
	 */
	get CCW(): number {
		const gl = this._context;
		return gl.CCW;
	}
}

class HintMode {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	/**
	 * The most efficient behavior should be used.
	 * @readonly
	 */
	get Fastest(): number {
		const gl = this._context;
		return gl.FASTEST;
	}

	/**
	 * The most correct or the highest quality option should be used.
	 * @readonly
	 */
	get Nicest(): number {
		const gl = this._context;
		return gl.NICEST;
	}

	/**
	 * There is no preference for this behavior.
	 * @readonly
	 */
	get DontCare(): number {
		const gl = this._context;
		return gl.DONT_CARE;
	}
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter
class ProgramParameter {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get DeleteStatus(): number {
		const gl = this._context;
		return gl.DELETE_STATUS;
	}

	get LinkStatus(): number {
		const gl = this._context;
		return gl.LINK_STATUS;
	}

	get ValidateStatus(): number {
		const gl = this._context;
		return gl.VALIDATE_STATUS;
	}

	get AttachedShaders(): number {
		const gl = this._context;
		return gl.ATTACHED_SHADERS;
	}

	get ActiveAttributes(): number {
		const gl = this._context;
		return gl.ACTIVE_ATTRIBUTES;
	}

	get ActiveUniforms(): number {
		const gl = this._context;
		return gl.ACTIVE_UNIFORMS;
	}
}

class RenderMode {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	/**
	 * Draws a single dot.
	 * @readonly
	 */
	get Points(): number {
		const gl = this._context;
		return gl.POINTS;
	}

	/**
	 * Draws a straight line to the next vertex.
	 * @readonly
	 */
	get LineStrip(): number {
		const gl = this._context;
		return gl.LINE_STRIP;
	}

	/**
	 * Draws a straight line to the next vertex,
	 * and connects the last vertex back to the first.
	 * @readonly
	 */
	get LineLoop(): number {
		const gl = this._context;
		return gl.LINE_LOOP;
	}

	/**
	 * Draws a line between a pair of vertices.
	 * @readonly
	 */
	get Lines(): number {
		const gl = this._context;
		return gl.LINES;
	}

	get TriangleStrip(): number {
		const gl = this._context;
		return gl.TRIANGLE_STRIP;
	}

	get TriangleFan(): number {
		const gl = this._context;
		return gl.TRIANGLE_FAN;
	}

	/**
	 * Draws a triangle for a group of three vertices.
	 * @readonly
	 */
	get Triangles(): number {
		const gl = this._context;
		return gl.TRIANGLES;
	}
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderParameter
class ShaderParameter {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get DeleteStatus(): number {
		const gl = this._context;
		return gl.DELETE_STATUS;
	}
}

class StencilOps {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get Keep(): number {
		const gl = this._context;
		return gl.KEEP;
	}

	get Zero(): number {
		const gl = this._context;
		return gl.ZERO;
	}

	get Replace(): number {
		const gl = this._context;
		return gl.REPLACE;
	}

	get Incr(): number {
		const gl = this._context;
		return gl.INCR;
	}

	get IncrWrap(): number {
		const gl = this._context;
		return gl.INCR_WRAP;
	}

	get Decr(): number {
		const gl = this._context;
		return gl.DECR;
	}

	get DecrWrap(): number {
		const gl = this._context;
		return gl.DECR_WRAP;
	}

	get Invert(): number {
		const gl = this._context;
		return gl.INVERT;
	}
}

class TextureNumber {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	Texture(n: number): number {
		const gl = this._context;
		return gl["TEXTURE" + n];
	}
}

class TextureTarget {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get Texture2D(): number {
		const gl = this._context;
		return gl.TEXTURE_2D;
	}

	get TextureCubeMap(): number {
		const gl = this._context;
		return gl.TEXTURE_CUBE_MAP;
	}

	get TextureCubeMapPositiveX(): number {
		const gl = this._context;
		return gl.TEXTURE_CUBE_MAP_POSITIVE_X;
	}

	get TextureCubeMapNegativeX(): number {
		const gl = this._context;
		return gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
	}

	get TextureCubeMapPositiveY(): number {
		const gl = this._context;
		return gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
	}

	get TextureCubeMapNegativeY(): number {
		const gl = this._context;
		return gl.TEXTURE_CUBE_MAP_NEGATIVE_Y;
	}

	get TextureCubeMapPositiveZ(): number {
		const gl = this._context;
		return gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
	}

	get TextureCubeMapNegativeZ(): number {
		const gl = this._context;
		return gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
	}
}

class TexturePName {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get TextureMagFilter(): number {
		const gl = this._context;
		return gl.TEXTURE_MAG_FILTER;
	}

	get TextureMinFilter(): number {
		const gl = this._context;
		return gl.TEXTURE_MIN_FILTER;
	}

	get TextureWrapS(): number {
		const gl = this._context;
		return gl.TEXTURE_WRAP_S;
	}

	get TextureWrapT(): number {
		const gl = this._context;
		return gl.TEXTURE_WRAP_T;
	}
}

class TextureParam {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get Linear(): number {
		const gl = this._context;
		return gl.LINEAR;
	}

	get Nearest(): number {
		const gl = this._context;
		return gl.NEAREST;
	}

	get NearestMipmapNearest(): number {
		const gl = this._context;
		return gl.NEAREST_MIPMAP_NEAREST;
	}

	get LinearMipmapNearest(): number {
		const gl = this._context;
		return gl.LINEAR_MIPMAP_NEAREST;
	}

	get NearestMipmapLinear(): number {
		const gl = this._context;
		return gl.NEAREST_MIPMAP_LINEAR;
	}

	get LinearMipmapLinear(): number {
		const gl = this._context;
		return gl.LINEAR_MIPMAP_LINEAR;
	}

	get Repeat(): number {
		const gl = this._context;
		return gl.REPEAT;
	}

	get ClampToEdge(): number {
		const gl = this._context;
		return gl.CLAMP_TO_EDGE;
	}

	get MirroredRepeat(): number {
		const gl = this._context;
		return gl.MIRRORED_REPEAT;
	}
}

class TextureFormat {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get Alpha(): number {
		const gl = this._context;
		return gl.ALPHA;
	}

	get RGB(): number {
		const gl = this._context;
		return gl.RGB;
	}

	get RGBA(): number {
		const gl = this._context;
		return gl.RGBA;
	}

	get Luminance(): number {
		const gl = this._context;
		return gl.LUMINANCE;
	}

	get LuminanceAlpha(): number {
		const gl = this._context;
		return gl.LUMINANCE_ALPHA;
	}

	/**
	 * When using the WEBGL_depth_texture extension.
	 * @readonly
	 */
	get DepthComponent(): number {
		const gl = this._context;
		return gl.DEPTH_COMPONENT;
	}

	/**
	 * When using the WEBGL_depth_texture extension.
	 * @readonly
	 */
	get DepthStencil(): number {
		const gl = this._context;
		return gl.DEPTH_STENCIL;
	}

	/**
	 * When using the EXT_sRGB extension.
	 * @readonly
	 *
	get SRGBExt(): number {
		const gl = this._context;
		return gl.SRGB_EXT;
	}
	*/

	/**
	 * When using the EXT_sRGB extension.
	 * @readonly
	 *
	get SRGBAlphaExt(): number {
		const gl = this._context;
		return gl.SRGB_ALPHA_EXT;
	}
	*/
}

class TextureType {
	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
	}

	get UnsignedByte(): number {
		const gl = this._context;
		return gl.UNSIGNED_BYTE;
	}

	get UnsignedShort565(): number {
		const gl = this._context;
		return gl.UNSIGNED_SHORT_5_6_5;
	}

	get UnsignedShort4444(): number {
		const gl = this._context;
		return gl.UNSIGNED_SHORT_4_4_4_4;
	}

	get UnsignedShort5551(): number {
		const gl = this._context;
		return gl.UNSIGNED_SHORT_5_5_5_1;
	}

	/**
	 * When using the WEBGL_depth_texture extension.
	 * @readonly
	 */
	get UnsignedShort(): number {
		const gl = this._context;
		return gl.UNSIGNED_SHORT;
	}

	/**
	 * When using the WEBGL_depth_texture extension.
	 * @readonly
	 */
	get UnsignedInt(): number {
		const gl = this._context;
		return gl.UNSIGNED_INT;
	}

	/**
	 * When using the WEBGL_depth_texture extension.
	 * @readonly
	 *
	get UnsignedInt24_8WebGL(): number {
		const gl = this._context;
		return gl.UNSIGNED_INT_24_8_WEBGL;
	}
	*/

	/**
	 * When using the OES_texture_float extension.
	 * @readonly
	 */
	get Float(): number {
		const gl = this._context;
		return gl.FLOAT;
	}

	/**
	 * When using the OES_texture_half_float extension.
	 * @readonly
	 *
	get HalfFloatOES(): number {
		const gl = this._context;
		return gl.HALF_FLOAT_OES;
	}
	*/
}

export class GLParameters {
	BlendEquationMode: BlendEquationMode;
	BlendFunc: BlendFunc;
	CullFaceModes: CullFaceMode;
	TestFuncs: TestFunc;
	WindingOrientation: WindingOrientation;
	HintMode: HintMode;
	StencilOps: StencilOps;
	TextureFormat: TextureFormat;
	TextureType: TextureType;

	protected _context: WebGLRenderingContext;

	constructor(context: WebGLRenderingContext) {
		this._context = context;
		this.BlendEquationMode = new BlendEquationMode(context);
		this.BlendFunc = new BlendFunc(context);
		this.CullFaceModes = new CullFaceMode(context);
		this.TestFuncs = new TestFunc(context);
		this.WindingOrientation = new WindingOrientation(context);
		this.HintMode = new HintMode(context);
		this.StencilOps = new StencilOps(context);
		this.TextureFormat = new TextureFormat(context);
		this.TextureType = new TextureType(context);
	}

	get activeTexture(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.ACTIVE_TEXTURE);
	}

	get aliasedLineWidthRange(): Float32Array {
		const gl = this._context;
		return gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE);
	}

	get aliasedPointSizeRange(): Float32Array {
		const gl = this._context;
		return gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
	}

	get alphaBits(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.ALPHA_BITS);
	}

	get arrayBufferBinding(): WebGLBuffer {
		const gl = this._context;
		return gl.getParameter(gl.ARRAY_BUFFER_BINDING);
	}

	get blend(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.BLEND);
	}

	get blendColor(): Float32Array {
		const gl = this._context;
		return gl.getParameter(gl.BLEND_COLOR);
	}

	get blendDstAlpha(): number {
		const gl = this._context;
		return gl.getParameter(gl.BLEND_DST_ALPHA);
	}

	get blendDstRGB(): number {
		const gl = this._context;
		return gl.getParameter(gl.BLEND_DST_RGB);
	}

	get blendEquation(): number {
		const gl = this._context;
		return gl.getParameter(gl.BLEND_EQUATION);
	}

	get blendEquationAlpha(): number {
		const gl = this._context;
		return gl.getParameter(gl.BLEND_EQUATION_ALPHA);
	}

	get blendEquationRGB(): number {
		const gl = this._context;
		return gl.getParameter(gl.BLEND_EQUATION_RGB);
	}

	get blendSrcAlpha(): number {
		const gl = this._context;
		return gl.getParameter(gl.BLEND_SRC_ALPHA);
	}

	get blendSrcRGB(): number {
		const gl = this._context;
		return gl.getParameter(gl.BLEND_SRC_RGB);
	}

	get blueBits(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.BLUE_BITS);
	}

	get colorClearValue(): Float32Array {
		const gl = this._context;
		return gl.getParameter(gl.COLOR_CLEAR_VALUE);
	}

	get colorWritemask(): Array<boolean> {
		const gl = this._context;
		return gl.getParameter(gl.COLOR_WRITEMASK);
	}

	get compressedTextureFormats(): Uint32Array {
		const gl = this._context;
		return gl.getParameter(gl.COMPRESSED_TEXTURE_FORMATS);
	}

	get cullFace(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.CULL_FACE);
	}

	get cullFaceMode(): number {
		const gl = this._context;
		return gl.getParameter(gl.CULL_FACE_MODE);
	}

	get currentProgram(): WebGLProgram {
		const gl = this._context;
		return gl.getParameter(gl.CURRENT_PROGRAM);
	}

	get depthBits(): number {
		const gl = this._context;
		return gl.getParameter(gl.DEPTH_BITS);
	}

	get depthClearValue(): number {
		const gl = this._context;
		return gl.getParameter(gl.DEPTH_CLEAR_VALUE);
	}

	get depthFunc(): number {
		const gl = this._context;
		return gl.getParameter(gl.DEPTH_FUNC);
	}

	get depthRange(): Float32Array {
		const gl = this._context;
		return gl.getParameter(gl.DEPTH_RANGE);
	}

	get depthTest(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.DEPTH_TEST);
	}

	get depthWritemask(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.DEPTH_WRITEMASK);
	}

	get dither(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.DITHER);
	}

	get elementArrayBufferBinding(): WebGLBuffer {
		const gl = this._context;
		return gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
	}

	get framebufferBinding(): WebGLFramebuffer | null {
		const gl = this._context;
		return gl.getParameter(gl.FRAMEBUFFER_BINDING);
	}

	get frontFace(): number {
		const gl = this._context;
		return gl.getParameter(gl.FRONT_FACE);
	}

	get generateMipmapHint(): number {
		const gl = this._context;
		return gl.getParameter(gl.GENERATE_MIPMAP_HINT);
	}

	get greenBits(): number {
		const gl = this._context;
		return gl.getParameter(gl.GREEN_BITS);
	}

	get implementationColorReadFormat(): number {
		const gl = this._context;
		return gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT);
	}

	get implementationColorReadType(): number {
		const gl = this._context;
		return gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE);
	}

	get lineWidth(): number {
		const gl = this._context;
		return gl.getParameter(gl.LINE_WIDTH);
	}

	get maxCombinedTextureImageUnits(): number {
		const gl = this._context;
		return gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
	}

	get maxCubeMapTextureSize(): number {
		const gl = this._context;
		return gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
	}

	get maxFragmentUniformVectors(): number {
		const gl = this._context;
		return gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
	}

	get maxRenderbufferSize(): number {
		const gl = this._context;
		return gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
	}

	get maxTextureImageUnits(): number {
		const gl = this._context;
		return gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
	}

	get maxTextureSize(): number {
		const gl = this._context;
		return gl.getParameter(gl.MAX_TEXTURE_SIZE);
	}

	get maxVaryingVectors(): number {
		const gl = this._context;
		return gl.getParameter(gl.MAX_VARYING_VECTORS);
	}

	get maxVertexAttribs(): number {
		const gl = this._context;
		return gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
	}

	get maxVertexTextureImageUnits(): number {
		const gl = this._context;
		return gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
	}

	get maxVertexUniformVectors(): number {
		const gl = this._context;
		return gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
	}

	get maxViewportDims(): Int32Array {
		const gl = this._context;
		return gl.getParameter(gl.MAX_VIEWPORT_DIMS);
	}

	get packAlignment(): number {
		const gl = this._context;
		return gl.getParameter(gl.PACK_ALIGNMENT);
	}

	get polygonOffsetFactor(): number {
		const gl = this._context;
		return gl.getParameter(gl.POLYGON_OFFSET_FACTOR);
	}

	get polygonOffsetFill(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.POLYGON_OFFSET_FILL);
	}

	get polygonOffsetUnits(): number {
		const gl = this._context;
		return gl.getParameter(gl.POLYGON_OFFSET_UNITS);
	}

	get redBits(): number {
		const gl = this._context;
		return gl.getParameter(gl.RED_BITS);
	}

	get renderbufferBinding(): WebGLRenderbuffer | null {
		const gl = this._context;
		return gl.getParameter(gl.RENDERBUFFER_BINDING);
	}

	get renderer(): string {
		const gl = this._context;
		return gl.getParameter(gl.RENDERER);
	}

	get sampleBuffers(): number {
		const gl = this._context;
		return gl.getParameter(gl.SAMPLE_BUFFERS);
	}

	get sampleCoverageInvert(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.SAMPLE_COVERAGE_INVERT);
	}

	get sampleCoverageValue(): number {
		const gl = this._context;
		return gl.getParameter(gl.SAMPLE_COVERAGE_VALUE);
	}

	get samples(): number {
		const gl = this._context;
		return gl.getParameter(gl.SAMPLES);
	}

	get scissorBox(): Int32Array {
		const gl = this._context;
		return gl.getParameter(gl.SCISSOR_BOX);
	}

	get scissorTest(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.SCISSOR_TEST);
	}

	get shadingLanguageVersion(): string {
		const gl = this._context;
		return gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
	}

	get stencilBackFail(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_BACK_FAIL);
	}

	get stencilBackFunc(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_BACK_FUNC);
	}

	get stencilBackPassDepthFail(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_BACK_PASS_DEPTH_FAIL);
	}

	get stencilBackPassDepthPass(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_BACK_PASS_DEPTH_PASS);
	}

	get stencilBackRef(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_BACK_REF);
	}

	get stencilBackValueMask(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_BACK_VALUE_MASK);
	}

	get stencilBackWritemask(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_BACK_WRITEMASK);
	}

	get stencilBits(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_BITS);
	}

	get stencilClearValue(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_CLEAR_VALUE);
	}

	get stencilFail(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_FAIL);
	}

	get stencilFunc(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_FUNC);
	}

	get stencilPassDepthFail(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_PASS_DEPTH_FAIL);
	}

	get stencilPassDepthPass(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_PASS_DEPTH_PASS);
	}

	get stencilRef(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_REF);
	}

	get stencilTest(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_TEST);
	}

	get stencilValueMask(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_VALUE_MASK);
	}

	get stencilWritemask(): number {
		const gl = this._context;
		return gl.getParameter(gl.STENCIL_WRITEMASK);
	}

	get subpixelBits(): number {
		const gl = this._context;
		return gl.getParameter(gl.SUBPIXEL_BITS);
	}

	get textureBinding2D(): WebGLTexture | null {
		const gl = this._context;
		return gl.getParameter(gl.TEXTURE_BINDING_2D);
	}

	get textureBindingCubeMap(): WebGLTexture | null {
		const gl = this._context;
		return gl.getParameter(gl.TEXTURE_BINDING_CUBE_MAP);
	}

	get unpackAlignment(): number {
		const gl = this._context;
		return gl.getParameter(gl.UNPACK_ALIGNMENT);
	}

	get unpackColorspaceConversionWebGL(): number {
		const gl = this._context;
		return gl.getParameter(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL);
	}

	get unpackFlipYWebGL(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.UNPACK_FLIP_Y_WEBGL);
	}

	get unpackPremultiplyAlphaWebGL(): boolean {
		const gl = this._context;
		return gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
	}

	get vendor(): string {
		const gl = this._context;
		return gl.getParameter(gl.VENDOR);
	}

	get version(): string {
		const gl = this._context;
		return gl.getParameter(gl.VERSION);
	}

	get viewport(): Int32Array {
		const gl = this._context;
		return gl.getParameter(gl.VIEWPORT);
	}

	toString(): string {
		return JSON.stringify(this);
	}
}
