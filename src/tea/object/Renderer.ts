import * as Tea from "../Tea";

export class Renderer {
	app: Tea.App;
	object3d: Tea.Object3D;
	shader: Tea.Shader;
	mesh: Tea.Mesh;
	camera: Tea.Camera;

	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	normalBuffer: WebGLBuffer;
	uvBuffer: WebGLBuffer;
	colorBuffer: WebGLBuffer;

	wireframe: boolean = false;

	constructor(app: Tea.App) {
		this.app = app;
		const gl = this.app.gl;
		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
		this.normalBuffer = gl.createBuffer();
		this.uvBuffer = gl.createBuffer();
		this.colorBuffer = gl.createBuffer();
	}

	remove(): void {
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

	render(): void {
		if (this.isRenderable === false) {
			return;
		}

		const gl = this.app.gl;
		const height = this.app.height;
		//gl.enable(gl.SCISSOR_TEST);
		//gl.scissor(0, 0, 400, height * 0.9);
		//gl.viewport(0, -height * 0.1, 400, height);
		//console.log("this.height", this.app.height);

		this.setUniforms(this.mesh);
		this.setTexture(this.shader.texture);
		this.setVertexBuffer(this.mesh);
		this.setIndexBuffer(this.mesh);
		this.draw(this.mesh);
	}

	protected get isRenderable(): boolean {
		return (
			this.object3d != null &&
			this.shader != null &&
			this.mesh != null &&
			this.camera != null
		);
	}

	protected setUniforms(mesh: Tea.Mesh): void {
		let model = this.createModelMatrix();
		const mvpMatrix = this.camera.mvpMatrix(model);
		this.shader.uniformMatrix4fv("mvpMatrix", mvpMatrix);
		this.shader.uniformMatrix4fv("invMatrix", mvpMatrix.inverse);
		this.shader.uniform3fv("lightDirection", [-0.5, 0.5, 0.5]);
		this.shader.uniform4fv("ambientColor", [0.1, 0.1, 0.1, 1.0]);
		if (mesh.hasColors) {
			this.shader.uniform1i("useColor", 1);
		} else {
			this.shader.uniform1i("useColor", 0);
		}
	}

	protected createModelMatrix(): Tea.Matrix4 {
		let m = Tea.Matrix4.identity;
		m = m.mul(Tea.Matrix4.translate(this.object3d.position));
		m = m.mul(Tea.Matrix4.rotateZXY(this.object3d.rotation));
		m = m.mul(Tea.Matrix4.scale(this.object3d.scale));
		return m;
	}

	protected setTexture(texture: Tea.Texture): void {
		const gl = this.app.gl;
		gl.bindTexture(gl.TEXTURE_2D, texture.webgl.texture);
		this.shader.uniform1i("texture", 0);
	}

	protected setVertexBuffer(mesh: Tea.Mesh): void {
		const gl = this.app.gl;
		const target = gl.ARRAY_BUFFER;
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, mesh.vertices, gl.STATIC_DRAW);
		this.shader.setAttribute("position", 3);

		if (mesh.hasNormals) {
			gl.bindBuffer(target, this.normalBuffer);
			gl.bufferData(target, mesh.normals, gl.STATIC_DRAW);
			this.shader.setAttribute("normal", 3);
		} else {
			this.shader.disableVertexAttrib("normal");
		}

		if (mesh.hasUVs) {
			gl.bindBuffer(target, this.uvBuffer);
			gl.bufferData(target, mesh.uv, gl.STATIC_DRAW);
			this.shader.setAttribute("texCoord", 2);
		} else {
			this.shader.disableVertexAttrib("texCoord");
		}

		if (mesh.hasColors) {
			gl.bindBuffer(target, this.colorBuffer);
			gl.bufferData(target, mesh.colors, gl.STATIC_DRAW);
			this.shader.setAttribute("color", 4);
		} else {
			//gl.bindBuffer(target, this.colorBuffer);
			this.shader.disableVertexAttrib("color");
		}
		gl.bindBuffer(target, null);
	}

	protected setIndexBuffer(mesh: Tea.Mesh): void {
		const gl = this.app.gl;
		const target = gl.ELEMENT_ARRAY_BUFFER;
		if (mesh.hasTriangles) {
			gl.bindBuffer(target, this.indexBuffer);
			gl.bufferData(target, mesh.triangles, gl.STATIC_DRAW);
		} else {
			gl.bindBuffer(target, null);
		}
	}

	protected draw(mesh: Tea.Mesh): void {
		const gl = this.app.gl;
		if (mesh.hasTriangles === false) {
			const count = this.mesh.vertices.length / 3;
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
			const count = this.mesh.triangles.length;
			gl.drawElements(gl.LINE_STRIP, count, gl.UNSIGNED_SHORT, 0);
			return;
		}

		const count = this.mesh.triangles.length;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
	}
}
