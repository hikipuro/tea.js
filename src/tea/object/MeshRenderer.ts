import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class MeshRenderer extends Renderer {
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
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
	}

	protected setMeshData(mesh: Tea.Mesh): void {
		if (mesh.isModified === false) {
			return;
		}

		var length = mesh.vertexCount;
		var data = [];
		for (var i = 0; i < length; i++) {
			var vertex = mesh.vertices[i];
			data.push(vertex.x, vertex.y, vertex.z);

			if (mesh.hasNormals) {
				var normal = mesh.normals[i];
				data.push(normal.x, normal.y, normal.z);
			} else {
				data.push(0, 0, 0);
			}

			if (mesh.hasUVs) {
				var uv = mesh.uv[i];
				data.push(uv.x, uv.y);
			} else {
				data.push(0, 0);
			}

			if (mesh.hasColors) {
				var color = mesh.colors[i];
				data.push(color.r, color.g, color.b, color.a);
			} else {
				data.push(0, 0, 0, 0);
			}
		}

		var gl = this.app.gl;
		gl.useProgram(this.material.shader.program);
		var target = gl.ARRAY_BUFFER;

		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, new Float32Array(data), gl.STATIC_DRAW);
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

		var stride = 4 * 12;
		this.setAttribute("vertex", 3, stride, 0);

		if (mesh.hasTriangles) {
			if (mesh.hasNormals) {
				this.setAttribute("normal", 3, stride, 4 * 3);
			} else {
				this.disableVertexAttrib("normal");
			}

			if (mesh.hasUVs) {
				this.setAttribute("texcoord", 2, stride, 4 * 6);
			} else {
				this.disableVertexAttrib("texcoord");
			}

			if (mesh.hasColors) {
				this.setAttribute("color", 4, stride, 4 * 8);
			} else {
				this.disableVertexAttrib("color");
			}
		} else {
			this.disableVertexAttrib("normal");
			this.disableVertexAttrib("texcoord");
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
