import * as Tea from "../Tea";

export class Skybox {
	static readonly className: string = "Skybox";
	object3d: Tea.Object3D;
	renderer: Tea.MeshRenderer;
	front: Tea.Texture;
	back: Tea.Texture;
	up: Tea.Texture;
	down: Tea.Texture;
	left: Tea.Texture;
	right: Tea.Texture;

	constructor(app: Tea.App) {
		var object3d = new Tea.Object3D(app);
		object3d.name = Skybox.className;
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.skyboxVS,
			Tea.ShaderSources.skyboxFS
		);
		shader.settings.enableDepthTest = false;
		var mesh = Tea.Primitives.createSkyboxMesh();
		var meshFilter = object3d.addComponent(Tea.MeshFilter);
		meshFilter.mesh = mesh;
		var renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.receiveShadows = false;
		renderer.material = Tea.Material.getDefault(app);
		renderer.material.renderQueue = 1000;
		renderer.material.shader = shader;
		this.object3d = object3d;
		this.renderer = renderer;

		this.front = Tea.Texture.getEmpty(app, 0.5, 0.5, 0.5, 1.0);
		this.front.wrapMode = Tea.TextureWrapMode.Mirror;
		this.back = Tea.Texture.getEmpty(app, 0.5, 0.5, 0.5, 1.0);
		this.back.wrapMode = Tea.TextureWrapMode.Mirror;
		this.up = Tea.Texture.getEmpty(app, 0.5, 0.5, 0.5, 1.0);
		this.up.wrapMode = Tea.TextureWrapMode.Mirror;
		this.down = Tea.Texture.getEmpty(app, 0.5, 0.5, 0.5, 1.0);
		this.down.wrapMode = Tea.TextureWrapMode.Mirror;
		this.left = Tea.Texture.getEmpty(app, 0.5, 0.5, 0.5, 1.0);
		this.left.wrapMode = Tea.TextureWrapMode.Mirror;
		this.right = Tea.Texture.getEmpty(app, 0.5, 0.5, 0.5, 1.0);
		this.right.wrapMode = Tea.TextureWrapMode.Mirror;

		renderer.material.setTexture("_Front", this.front);
		renderer.material.setTexture("_Back", this.back);
		renderer.material.setTexture("_Up", this.up);
		renderer.material.setTexture("_Down", this.down);
		renderer.material.setTexture("_Left", this.left);
		renderer.material.setTexture("_Right", this.right);
	}

	static fromJSON(app: Tea.App, json: any): Skybox {
		if (Tea.JSONUtil.isValidSceneJSON(json, Skybox.className) === false) {
			return null;
		}
		var skybox = new Skybox(app);
		skybox.front = Tea.Texture.fromJSON(app, json.front);
		skybox.back = Tea.Texture.fromJSON(app, json.back);
		skybox.up = Tea.Texture.fromJSON(app, json.up);
		skybox.down = Tea.Texture.fromJSON(app, json.down);
		skybox.left = Tea.Texture.fromJSON(app, json.left);
		skybox.right = Tea.Texture.fromJSON(app, json.right);
		return skybox;
	}

	toJSON(): Object {
		var json = Tea.JSONUtil.createSceneJSON(Skybox.className);
		json.front = this.front.toJSON();
		json.back = this.back.toJSON();
		json.up = this.up.toJSON();
		json.down = this.down.toJSON();
		json.left = this.left.toJSON();
		json.right = this.right.toJSON();
		return json;
	}
}
