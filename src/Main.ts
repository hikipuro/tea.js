import * as Electron from "electron";
import * as Tea from "./tea/Tea";
import { TestScript } from "./TestScript";
import { TestScript2 } from "./TestScript2";
import { Rect } from "./tea/math/Rect";

export class Main {
	app: Tea.App;
	renderer: Tea.Renderer;
	camera: Tea.Camera;
	texture: Tea.Texture;
	plain: Tea.Object3D;

	public count: number;

	constructor() {
		console.log("test test");
		console.log("devicePixelRatio", Tea.Screen.dpi);
		console.log("width", Tea.Screen.width);
		console.log("height", Tea.Screen.height);
		console.log(Tea.Screen.fullscreen);

		const b = document.querySelector("#b");
		b.addEventListener("click", () => {
			console.log("click", Tea.now());
			//this.app.bench();
		});

		this.count = 0;
		this.app = new Tea.App("canvas");
		//this.app.canvas.style.background = "#000";
		this.app.width = 400;
		this.app.height = 400;

		console.log("aspectRatio", this.app.aspectRatio);
		console.log("params", this.app.parameters);
		console.log("contextAttributes", this.app.contextAttributes);

		console.log("rect", (new Rect(10, 10, 100, 100).toString()));

		//console.log("perspective");
		//console.log(Tea.Matrix4.perspective(60, 1, 0.3, 1000).toString());

		const mm = Tea.Matrix4.lookAt(new Tea.Vector3(10, 20, 30), new Tea.Vector3(3,2,1), Tea.Vector3.up);
		console.log("matrix",mm.toString());
		console.log(mm.inverse.toString());
		console.log((mm.mul(mm.inverse).toString()));
		console.log("v", Tea.Vector2.one.toString());

		const mmm = new Tea.Matrix4();
		mmm.setColumn(0, new Tea.Vector4(1, 2, 3, 4));
		console.log(mm.mul(Tea.Vector4.one));

		const scene = this.app.createScene();
		//scene.camera.far = 10;
		//scene.camera.position.y = 2;
		//scene.camera.fov = 25;
		//scene.camera.fov = 20;
		//scene.camera.orthographic = true;
		//scene.camera.nearClipPlane = 2;
		scene.camera.rotation.x = -Tea.radians(20);
		scene.camera.rotation.y = -Tea.radians(10);
		scene.camera.rotation.z = Tea.radians(10);
		//cene.camera.fieldOfView = 16;
		//scene.camera.rotation.z = Tea.radians(20);
		//scene.camera.position.x = 2;
		//scene.camera.position.z = 13;
		//scene.camera.fieldOfView = 30;
		//scene.camera.rect.x = 0.2;
		//scene.camera.rect.width = 0.5;
		//scene.camera.rect.y = 0.2;
		//scene.camera.rect.height = 0.6;
		this.app.setScene(scene);

		setTimeout(() => {
			console.log("ray", scene.camera.screenPointToRay(new Tea.Vector3(100, 100)).toString());
			console.log("ray2", scene.camera.viewportPointToRay(new Tea.Vector3(0.5, 0.5)).toString());
		}, 100);

		//console.log("camera", scene.camera.cameraToWorldMatrix.toString());
		//console.log("camera", scene.camera.worldToCameraMatrix.toString());
		//console.log("camera", scene.camera.projectionMatrix);

		const script = new TestScript();

		const cube = this.app.createCube();
		cube.name = "cube";
		cube.position.x = 2;
		cube.position.y = 2;
		cube.position.z = 2;
		//cube.scale.x = -1 / 2;
		//cube.scale.y = -1;
		//cube.scale.z = -1;
		//cube.rotation.y = Tea.radians(-40);
		//cube.addScript(script);
		//scene.appendChild(cube);

		const cube2 = this.app.createCube();
		cube2.name = "cube2";
		//scene.appendChild(cube2);

		const sphere = this.app.createSphere();
		//cube2.name = "cube2";
		sphere.position.x = 1.6;
		sphere.position.y = 2;
		sphere.position.z = 1.5;
		//sphere.addScript(script);
		//scene.appendChild(sphere);

		const quad = this.app.createQuad();
		//cube2.name = "cube2";
		//plain.position.z = 5;
		//quad.position.x = -3;
		//plain.rotation.x = -Tea.radians(50);
		//plain.rotation.y = -Tea.radians(20);
		//plain.rotation.z = Tea.radians(60);
		quad.scale.x = 2;
		quad.scale.y = 2;
		//plain.addScript(script);
		scene.appendChild(quad);
		//this.plain = quad;

		const cylinder = this.app.createCylinder();
		//cylinder.renderer.wireframe = true;
		cylinder.rotation.x = Tea.radians(30);
		//cylinder.addScript(script);
		scene.appendChild(cylinder);

		const plane = this.app.createPlane();
		//plane.renderer.wireframe = true;
		//plane.position.z = -9;
		//plane.rotation.x = Tea.radians(90);
		//plane.addScript(script);
		scene.appendChild(plane);

		const capsule = this.app.createCapsule();
		//capsule.renderer.wireframe = true;
		//capsule.position.y = 1;
		//capsule.position.z = 7;
		//capsule.rotation.x = Tea.radians(90);
		capsule.addScript(script);
		scene.appendChild(capsule);

		capsule.addComponent(Tea.Camera);
		//capsule.addComponent(Tea.MeshRenderer);
		console.log("component", capsule.getComponent(Tea.Camera));

		const lines = this.app.createObject3D();
		const lineRenderer = lines.addComponent(Tea.LineRenderer);
		lines.position.x = 3;
		lineRenderer.add(0, 0, 0);
		lineRenderer.add(2, 1, 0);
		lineRenderer.add(-2, 1, 3);
		lineRenderer.add(-3, 5, 0);
		lineRenderer.add(0, 0, 7);
		//lineRenderer.color = new Tea.Color(1, 0, 0, 1);
		lines.addScript(new TestScript2());
		capsule.appendChild(lines);
		//scene.appendChild(lines);

		let ray = new Tea.Ray(new Tea.Vector3(0, 1, 0), new Tea.Vector3(0.2, 0.3, 0.4));
		console.log("test", ray.direction, ray.getPoint(6.5), ray.getPoint(-6.5));

		this.app.start();

		Tea.File.readImage("../models/google.jpg", (image) => {
			//document.body.appendChild(image);
			const texture = this.app.createTexture(image);
			/*
			cube.renderer.shader.texture = texture;
			quad.renderer.shader.texture = texture;
			cylinder.renderer.shader.texture = texture;
			plane.renderer.shader.texture = texture;
			capsule.renderer.shader.texture = texture;
			*/
			let r = cube.getComponent(Tea.Renderer);
			r.shader.texture = texture;
			r = quad.getComponent(Tea.Renderer);
			r.shader.texture = texture;
			r = cylinder.getComponent(Tea.Renderer);
			r.shader.texture = texture;
			r = plane.getComponent(Tea.Renderer);
			r.shader.texture = texture;
			r = capsule.getComponent(Tea.Renderer);
			r.shader.texture = texture;
		});

		Tea.File.readImage("../models/earth.jpg", (image) => {
			//document.body.appendChild(image);
			const texture = this.app.createTexture(image);
			//sphere.renderer.shader.texture = texture;
			//capsule.renderer.shader.texture = texture;
		});

		//setTimeout(() => {
			//this.app.stop();
		//}, 20);

		/*
		this.camera = new Tea.Camera();
		this.camera.aspectRatio = this.app.aspectRatio;
		this.camera.fov = 24;
		//this.camera.background.b = 0.5;
		//this.camera.position.set(0, 1, -10);

		console.log(this.camera.toString());

		//this.app.camera = this.camera;

		//Tea.File.readImage("../teapot/default.png", (image) => {
		Tea.File.readImage("../models/google.jpg", (image) => {
			//document.body.appendChild(image);
			const texture = this.app.createTexture(image);
			this.texture = texture;
			this.start();
		});

		Tea.File.readText("models/cube.dae", (data) => {
			const mesh = Tea.DaeReader.read(data);
		});

		const v3 = new Tea.Vector3(-2, -3, -4);
		console.log(v3.magnitude);
		*/
	}

	start() {
		//Tea.File.readText("untitled.obj", (data) => {
		Tea.File.readText("teapot/teapot.obj", (data) => {
			//console.log(f);
			//const mesh = Tea.ObjReader.read(data);
			//const mesh = Tea.Primitives.createPlainMesh();
			const mesh = Tea.Primitives.createCubeMesh();
			//mesh.scale(1 / 50);
			//mesh.scale(2);
			//mesh.position.set(0.5, 0, 0);
			//mesh.rotateX(Tea.radians(-25));

			const vs = Tea.getElementText("vs");
			const fs = Tea.getElementText("fs");
			const shader = this.app.createShader(vs, fs);
			shader.texture = this.texture;

			this.renderer = this.app.createMeshRenderer(mesh, shader);
			//this.renderer.wireframe = true;
			//this.renderer.camera = this.camera;

			//console.log(Matrix4.identity);
			//let rr = new Vector3(0, 1, 3);
			//console.log(rr.toString(), rr.magnitude, Vector3.positiveInfinity.magnitude);

			this.render();
		});
	}

	render = (): void => {
		console.log("render");
		this.count++;

		let rr = new Tea.Vector3(0, 1, 3);
		//rr = Tea.Vector3.moveTowards(rr, new Tea.Vector3(0, 1, 1), Math.sin(Tea.radians(this.count)) * 10);
		rr.rotateY(Tea.radians(this.count));

		//let position = new Tea.Vector3(0, 1, -10);
		//this.camera.position = Tea.Vector3.moveTowards(position, new Tea.Vector3(0, 1, -2), Math.sin(Tea.radians(this.count)) * 10);

		//this.camera.lookAt(rr);

		//this.camera.vMatrix = Matrix4.identity;
		//this.camera.vMatrix = this.camera.vMatrix.lookAt(rr, [0, 0, 0], [0, 1, 0]);

		// 各行列を掛け合わせ座標変換行列を完成させる
		//mvpMatrix = mvpMatrix.mul(pMatrix);
		//mvpMatrix = mvpMatrix.mul(vMatrix);

		//this.WebGL.setMesh(this.mesh);
		//this.shader.setAttribute("position", 3);

		//this.renderer.render();

		requestAnimationFrame(this.render);
	}
}
