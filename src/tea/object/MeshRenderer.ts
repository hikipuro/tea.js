import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class MeshRenderer extends Renderer {
	protected _mesh: Tea.Mesh;

	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	normalBuffer: WebGLBuffer;
	uvBuffer: WebGLBuffer;
	colorBuffer: WebGLBuffer;

	wireframe: boolean = false;
	protected _vertexCount: number = 0;
	protected _triangleCount: number = 0;

	constructor(app: Tea.App) {
		super(app);
		this.app = app;
		this.createBuffers();
	}

	get mesh(): Tea.Mesh {
		return this._mesh;
	}
	set mesh(value: Tea.Mesh) {
		this._mesh = value;
	}

	remove(): void {
		this.deleteBuffers();
	}

	render(camera: Tea.Camera): void {
		if (this.enabled === false || camera == null) {
			return;
		}
		if (this.isRenderable === false) {
			return;
		}
		super.render(camera);
		if (this.mesh.hasColors) {
			this._uniforms.uniform1i("useColor", 1);
		} else {
			this._uniforms.uniform1i("useColor", 0);
		}
		this.setMeshData(this.mesh);
		this.setVertexBuffer(this.mesh);
		this.setIndexBuffer(this.mesh);
		this.draw(this.mesh);
	}

	protected get isRenderable(): boolean {
		return (
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null &&
			this.mesh != null
		);
	}

	protected createBuffers(): void {
		const gl = this.app.gl;
		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
		this.normalBuffer = gl.createBuffer();
		this.uvBuffer = gl.createBuffer();
		this.colorBuffer = gl.createBuffer();
	}

	protected deleteBuffers(): void {
		const gl = this.app.gl;
		if (this.vertexBuffer != null) {
			gl.deleteBuffer(this.vertexBuffer);
			this.vertexBuffer = null;
		}
		if (this.indexBuffer != null) {
			gl.deleteBuffer(this.indexBuffer);
			this.indexBuffer = null;
		}
		if (this.normalBuffer != null) {
			gl.deleteBuffer(this.normalBuffer);
			this.normalBuffer = null;
		}
		if (this.uvBuffer != null) {
			gl.deleteBuffer(this.uvBuffer);
			this.uvBuffer = null;
		}
		if (this.colorBuffer != null) {
			gl.deleteBuffer(this.colorBuffer);
			this.colorBuffer = null;
		}
	}

	protected setMeshData(mesh: Tea.Mesh): void {
		if (mesh.isModified === false) {
			return;
		}

		const gl = this.app.gl;
		gl.useProgram(this.material.shader.program);
		let target = gl.ARRAY_BUFFER;

		const vertices = new Float32Array(Tea.ArrayUtil.unroll(mesh.vertices));
		this._vertexCount = vertices.length;
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, vertices, gl.STATIC_DRAW);

		if (mesh.hasNormals) {
			const normals = new Float32Array(Tea.ArrayUtil.unroll(mesh.normals));
			gl.bindBuffer(target, this.normalBuffer);
			gl.bufferData(target, normals, gl.STATIC_DRAW);
		}

		if (mesh.hasUVs) {
			const uv = new Float32Array(Tea.ArrayUtil.unroll(mesh.uv));
			gl.bindBuffer(target, this.uvBuffer);
			gl.bufferData(target, uv, gl.STATIC_DRAW);
		}

		if (mesh.hasColors) {
			const colors = new Float32Array(Tea.ArrayUtil.unroll(mesh.colors));
			gl.bindBuffer(target, this.colorBuffer);
			gl.bufferData(target, colors, gl.STATIC_DRAW);
		}
		gl.bindBuffer(target, null);

		if (mesh.hasTriangles) {
			target = gl.ELEMENT_ARRAY_BUFFER;
			const triangles = new Uint16Array(Tea.ArrayUtil.unroll(mesh.triangles));
			this._triangleCount = triangles.length;
			gl.bindBuffer(target, this.indexBuffer);
			gl.bufferData(target, triangles, gl.STATIC_DRAW);
			gl.bindBuffer(target, null);
		}

		mesh.isModified = false;
	}

	protected setVertexBuffer(mesh: Tea.Mesh): void {
		var gl = this.app.gl;
		var target = gl.ARRAY_BUFFER;
		gl.bindBuffer(target, this.vertexBuffer);
		this.setAttribute("vertex", 3);

		gl.bindBuffer(target, this.normalBuffer);
		if (mesh.hasNormals) {
			this.setAttribute("normal", 3);
		} else {
			this.disableVertexAttrib("normal");
		}

		gl.bindBuffer(target, this.uvBuffer);
		if (mesh.hasUVs) {
			this.setAttribute("texcoord", 2);
		} else {
			this.disableVertexAttrib("texcoord");
		}

		gl.bindBuffer(target, this.colorBuffer);
		if (mesh.hasColors) {
			this.setAttribute("color", 4);
		} else {
			this.disableVertexAttrib("color");
		}
		gl.bindBuffer(target, null);
	}

	protected setIndexBuffer(mesh: Tea.Mesh): void {
		const gl = this.app.gl;
		const target = gl.ELEMENT_ARRAY_BUFFER;
		if (mesh.hasTriangles) {
			gl.bindBuffer(target, this.indexBuffer);
		} else {
			gl.bindBuffer(target, null);
		}
	}

	protected draw(mesh: Tea.Mesh): void {
		const gl = this.app.gl;
		if (mesh.hasTriangles === false) {
			const count = this._vertexCount;
			if (this.wireframe) {
				gl.drawArrays(gl.LINE_LOOP, 0, count);
				return;
			}
			//gl.drawArrays(gl.POINTS, 0, count);
			//gl.drawArrays(gl.LINE_LOOP, 0, count);
			gl.drawArrays(gl.TRIANGLES, 0, count);
			//gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
			return;
		}

		const scale = this.object3d.scale;
		if (scale.x * scale.y * scale.z < 0) {
			gl.frontFace(gl.CW);
		} else {
			gl.frontFace(gl.CCW);
		}

		if (this.wireframe) {
			const count = this._triangleCount;
			gl.drawElements(gl.LINE_STRIP, count, gl.UNSIGNED_SHORT, 0);
			return;
		}
		
		if (this._mesh instanceof Tea.TextMesh) {
			//gl.disable(gl.DEPTH_TEST);
			gl.enable(gl.BLEND);
			//gl.blendEquation(gl.FUNC_ADD);
			gl.blendFuncSeparate(
				gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA,
				gl.ONE, gl.ONE
			);
		} else {
			//gl.enable(gl.DEPTH_TEST);
			gl.disable(gl.BLEND);
		}

		const count = this._triangleCount;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
	}
}
