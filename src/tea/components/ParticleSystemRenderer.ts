import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class ParticleSystemRenderer extends Renderer {
	static readonly className: string = "ParticleSystemRenderer";
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	particlesBuffer: WebGLBuffer;
	mesh: Tea.Mesh;
	protected _maxParticles: number;
	protected _draw: Function;

	constructor(app: Tea.App) {
		super(app);
		var gl = this.gl;
		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
		this.mesh = Tea.Primitives.createQuadMesh();
		this._maxParticles = 0;
		if (this.enableInstancing) {
			this.particlesBuffer = gl.createBuffer();
			this._draw = this.drawInstances;
		} else {
			this._draw = this.draw;
		}
	}

	protected get enableInstancing(): boolean {
		return this.app.status.ANGLE_instanced_arrays != null;
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
		if (this.particlesBuffer != null) {
			gl.deleteBuffer(this.particlesBuffer);
			this.particlesBuffer = undefined;
		}
		this.mesh = undefined;
		super.destroy();
	}

	render(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		if (this.enabled === false || camera == null) {
			return;
		}
		if (!this.isRenderable) {
			return;
		}
		var particleSystem = this.object3d.getComponent(Tea.ParticleSystem);
		if (particleSystem == null
		|| particleSystem.enabled === false
		|| particleSystem.isPlaying === false) {
			return;
		}
		if (particleSystem.particleCount <= 0) {
			return;
		}
		if (this._maxParticles !== particleSystem.main.maxParticles) {
			this._maxParticles = particleSystem.main.maxParticles;
			if (this.enableInstancing) {
				var gl = this.gl;
				var maxParticles = this._maxParticles;
				var data = new Float32Array(maxParticles * (3 + 4 + 1));
				gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
			}
		}
		super.render(camera, lights, renderSettings);
		var mesh = this.mesh;
		if (mesh.isModified === true) {
			this.setMeshData(mesh);
		}
		this.sortParticles(particleSystem, camera);
		this.setVertexBuffer(mesh, particleSystem);
		this._draw(camera, particleSystem, mesh);
		this.disableAllAttributes();
	}

	protected sortParticles(particleSystem: Tea.ParticleSystem, camera: Tea.Camera): void {
		var q = camera.object3d.rotation.inversed;
		var ax = q[0], ay = q[1], az = q[2], aw = q[3];
		particleSystem.particles.sort((a: Tea.Particle, b: Tea.Particle) => {
			var ap = a.position, bp = b.position;
			var bx = ap[0], by = ap[1], bz = ap[2];
			var tx = ay * bz - az * by;
			var ty = az * bx - ax * bz;
			var tz = ax * by - ay * bx;
			var apz = bz + 2.0 * (aw * tz + ax * ty - ay * tx);
			bx = bp[0], by = bp[1], bz = bp[2];
			tx = ay * bz - az * by;
			ty = az * bx - ax * bz;
			tz = ax * by - ay * bx;
			var bpz = bz + 2.0 * (aw * tz + ax * ty - ay * tx);
			return bpz - apz;
		});
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, ParticleSystemRenderer.className) === false) {
			callback(null);
			return;
		}
		app.enableInstancedArrays();
		var object3d = new Tea.Object3D(app);
		object3d.rotate(-90.0, 0.0, 0.0);
		var shader = new Tea.Shader(app);
		if (app.status.ANGLE_instanced_arrays != null) {
			shader.attach(
				Tea.ShaderSources.particleInstancingVS,
				Tea.ShaderSources.particleInstancingFS
			);
		} else {
			shader.attach(
				Tea.ShaderSources.particleVS,
				Tea.ShaderSources.particleFS
			);
		}
		//shader.settings.enableDepthTest = false;
		shader.settings.depthWriteMask = false;
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		var renderer = new ParticleSystemRenderer(app);
		renderer.enabled = json.enabled;
		renderer.material = Tea.Material.fromJSON(app, json.material);
		renderer.material.renderQueue = 3000;
		renderer.material.setFloat("_Cutoff", 0.0);
		renderer.material.shader = shader;
		renderer.material.mainTexture = Tea.Texture.getDefaultParticle(app);
		callback(renderer);
	}

	toJSON(): Object {
		var json = super.toJSON();
		json[Tea.JSONUtil.TypeName] = ParticleSystemRenderer.className;
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
		var gl = this.gl;
		var data = mesh.createVertexBufferData();
		var target = gl.ARRAY_BUFFER;
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, data, gl.STATIC_DRAW);
		//gl.bindBuffer(target, null);

		if (mesh.hasTriangles) {
			target = gl.ELEMENT_ARRAY_BUFFER;
			var triangles = new Uint16Array(Tea.ArrayUtil.unroll(mesh.triangles));
			gl.bindBuffer(target, this.indexBuffer);
			gl.bufferData(target, triangles, gl.STATIC_DRAW);
			//gl.bindBuffer(target, null);
		}
		mesh.isModified = false;
	}

	protected setVertexBuffer(mesh: Tea.Mesh, particleSystem: Tea.ParticleSystem): void {
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

		var attributes = Renderer.attributes;
		//attributes.start();

		var shader = this.material.shader;
		var location = -1;
		location = shader.getAttribLocation("vertex");
		if (location >= 0) {
			if (attributes.isEnabled(location) === false) {
				gl.enableVertexAttribArray(location);
			}
			attributes.enable(location);
			gl.vertexAttribPointer(location, 3, gl.FLOAT, false, stride, 0);
		}
		
		var offset = 4 * 3;
		if (mesh.hasTriangles) {
			if (mesh.hasNormals) {
				location = shader.getAttribLocation("normal");
				if (location >= 0) {
					if (attributes.isEnabled(location) === false) {
						gl.enableVertexAttribArray(location);
					}
					attributes.enable(location);
					gl.vertexAttribPointer(location, 3, gl.FLOAT, false, stride, offset);
				}
				//this.enableVertexAttribArray("normal");
				//this.vertexAttribPointer("normal", 3, stride, offset);
				offset += 4 * 3;
			}
			if (mesh.hasUVs) {
				location = shader.getAttribLocation("texcoord");
				if (location >= 0) {
					if (attributes.isEnabled(location) === false) {
						gl.enableVertexAttribArray(location);
					}
					attributes.enable(location);
					gl.vertexAttribPointer(location, 2, gl.FLOAT, false, stride, offset);
				}
				//this.enableVertexAttribArray("texcoord");
				//this.vertexAttribPointer("texcoord", 2, stride, offset);
			}
		}
		if (this.enableInstancing) {
			this.setParticlesBuffer(particleSystem);
		}
		attributes.end(gl);
	}

	protected setParticlesBuffer(particleSystem: Tea.ParticleSystem): void {
		var ext = this.app.status.ANGLE_instanced_arrays;
		var gl = this.gl;
		var shader = this.material.shader;
		var data = particleSystem.createData();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);

		var attributes = Renderer.attributes;
		var stride = 32;
		var location = -1;
		location = shader.getAttribLocation("position");
		if (location >= 0) {
			if (attributes.isEnabled(location) === false) {
				gl.enableVertexAttribArray(location);
			}
			attributes.enable(location);
			gl.vertexAttribPointer(location, 3, gl.FLOAT, false, stride, 0);
			ext.vertexAttribDivisorANGLE(location, 1);
		}
		location = shader.getAttribLocation("color");
		if (location >= 0) {
			if (attributes.isEnabled(location) === false) {
				gl.enableVertexAttribArray(location);
			}
			attributes.enable(location);
			gl.vertexAttribPointer(location, 4, gl.FLOAT, false, stride, 12);
			ext.vertexAttribDivisorANGLE(location, 1);
		}
		location = shader.getAttribLocation("size");
		if (location >= 0) {
			if (attributes.isEnabled(location) === false) {
				gl.enableVertexAttribArray(location);
			}
			attributes.enable(location);
			gl.vertexAttribPointer(location, 1, gl.FLOAT, false, stride, 28);
			ext.vertexAttribDivisorANGLE(location, 1);
		}
	}

	protected disableAllAttributes(): void {
		var ext = this.app.status.ANGLE_instanced_arrays;
		if (ext == null) {
			return;
		}
		var shader = this.material.shader;
		var location = -1;
		location = shader.getAttribLocation("position");
		if (location >= 0) {
			ext.vertexAttribDivisorANGLE(location, 0);
		}
		location = shader.getAttribLocation("color");
		if (location >= 0) {
			ext.vertexAttribDivisorANGLE(location, 0);
		}
		location = shader.getAttribLocation("size");
		if (location >= 0) {
			ext.vertexAttribDivisorANGLE(location, 0);
		}
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

	protected drawInstances(camera: Tea.Camera, particleSystem: Tea.ParticleSystem, mesh: Tea.Mesh): void {
		var gl = this.gl;
		var ext = this.app.status.ANGLE_instanced_arrays;
		var shader = this.material.shader;

		var right = shader.getUniformLocation("CameraRight");
		var up = shader.getUniformLocation("CameraUp");
		var view = camera.cameraToWorldMatrix;
		gl.uniform3f(right, view[0], view[1], view[2]);
		gl.uniform3f(up, view[4], view[5], view[6]);

		var triangles = mesh.triangles.length * 3;
		var count = particleSystem.particleCount;
		this.app.status.setFrontFace(gl.CCW);
		ext.drawElementsInstancedANGLE(
			gl.TRIANGLES, triangles,
			gl.UNSIGNED_SHORT, 0, count
		);
		Renderer.drawCallCount++;
	}

	protected draw(camera: Tea.Camera, particleSystem: Tea.ParticleSystem, mesh: Tea.Mesh): void {
		var gl = this.gl;
		var shader = this.material.shader;
		var position = shader.getUniformLocation("position");
		var color = shader.getUniformLocation("color");
		var size = shader.getUniformLocation("size");
		if (position == null || color == null || size == null) {
			return;
		}
		
		var right = shader.getUniformLocation("CameraRight");
		var up = shader.getUniformLocation("CameraUp");
		var view = camera.cameraToWorldMatrix;
		gl.uniform3f(right, view[0], view[1], view[2]);
		gl.uniform3f(up, view[4], view[5], view[6]);

		var TRIANGLES = gl.TRIANGLES;
		var UNSIGNED_SHORT = gl.UNSIGNED_SHORT;
		var count = particleSystem.particleCount;
		var particles = particleSystem.particles;
		var triangles = mesh.triangles.length * 3;
		this.app.status.setFrontFace(gl.CCW);
		for (var i = 0; i < count; i++) {
			var particle = particles[i];
			var p = particle.position;
			var c = particle.color;
			gl.uniform3f(position, p[0], p[1], p[2]);
			gl.uniform4f(color, c[0], c[1], c[2], c[3]);
			gl.uniform1f(size, particle.size);
			gl.drawElements(TRIANGLES, triangles, UNSIGNED_SHORT, 0);
		}
		Renderer.drawCallCount += count;
	}
}
