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
	uniform vec2 uv_MainTex;
	uniform vec2 _MainTex_ST;
	uniform bool useColor;
	varying vec2 vTexCoord;
	varying vec4 vColor;

	void main() {
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
	uniform vec4 _Color;
	void main() {
		gl_FragColor = _Color;
	}
`;

const textVertexShaderSource = `
	attribute vec3 position;
	attribute vec2 texCoord;
	uniform mat4 mvpMatrix;
	varying vec2 vTexCoord;
	void main() {
		vTexCoord = texCoord;
		gl_Position = mvpMatrix * vec4(position, 1.0);
	}
`;

const textFragmentShaderSource = `
	precision mediump float;
	uniform sampler2D texture;
	varying vec2 vTexCoord;
	void main() {
		vec4 color = texture2D(texture, vTexCoord);
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

	constructor(app: Tea.App) {
		this.app = app;
		const gl = this.app.gl;
		this.program = gl.createProgram();
		this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
		this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
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
		const gl = this.app.gl;
		this.compile(this.vertexShader, vsSource);
		this.compile(this.fragmentShader, fsSource);
		this.link(this.program, this.vertexShader, this.fragmentShader);
		gl.useProgram(this.program);
	}

	protected compile(shader: WebGLShader, source: string): void {
		const gl = this.app.gl;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(shader));
		}
	}

	protected link(program: WebGLProgram, vs: WebGLShader, fs: WebGLShader): void {
		const gl = this.app.gl;
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error(gl.getProgramInfoLog(program));
		}
	}
}
