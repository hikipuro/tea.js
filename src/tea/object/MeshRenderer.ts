import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class MeshRenderer extends Renderer {
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	normalBuffer: WebGLBuffer;
	uvBuffer: WebGLBuffer;
	colorBuffer: WebGLBuffer;

	wireframe: boolean = false;

	constructor(app: Tea.App) {
		super(app);
		this.createBuffers();
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
		var component = this.object3d.getComponent(Tea.MeshFilter);
		var mesh = component.mesh;
		if (mesh.hasColors) {
			this._uniforms.uniform1i("useColor", 1);
		} else {
			this._uniforms.uniform1i("useColor", 0);
		}
		this.setMeshData(mesh);
		this.setVertexBuffer(mesh);
		this.setIndexBuffer(mesh);
		this.setFrontFace();
		this.draw(mesh);
	}

	protected get isRenderable(): boolean {
		return (
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null
		);
	}

	protected createBuffers(): void {
		var gl = this.app.gl;
		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
		this.normalBuffer = gl.createBuffer();
		this.uvBuffer = gl.createBuffer();
		this.colorBuffer = gl.createBuffer();
	}

	protected deleteBuffers(): void {
		var gl = this.app.gl;
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

		var gl = this.app.gl;
		gl.useProgram(this.material.shader.program);
		var target = gl.ARRAY_BUFFER;

		var vertices = new Float32Array(Tea.ArrayUtil.unroll(mesh.vertices));
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, vertices, gl.STATIC_DRAW);

		if (mesh.hasNormals) {
			var normals = new Float32Array(Tea.ArrayUtil.unroll(mesh.normals));
			gl.bindBuffer(target, this.normalBuffer);
			gl.bufferData(target, normals, gl.STATIC_DRAW);
		}

		if (mesh.hasUVs) {
			var uv = new Float32Array(Tea.ArrayUtil.unroll(mesh.uv));
			gl.bindBuffer(target, this.uvBuffer);
			gl.bufferData(target, uv, gl.STATIC_DRAW);
		}

		if (mesh.hasColors) {
			var colors = new Float32Array(Tea.ArrayUtil.unroll(mesh.colors));
			gl.bindBuffer(target, this.colorBuffer);
			gl.bufferData(target, colors, gl.STATIC_DRAW);
		}
		gl.bindBuffer(target, null);

		if (mesh.hasTriangles) {
			target = gl.ELEMENT_ARRAY_BUFFER;
			var triangles = new Uint16Array(Tea.ArrayUtil.unroll(mesh.triangles));
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
		if (mesh.hasNormals && mesh.hasTriangles) {
			this.setAttribute("normal", 3);
		} else {
			this.disableVertexAttrib("normal");
		}

		gl.bindBuffer(target, this.uvBuffer);
		if (mesh.hasUVs && mesh.hasTriangles) {
			this.setAttribute("texcoord", 2);
		} else {
			this.disableVertexAttrib("texcoord");
		}

		gl.bindBuffer(target, this.colorBuffer);
		if (mesh.hasColors && mesh.hasTriangles) {
			this.setAttribute("color", 4);
		} else {
			this.disableVertexAttrib("color");
		}
		gl.bindBuffer(target, null);
	}

	protected setIndexBuffer(mesh: Tea.Mesh): void {
		var gl = this.app.gl;
		var target = gl.ELEMENT_ARRAY_BUFFER;
		if (mesh.hasTriangles) {
			gl.bindBuffer(target, this.indexBuffer);
		} else {
			gl.bindBuffer(target, null);
		}
	}

	protected setFrontFace(): void {
		var gl = this.app.gl;
		var scale = this.object3d.scale;
		if (scale.x * scale.y * scale.z < 0) {
			gl.frontFace(gl.CW);
		} else {
			gl.frontFace(gl.CCW);
		}
	}

	protected draw(mesh: Tea.Mesh): void {
		if (this.wireframe) {
			this.drawWireframe(mesh);
			return;
		}
		var gl = this.app.gl;
		if (mesh.hasTriangles === false) {
			gl.drawArrays(
				gl.TRIANGLES, 0, mesh.vertices.length
			);
			return;
		}
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
	}

	protected drawWireframe(mesh: Tea.Mesh): void {
		var gl = this.app.gl;
		if (mesh.hasTriangles === false) {
			gl.drawArrays(
				gl.LINES, 0, mesh.vertices.length
			);
			return;
		}
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.LINES, count, gl.UNSIGNED_SHORT, 0);
	}
}
