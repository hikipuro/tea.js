import * as Tea from "../Tea";
import { ShaderSources } from "./ShaderSources";

export class Shader {
	app: Tea.App;
	program: WebGLProgram;
	vertexShader: WebGLShader;
	fragmentShader: WebGLShader;
	settings: Tea.ShaderSettings;
	protected gl: WebGLRenderingContext;
	protected _locationsCache: object;
	protected _attribLocationsCache: object;

	constructor(app: Tea.App) {
		this.app = app;
		this.gl = app.gl;
		this._locationsCache = {};
		this._attribLocationsCache = {};
		var gl = this.gl;
		this.program = gl.createProgram();
		this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
		this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		this.settings = new Tea.ShaderSettings();
	}

	static getBlendEquationValue(gl: WebGLRenderingContext, value: Tea.ShaderBlendEquation): number {
		switch (value) {
			case Tea.ShaderBlendEquation.Add:
				return gl.FUNC_ADD;
			case Tea.ShaderBlendEquation.Subtract:
				return gl.FUNC_SUBTRACT;
			case Tea.ShaderBlendEquation.ReverseSubtract:
				return gl.FUNC_REVERSE_SUBTRACT;
		}
		return gl.FUNC_ADD;
	}

	static getBlendFuncValue(gl: WebGLRenderingContext, value: Tea.ShaderBlendFunc): number {
		switch (value) {
			case Tea.ShaderBlendFunc.Zero:
				return gl.ZERO;
			case Tea.ShaderBlendFunc.One:
				return gl.ONE;
			case Tea.ShaderBlendFunc.SrcColor:
				return gl.SRC_COLOR;
			case Tea.ShaderBlendFunc.OneMinusSrcColor:
				return gl.ONE_MINUS_SRC_COLOR;
			case Tea.ShaderBlendFunc.DstColor:
				return gl.DST_COLOR;
			case Tea.ShaderBlendFunc.OneMinusDstColor:
				return gl.ONE_MINUS_DST_COLOR;
			case Tea.ShaderBlendFunc.SrcAlpha:
				return gl.SRC_ALPHA;
			case Tea.ShaderBlendFunc.OneMinusSrcAlpha:
				return gl.ONE_MINUS_SRC_ALPHA;
			case Tea.ShaderBlendFunc.DstAlpha:
				return gl.DST_ALPHA;
			case Tea.ShaderBlendFunc.OneMinusDstAlpha:
				return gl.ONE_MINUS_DST_ALPHA;
			case Tea.ShaderBlendFunc.ConstantColor:
				return gl.CONSTANT_COLOR;
			case Tea.ShaderBlendFunc.OneMinusConstantColor:
				return gl.ONE_MINUS_CONSTANT_COLOR;
			case Tea.ShaderBlendFunc.ConstantAlpha:
				return gl.CONSTANT_ALPHA;
			case Tea.ShaderBlendFunc.OneMinusConstantAlpha:
				return gl.ONE_MINUS_CONSTANT_ALPHA;
			case Tea.ShaderBlendFunc.SrcAlphaSaturate:
				return gl.SRC_ALPHA_SATURATE;
		}
		return gl.ZERO;
	}

	static getTestFuncValue(gl: WebGLRenderingContext, value: Tea.ShaderTestFunc): number {
		switch (value) {
			case Tea.ShaderTestFunc.Never:
				return gl.NEVER;
			case Tea.ShaderTestFunc.Less:
				return gl.LESS;
			case Tea.ShaderTestFunc.Equal:
				return gl.EQUAL;
			case Tea.ShaderTestFunc.LEqual:
				return gl.LEQUAL;
			case Tea.ShaderTestFunc.Greater:
				return gl.GREATER;
			case Tea.ShaderTestFunc.NotEqual:
				return gl.NOTEQUAL;
			case Tea.ShaderTestFunc.GEqual:
				return gl.GEQUAL;
			case Tea.ShaderTestFunc.Always:
				return gl.ALWAYS;
		}
		return gl.NEVER;
	}

	static getFaceValue(gl: WebGLRenderingContext, value: Tea.ShaderFace): number {
		switch (value) {
			case Tea.ShaderFace.Front:
				return gl.FRONT;
			case Tea.ShaderFace.Back:
				return gl.BACK;
			case Tea.ShaderFace.FrontAndBack:
				return gl.FRONT_AND_BACK;
		}
		return gl.BACK;
	}

	static getHintValue(gl: WebGLRenderingContext, value: Tea.ShaderHint): number {
		switch (value) {
			case Tea.ShaderHint.DontCare:
				return gl.DONT_CARE;
			case Tea.ShaderHint.Fastest:
				return gl.FASTEST;
			case Tea.ShaderHint.Nicest:
				return gl.NICEST;
		}
		return gl.DONT_CARE;
	}

	static getStencilOpValue(gl: WebGLRenderingContext, value: Tea.ShaderStencilOp): number {
		switch (value) {
			case Tea.ShaderStencilOp.Zero:
				return gl.ZERO;
			case Tea.ShaderStencilOp.Keep:
				return gl.KEEP;
			case Tea.ShaderStencilOp.Replace:
				return gl.REPLACE;
			case Tea.ShaderStencilOp.Incr:
				return gl.INCR;
			case Tea.ShaderStencilOp.IncrWrap:
				return gl.INCR_WRAP;
			case Tea.ShaderStencilOp.Decr:
				return gl.DECR;
			case Tea.ShaderStencilOp.DecrWrap:
				return gl.DECR_WRAP;
			case Tea.ShaderStencilOp.Invert:
				return gl.INVERT;
		}
		return gl.ZERO;
	}

	propertyToID(name: string): WebGLUniformLocation {
		var cache = this._locationsCache[name];
		if (cache !== undefined) {
			return cache;
		}
		var gl = this.gl;
		var location = gl.getUniformLocation(this.program, name);
		//if (location == null) {
		//	location = -1;
		//}
		this._locationsCache[name] = location;
		return location;
	}

	getAttribLocation(name: string): number {
		var cache = this._attribLocationsCache[name];
		if (cache !== undefined) {
			return cache;
		}
		var gl = this.gl;
		var location = gl.getAttribLocation(this.program, name);
		if (location == null) {
			location = -1;
		}
		this._attribLocationsCache[name] = location;
		return location;
	}

	remove(): void {
		var gl = this.app.gl;
		if (this.program != null) {
			gl.detachShader(this.program, this.vertexShader);
			gl.detachShader(this.program, this.vertexShader);
			gl.deleteProgram(this.program);
			this.program = null;
		}
		if (this.vertexShader != null) {
			gl.deleteShader(this.vertexShader);
			this.vertexShader = null;
		}
		if (this.fragmentShader != null) {
			gl.deleteShader(this.fragmentShader);
			this.fragmentShader = null;
		}
		this._locationsCache = {};
		this._attribLocationsCache = {};
	}

	attach(vsSource: string, fsSource: string): void {
		//var gl = this.gl;
		this.compile(this.vertexShader, vsSource);
		this.compile(this.fragmentShader, fsSource);
		this.link(this.program, this.vertexShader, this.fragmentShader);
		this._locationsCache = {};
		this._attribLocationsCache = {};
		//gl.useProgram(this.program);
	}

	toJSON(): Object {
		var json = {
			_type: "Shader"
		};
		return json;
	}

	protected compile(shader: WebGLShader, source: string): void {
		var gl = this.gl;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(shader));
		}
	}

	protected link(program: WebGLProgram, vs: WebGLShader, fs: WebGLShader): void {
		var gl = this.gl;
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error(gl.getProgramInfoLog(program));
		}
	}
}
