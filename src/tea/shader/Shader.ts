import * as Tea from "../Tea";

const defaultVertexShaderSource = `
	attribute vec4 vertex;
	attribute vec3 normal;
	attribute vec2 texcoord;
	attribute vec4 color;
	uniform mat4 TEA_MATRIX_MVP;
	//uniform mat4 invMatrix;
	uniform vec3 lightDirection;
	uniform vec3 eyeDirection;
	uniform vec3 ambientColor;
	varying vec2 vTexCoord;
	varying vec4 vColor;

	void main() {
		vec3 mvpNormal = normalize(TEA_MATRIX_MVP * vec4(normal, 0.0)).xyz;
		vec3 diffuse = vec3(max(0.0, dot(mvpNormal, lightDirection)));
		vec3 halfLE = normalize(eyeDirection + lightDirection);
		vec3 specular = vec3(5.0 * pow(max(0.0, dot(reflect(lightDirection, mvpNormal), eyeDirection)), 5.5));
		vec4 light = vec4(ambientColor + diffuse + specular, 1.0);
		//vec4 light = vec4(ambientColor + specular, 1.0);
		vColor = light;
		vTexCoord = texcoord;
		gl_Position = TEA_MATRIX_MVP * vertex;
	}
`;

const defaultFragmentShaderSource = `
	precision mediump float;
	uniform vec4 _Color;
	uniform sampler2D _MainTex;
	uniform int TEA_CAMERA_STEREO;
	uniform vec2 uv_MainTex;
	uniform vec2 _MainTex_ST;
	uniform bool useColor;
	varying vec2 vTexCoord;
	varying vec4 vColor;

	void main() {
		if (TEA_CAMERA_STEREO != 0) {
			float stereoMod = float(TEA_CAMERA_STEREO - 1);
			if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
				discard;
			}
		}
		vec4 tex = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
		if (useColor) {
			gl_FragColor = tex * _Color * vColor;
		} else {
			gl_FragColor = tex * vColor;
		}
		//gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
`;

const lineVertexShaderSource = `
	attribute vec4 tea_Vertex;
	uniform mat4 TEA_MATRIX_MVP;
	void main() {
		gl_Position = TEA_MATRIX_MVP * tea_Vertex;
	}
`;

const lineFragmentShaderSource = `
	precision mediump float;
	uniform int TEA_CAMERA_STEREO;
	uniform vec4 _Color;
	void main() {
		if (TEA_CAMERA_STEREO != 0) {
			float stereoMod = float(TEA_CAMERA_STEREO - 1);
			if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
				discard;
			}
		}
		gl_FragColor = _Color;
	}
`;

const textVertexShaderSource = `
	attribute vec3 vertex;
	attribute vec2 texcoord;
	uniform mat4 TEA_MATRIX_MVP;
	varying vec2 vTexCoord;
	void main() {
		vTexCoord = texcoord;
		gl_Position = TEA_MATRIX_MVP * vec4(vertex, 1.0);
	}
`;

const textFragmentShaderSource = `
	precision mediump float;
	uniform sampler2D _MainTex;
	uniform int TEA_CAMERA_STEREO;
	uniform vec2 uv_MainTex;
	uniform vec2 _MainTex_ST;
	varying vec2 vTexCoord;
	void main() {
		if (TEA_CAMERA_STEREO != 0) {
			float stereoMod = float(TEA_CAMERA_STEREO - 1);
			if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
				discard;
			}
		}
		vec4 color = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
		if (color.a < 0.1) {
			discard;
		}
		gl_FragColor = color;
	}
`;

export class Shader {
	app: Tea.App;
	program: WebGLProgram;
	vertexShader: WebGLShader;
	fragmentShader: WebGLShader;
	settings: Tea.ShaderSettings;

	constructor(app: Tea.App) {
		this.app = app;
		var gl = this.app.gl;
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

	static get defaultVertexShaderSource(): string {
		return defaultVertexShaderSource;
	}

	static get defaultFragmentShaderSource(): string {
		return defaultFragmentShaderSource;
	}

	static get lineVertexShaderSource(): string {
		return lineVertexShaderSource;
	}

	static get lineFragmentShaderSource(): string {
		return lineFragmentShaderSource;
	}

	static get textVertexShaderSource(): string {
		return textVertexShaderSource;
	}

	static get textFragmentShaderSource(): string {
		return textFragmentShaderSource;
	}

	propertyToID(name: string): number {
		var gl = this.app.gl;
		var location = gl.getUniformLocation(this.program, name);
		return location as number;
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
	}

	attach(vsSource: string, fsSource: string): void {
		var gl = this.app.gl;
		this.compile(this.vertexShader, vsSource);
		this.compile(this.fragmentShader, fsSource);
		this.link(this.program, this.vertexShader, this.fragmentShader);
		gl.useProgram(this.program);
	}

	protected compile(shader: WebGLShader, source: string): void {
		var gl = this.app.gl;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(shader));
		}
	}

	protected link(program: WebGLProgram, vs: WebGLShader, fs: WebGLShader): void {
		var gl = this.app.gl;
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error(gl.getProgramInfoLog(program));
		}
	}
}
