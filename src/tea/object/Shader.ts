import * as Tea from "../Tea";

const defaultVertexShaderSource = `
	attribute vec3 position;
	attribute vec3 normal;
	attribute vec2 texCoord;
	attribute vec4 color;
	uniform mat4 mvpMatrix;
	uniform mat4 invMatrix;
	uniform vec3 lightDirection;
	uniform vec4 ambientColor;
	varying vec2 vTexCoord;
	varying vec4 vColor;
	varying vec4 vDiffuse;

	void main() {
		vec3 mvpNormal = normalize(mvpMatrix * vec4(normal, 0.0)).xyz;
		float diffuse = clamp(dot(mvpNormal, lightDirection), 0.0, 1.0);
		//float diffuse = dot(normal, invLight);
		vTexCoord = texCoord;
		vColor = color;
		vDiffuse = vec4(vec3(diffuse), 1.0) + ambientColor;
		//vDiffuse = vec4(vec3(diffuse), 1.0);
		gl_Position = mvpMatrix * vec4(position, 1.0);
	}
`;

const defaultFragmentShaderSource = `
	precision mediump float;
	uniform sampler2D texture;
	uniform bool useColor;
	varying vec2 vTexCoord;
	varying vec4 vColor;
	varying vec4 vDiffuse;

	void main() {
		vec4 tex = texture2D(texture, vTexCoord);
		if (useColor) {
			gl_FragColor = tex * vDiffuse * vColor;
		} else {
			gl_FragColor = tex * vDiffuse;
		}
		//gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
`;

const lineVertexShaderSource = `
	attribute vec3 position;
	uniform mat4 mvpMatrix;
	void main() {
		gl_Position = mvpMatrix * vec4(position, 1.0);
	}
`;

const lineFragmentShaderSource = `
	precision mediump float;
	uniform vec4 color;
	void main() {
		gl_FragColor = color;
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

	protected locationsCache: object;
	protected emptyTexture: Tea.Texture;
	protected _texture: Tea.Texture;

	constructor(app: Tea.App) {
		this.app = app;
		const gl = this.app.gl;
		this.program = gl.createProgram();
		this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
		this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

		this.locationsCache = {};
		this.emptyTexture = new Tea.Texture(app);
		const imageData = new ImageData(1, 1);
		this.emptyTexture.image = imageData;
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

	get texture(): Tea.Texture {
		if (this._texture == null) {
			return this.emptyTexture;
		}
		return this._texture;
	}
	set texture(value: Tea.Texture) {
		this._texture = value;
	}

	propertyToID(name: string): number {
		return this.getAttribLocation(name);
	}

	remove(): void {
		const gl = this.app.gl;
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
		if (this.emptyTexture != null) {
			this.emptyTexture.remove();
			this.emptyTexture = null;
		}
		this.locationsCache = {};
	}

	attach(vsSource: string, fsSource: string): void {
		const gl = this.app.gl;
		this.compile(this.vertexShader, vsSource);
		this.compile(this.fragmentShader, fsSource);
		this.link(this.program, this.vertexShader, this.fragmentShader);
		gl.useProgram(this.program);
	}

	setAttribute(name: string, size: number): void {
		const gl = this.app.gl;
		const location = this.getAttribLocation(name);
		if (location < 0) {
			return;
		}
		gl.enableVertexAttribArray(location);
		gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
	}

	disableVertexAttrib(name: string): void {
		const gl = this.app.gl;
		const location = this.getAttribLocation(name);
		//console.log("location", location);
		if (0 <= location) {
			gl.disableVertexAttribArray(location);
		}
	}

	uniform1i(name: string, value: number): void {
		const gl = this.app.gl;
		gl.useProgram(this.program);
		const location = this.getUniformLocation(name);
		gl.uniform1i(location, value);
	}

	uniform1f(name: string, value: number): void {
		const gl = this.app.gl;
		gl.useProgram(this.program);
		const location = this.getUniformLocation(name);
		gl.uniform1f(location, value);
	}

	uniform3fv(name: string, value: Float32Array | ArrayLike<number>): void {
		const gl = this.app.gl;
		gl.useProgram(this.program);
		const location = this.getUniformLocation(name);
		gl.uniform3fv(location, value);
	}

	uniform4fv(name: string, value: Float32Array | ArrayLike<number>): void {
		const gl = this.app.gl;
		gl.useProgram(this.program);
		const location = this.getUniformLocation(name);
		gl.uniform4fv(location, value);
	}

	uniformMatrix4fv(name: string, value: Float32Array | ArrayLike<number>): void {
		const gl = this.app.gl;
		gl.useProgram(this.program);
		const location = this.getUniformLocation(name);
		gl.uniformMatrix4fv(location, false, value);
	}

	protected getAttribLocation(name: string): number {
		const gl = this.app.gl;
		let location = null;
		if (this.locationsCache[name]) {
			location = this.locationsCache[name];
		} else {
			location = gl.getAttribLocation(this.program, name);
			this.locationsCache[name] = location;
		}
		return location;
	}

	protected getUniformLocation(name: string): WebGLUniformLocation {
		const gl = this.app.gl;
		let location = null;
		if (this.locationsCache[name]) {
			location = this.locationsCache[name];
		} else {
			location = gl.getUniformLocation(this.program, name);
			this.locationsCache[name] = location;
		}
		return location;
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
