import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class MeshRenderer extends Renderer {
	receiveShadows: boolean;
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	wireframe: boolean = false;
	protected _mesh: Tea.Mesh;
	protected _bounds: Tea.Bounds;

	constructor(app: Tea.App) {
		super(app);
		this.receiveShadows = false;
		this.createBuffers();
	}

	get bounds(): Tea.Bounds {
		return this._bounds;
	}

	update(): void {
		var component = this.object3d.getComponent(Tea.MeshFilter);
		if (component != null && component.mesh != null) {
			var mesh = component.mesh;
			var bounds = mesh.bounds.clone();
			bounds.center.add$(this.object3d.position);
			
			var rotation = this.object3d.rotation;
			bounds.extents.applyQuaternion(rotation);
			var extents = bounds.extents;
			extents[0] = Math.abs(extents[0]);
			extents[1] = Math.abs(extents[1]);
			extents[2] = Math.abs(extents[2]);
			bounds.extents.scale$(this.object3d.scale);
			
			this._mesh = mesh;
			this._bounds = bounds;
		} else {
			this._mesh = null;
			this._bounds = null;
		}
	}

	remove(): void {
		this.deleteBuffers();
	}

	render(camera: Tea.Camera, lights: Array<Tea.Light>): void {
		if (this.enabled === false || camera == null) {
			return;
		}
		if (this.isRenderable === false) {
			return;
		}
		if (this._mesh == null) {
			return;
		}
		super.render(camera, lights);

		var mesh = this._mesh;
		var location = this.material.shader.propertyToID("receiveShadows");
		if (location != null && this.receiveShadows) {
			this.gl.uniform1i(location, 1);
			//this._uniforms.uniform1i("receiveShadows", 1);
		} else {
			this.gl.uniform1i(location, 0);
			//this._uniforms.uniform1i("receiveShadows", 0);
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
		var gl = this.gl;
		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
	}

	protected deleteBuffers(): void {
		var gl = this.gl;
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
			data.push(vertex[0], vertex[1], vertex[2]);
			this.enableVertexAttribArray("vertex");

			if (mesh.hasTriangles === false) {
				this.disableVertexAttrib("normal");
				this.disableVertexAttrib("texcoord");
				this.disableVertexAttrib("color");
				continue;
			}

			if (mesh.hasNormals) {
				var normal = mesh.normals[i];
				data.push(normal[0], normal[1], normal[2]);
				this.enableVertexAttribArray("normal");
			} else {
				//data.push(0, 0, 0);
				this.disableVertexAttrib("normal");
			}

			if (mesh.hasUVs) {
				var uv = mesh.uv[i];
				data.push(uv[0], uv[1]);
				this.enableVertexAttribArray("texcoord");
			} else {
				//data.push(0, 0);
				this.disableVertexAttrib("texcoord");
			}

			if (mesh.hasColors) {
				var color = mesh.colors[i];
				data.push(color[0], color[1], color[2], color[3]);
				this.enableVertexAttribArray("color");
			} else {
				//data.push(0, 0, 0, 0);
				this.disableVertexAttrib("color");
			}
		}

		var gl = this.gl;
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
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

		var stride = 4 * 3;
		if (mesh.hasNormals) {
			stride += 4 * 3;
		}
		if (mesh.hasUVs) {
			stride += 4 * 2;
		}
		if (mesh.hasColors) {
			stride += 4 * 4;
		}

		var offset = 0;
		this.vertexAttribPointer("vertex", 3, stride, offset);
		offset += 4 * 3;

		if (mesh.hasTriangles) {
			if (mesh.hasNormals) {
				this.vertexAttribPointer("normal", 3, stride, offset);
				offset += 4 * 3;
			}
			if (mesh.hasUVs) {
				this.vertexAttribPointer("texcoord", 2, stride, offset);
				offset += 4 * 2;
			}
			if (mesh.hasColors) {
				this.vertexAttribPointer("color", 4, stride, offset);
			}
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	protected setIndexBuffer(mesh: Tea.Mesh): void {
		var gl = this.gl;
		if (mesh.hasTriangles) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		} else {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}
	}

	protected setFrontFace(): void {
		var gl = this.gl;
		var scale = this.object3d.scale;
		if (scale[0] * scale[1] * scale[2] < 0) {
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
		var gl = this.gl;
		if (mesh.hasTriangles === false) {
			gl.drawArrays(
				gl.TRIANGLES, 0, mesh.vertices.length
			);
			Renderer.drawCallCount++;
			return;
		}
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
		Renderer.drawCallCount++;
	}

	protected drawWireframe(mesh: Tea.Mesh): void {
		var gl = this.gl;
		if (mesh.hasTriangles === false) {
			gl.drawArrays(
				gl.LINES, 0, mesh.vertices.length
			);
			Renderer.drawCallCount++;
			return;
		}
		var count = mesh.triangles.length * 3;
		gl.drawElements(gl.LINES, count, gl.UNSIGNED_SHORT, 0);
		Renderer.drawCallCount++;
	}
}
