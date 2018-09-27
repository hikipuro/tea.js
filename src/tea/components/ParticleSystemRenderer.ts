import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class ParticleSystemRenderer extends Renderer {
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	mesh: Tea.Mesh;

	constructor(app: Tea.App) {
		super(app);
		var gl = this.gl;
		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
		this.mesh = Tea.Primitives.createQuadMesh();
	}

	destroy(): void {
		var gl = this.gl;
		if (this.vertexBuffer != null) {
			gl.deleteBuffer(this.vertexBuffer);
			this.vertexBuffer = undefined;
		}
		if (this.indexBuffer != null) {
			gl.deleteBuffer(this.indexBuffer);
			this.indexBuffer = undefined;
		}
		this.mesh = undefined;
		super.destroy();
	}

	render(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		if (this.enabled === false || camera == null) {
			return;
		}
		if (this.isRenderable === false) {
			return;
		}
		var particleSystem = this.object3d.getComponent(Tea.ParticleSystem);
		if (particleSystem == null || particleSystem.isPlaying === false) {
			return;
		}
		//particleSystem.update();
		if (particleSystem.particleCount <= 0) {
			return;
		}
		super.render(camera, lights, renderSettings);
		var mesh = this.mesh;
		if (mesh.isModified === true) {
			this.setMeshData(mesh);
		}
		this.setVertexBuffer(mesh);
		this.setFrontFace();
		this.draw(particleSystem, mesh);
		this.disableAllAttributes();
	}

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "ParticleSystemRenderer"
		});
		return json;
	}

	protected get isRenderable(): boolean {
		return (
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null
		);
	}

	protected setMeshData(mesh: Tea.Mesh): void {
		if (mesh.vertices == null || mesh.vertices.length <= 0) {
			return;
		}
		var data = mesh.createVertexBufferData();
		var gl = this.gl;
		var target = gl.ARRAY_BUFFER;

		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, data, gl.STATIC_DRAW);
		//gl.bindBuffer(target, null);

		if (mesh.hasTriangles) {
			target = gl.ELEMENT_ARRAY_BUFFER;
			var triangles = null;
			//if (this.app.status.OES_element_index_uint != null) {
			//	triangles = new Uint32Array(Tea.ArrayUtil.unroll(mesh.triangles));
			//} else {
				triangles = new Uint16Array(Tea.ArrayUtil.unroll(mesh.triangles));
			//}
			gl.bindBuffer(target, this.indexBuffer);
			gl.bufferData(target, triangles, gl.STATIC_DRAW);
			//gl.bindBuffer(target, null);
		}
		mesh.isModified = false;
	}

	protected setVertexBuffer(mesh: Tea.Mesh): void {
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		var stride = 4 * 3;
		if (mesh.hasTriangles) {
			if (mesh.hasNormals) {
				stride += 4 * 3;
			}
			if (mesh.hasUVs) {
				stride += 4 * 2;
			}
		}
		this.enableVertexAttribArray("vertex");
		this.vertexAttribPointer("vertex", 3, stride, 0);
		var offset = 4 * 3;
		if (mesh.hasTriangles) {
			if (mesh.hasNormals) {
				this.enableVertexAttribArray("normal");
				this.vertexAttribPointer("normal", 3, stride, offset);
				offset += 4 * 3;
			}
			if (mesh.hasUVs) {
				this.enableVertexAttribArray("texcoord");
				this.vertexAttribPointer("texcoord", 2, stride, offset);
			}
		}
	}

	protected setFrontFace(): void {
		var gl = this.gl;
		var status = this.app.status;
		var face = gl.CW;
		if (status.frontFace !== face) {
			gl.frontFace(face);
			status.frontFace = face;
		}
	}

	protected disableAllAttributes(): void {
		this.disableVertexAttrib("vertex");
		this.disableVertexAttrib("normal");
		this.disableVertexAttrib("texcoord");
		this.disableVertexAttrib("color");
	}

	protected getCamera(): Tea.Camera {
		var object3d = this.object3d;
		if (object3d == null || object3d.scene == null) {
			return null;
		}
		var scene = object3d.scene;
		if (scene.mainCamera == null) {
			return null;
		}
		return scene.mainCamera;
	}

	protected draw(particleSystem: Tea.ParticleSystem, mesh: Tea.Mesh): void {
		var gl = this.gl;
		var position = this.material.shader.propertyToID("position");
		var color = this.material.shader.propertyToID("color");
		var size = this.material.shader.propertyToID("size");
		if (position == null || color == null || size == null) {
			return;
		}
		var camera = this.getCamera();
		if (camera == null) {
			return;
		}
		var right = this.material.shader.propertyToID("CameraRight");
		var up = this.material.shader.propertyToID("CameraUp");
		var view = camera.cameraToWorldMatrix;
		gl.uniform3f(right, view[0], view[1], view[2]);
		gl.uniform3f(up, view[4], view[5], view[6]);
		var count = particleSystem.particleCount;
		var particles = particleSystem.particles;
		var triangles = mesh.triangles.length * 3;
		for (var i = 0; i < count; i++) {
			var particle = particles[i];
			var p = particle.position;
			var c = particle.color;
			gl.uniform3f(position, p[0], p[1], p[2]);
			gl.uniform4f(color, c[0], c[1], c[2], c[3]);
			gl.uniform1f(size, particle.size);
			gl.drawElements(gl.TRIANGLES, triangles, gl.UNSIGNED_SHORT, 0);
		}
	}
}
