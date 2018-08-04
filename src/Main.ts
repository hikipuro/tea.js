import * as Electron from "electron";
import * as Tea from "./tea/Tea";
import { TestScript } from "./TestScript";

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
		this.app.width = 400;
		this.app.height = 400;

		console.log("aspectRatio", this.app.aspectRatio);
		console.log("params", this.app.parameters);
		console.log("contextAttributes", this.app.contextAttributes);

		const scene = this.app.createScene();
		//scene.camera.far = 10;
		//scene.camera.position.y = 0;
		//scene.camera.fov = 25;
		//scene.camera.fov = 20;
		//scene.camera.orthographic = true;
		scene.camera.rotation.x = -Tea.radians(20);
		scene.camera.rotation.y = -Tea.radians(10);
		scene.camera.rotation.z = Tea.radians(20);
		this.app.setScene(scene);

		const script = new TestScript();

		const cube = this.app.createCube();
		cube.name = "cube";
		cube.position.x = 2;
		cube.position.y = 2;
		cube.position.z = 2;
		//cube.rotation.z = Tea.radians(45);
		//cube.addScript(script);
		scene.appendChild(cube);

		const cube2 = this.app.createCube();
		cube2.name = "cube2";
		//scene.appendChild(cube2);

		const plain = this.app.createPlain();
		//cube2.name = "cube2";
		plain.position.z = 5;
		//plain.position.x = 2;
		plain.rotation.x = -Tea.radians(60);
		plain.rotation.y = -Tea.radians(40);
		plain.rotation.z = Tea.radians(10);
		scene.appendChild(plain);
		this.plain = plain;

		let m = Tea.Matrix4.identity;
		m.m01 = 2;
		m.m02 = 3;
		m.m03 = 4;
		//m = m.mul(Tea.Matrix4.translate(new Tea.Vector3(10, 20, 30)));

		console.log("m test", m.mul(m.inverse), m, m.determinant, m.inverse, (new Tea.Matrix4()).determinant);
		console.log(m.toString());
		//console.log("m test 2", Tea.Matrix4.rotate(new Tea.Vector3(10, 20, 30)));

		let m2 = Tea.Matrix4.identity;
		console.log(Tea.Matrix4.translate(1, 2, 4));

		setInterval(() => {
			//plain.rotation.x += 1;
		});

		this.app.start();

		Tea.File.readImage("../models/google.jpg", (image) => {
			//document.body.appendChild(image);
			const texture = this.app.createTexture(image);
			cube.renderer.shader.texture = texture;
			plain.renderer.shader.texture = texture;
		});

		setTimeout(() => {
			//this.app.stop();
		}, 20);

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

			this.renderer = this.app.createRenderer(mesh, shader);
			//this.renderer.wireframe = true;
			this.renderer.camera = this.camera;

			//console.log(Matrix4.identity);
			//let rr = new Vector3(0, 1, 3);
			//console.log(rr.toString(), rr.magnitude, Vector3.positiveInfinity.magnitude);

			this.render();
		});
	}

	render = (): void => {
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

		this.renderer.render();

		requestAnimationFrame(this.render);
	}
}
