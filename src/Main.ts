import * as Tea from "./tea/Tea";
import { TestScript } from "./TestScript";
import { TestScript2 } from "./TestScript2";
import { Rotate } from "./Rotate";
import { CameraRotate } from "./CameraRotate";

export class Main {
	app: Tea.App;
	renderer: Tea.Renderer;
	camera: Tea.Camera;
	texture: Tea.Texture;
	plain: Tea.Object3D;

	public count: number;

	constructor() {
		console.log(Tea.App.systemLanguage);
		console.log(Tea.App.absoluteURL);
		//console.log("devicePixelRatio", Tea.Screen.dpi);
		//console.log("width", Tea.Screen.width);
		//console.log("height", Tea.Screen.height);
		//console.log(Tea.Screen.fullscreen);

		const b = document.querySelector("#b");
		b.addEventListener("click", () => {
			console.log("click", Tea.now());
			//this.app.bench();
		});

		this.count = 0;
		this.app = new Tea.App("canvas", {antialias: false});
		//this.app.canvas.style.background = "#000";
		this.app.width = 400;
		this.app.height = 400;

		window.addEventListener("resize", () => {
			this.app.canvas.width = document.body.clientWidth;
			this.app.canvas.height = document.body.clientHeight;
		});

		//console.log("aspectRatio", this.app.aspectRatio);
		//console.log("params", this.app.parameters);
		//console.log("contextAttributes", this.app.contextAttributes);

		/*
		setTimeout(() => {
			let obj = [];
			for (let i = 0; i < 100000; i++) {
				obj[i] = i;
			}
			const count = 200;
			const test1 = Tea.benchmark(() => {
				let total = 0;
				for (let i = 0; i < obj.length; i++) {
					total += obj[i];
				}
				//console.log("total", total);
			}, count);
			const test2 = Tea.benchmark(() => {
				let total: number = 0;
				const l: number = obj.length;
				for (var i = 0; i < l; i++) {
					total += obj[i];
				}
				//console.log("total", total);
			}, count);
			console.log("test1", test1);
			console.log("test2", test2);
		}, 1000);
		//*/

		setTimeout(() => {
			var t = 2;
			const loop = 100;
			const count = 200;
			const test2 = Tea.benchmark(() => {
				for (var i = 0; i < loop; i++) {
					t = Math.pow(t, 2);
				}
			}, count);
			const test1 = Tea.benchmark(() => {
				for (var i = 0; i < loop; i++) {
					t = t ** 2;
				}
			}, count);
			console.log("test1", test1);
			console.log("test2", test2);
		}, 1000);
		//*/

		//console.log("perspective");
		//console.log(Tea.Matrix4.perspective(60, 1, 0.3, 1000).toString());

		/*
		const mm = Tea.Matrix4.lookAt(new Tea.Vector3(10, 20, 30), new Tea.Vector3(3,2,1), Tea.Vector3.up);
		console.log("matrix",mm.toString());
		console.log(mm.inverse.toString());
		console.log((mm.mul(mm.inverse).toString()));
		console.log("v", Tea.Vector2.one.toString());

		const mmm = new Tea.Matrix4();
		mmm.setColumn(0, new Tea.Vector4(1, 2, 3, 4));
		console.log(mm.mul(Tea.Vector4.one));
		*/

		const scene = this.app.createScene();
		//scene.camera.far = 10;
		//scene.camera.position.y = 2;
		//scene.camera.fov = 25;
		//scene.camera.fov = 20;
		//scene.camera.nearClipPlane = 2;
		//scene.camera.orthographic = true;
		//scene.camera.nearClipPlane = 2;
		//scene.camera.rotation.x = Tea.radians(20);
		//scene.camera.rotation.y = Tea.radians(20);
		//scene.camera.rotation.z = Tea.radians(20);
		//scene.camera.fieldOfView = 30;
		//scene.camera.rotation.z = Tea.radians(20);
		//scene.camera.position.x = 2;
		//scene.camera.position.z = -15;
		//scene.camera.fieldOfView = 30;
		//scene.camera.rect.x = 0.2;
		//scene.camera.rect.width = 0.5;
		//scene.camera.rect.y = 0.2;
		//scene.camera.rect.height = 0.6;
		//scene.camera.position.set(0, 10, 0);
		//scene.camera.rotation = Tea.Quaternion.euler(90,0,0);
		this.app.setScene(scene);

		var camera = this.app.createCamera();
		//camera.localPosition = new Tea.Vector3(0, 4, 0);
		//camera.localRotation = Tea.Quaternion.euler(90, 0, 0);
		scene.appendChild(camera);
		camera.addComponent(CameraRotate);

		/*
		var renderTexture = new Tea.RenderTexture(this.app);
		var camera2 = this.app.createCamera();
		camera2.getComponent(Tea.Camera).targetTexture = renderTexture;
		scene.appendChild(camera2);
		*/

		var camera2 = this.app.createLightCamera();
		camera2.localPosition = new Tea.Vector3(0, 5, 0);
		camera2.localRotation = Tea.Quaternion.euler(90, 0, 0);
		//var cam = camera2.getComponent(Tea.LightCamera);
		scene.appendChild(camera2);

		setTimeout(() => {
			//console.log("ray", scene.camera.screenPointToRay(new Tea.Vector3(100, 100)).toString());
			//console.log("ray2", scene.camera.viewportPointToRay(new Tea.Vector3(0.5, 0.5)).toString());
		}, 100);


		//console.log("camera", scene.camera.cameraToWorldMatrix.toString());
		//console.log("camera", scene.camera.worldToCameraMatrix.toString());
		//console.log("camera", scene.camera.projectionMatrix);

		//const script = new TestScript();

		const cube = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Cube);
		//cube.name = "cube";
		//cube.position.x = 2;
		cube.position.y = 2;
		//cube.position.z = -5;
		//cube.scale.y = -1;
		//cube.scale.z = -1;
		//cube.localRotation = Tea.Quaternion.euler(45, 0, 0);
		//cube.rotation.y = Tea.radians(20);
		//cube.addScript(new Rotate());
		//cube.getComponent(Tea.Renderer).material.mainTexture = renderTexture;
		scene.appendChild(cube);

		const cube2 = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Cube);
		cube2.position.x = 2;
		cube2.position.y = 2;
		//cube2.name = "cube2";
		//scene.appendChild(cube2);
		cube.appendChild(cube2);
		//cube2.localPosition = new Tea.Vector3(2, 0, 0);
		//cube2.rotation = Tea.Quaternion.euler(0,45,0);
		//cube.scale = new Tea.Vector3(2, 1, 1);
		//cube2.localPosition = new Tea.Vector3(2, 0, 0);
		//cube.rotate(45, 0, 0);
		//cube2.localPosition = new Tea.Vector3(0, 2, 0);

		const cube3 = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Cube);
		cube3.position.x = 4;
		cube3.position.y = 2;
		cube2.appendChild(cube3);

		//cube2.position = new Tea.Vector3(2, 0, 0);
		//cube.localScale = new Tea.Vector3(2, 1, 1);
		//cube.localRotation = Tea.Quaternion.euler(0, 80, 0);
		//cube.localPosition.z = 7;

		//cube2.position = new Tea.Vector3(2,2,0);
		//cube3.position = new Tea.Vector3(4,2,0);
		//cube.addComponent(Rotate);
		//cube2.addComponent(Rotate);
		//cube3.addComponent(Rotate);
		//cube2.localScale = new Tea.Vector3(2, 1, 1);

		console.log("cube2", cube2.localPosition);
		console.log("cube2", cube2.localScale);
		console.log("cube3", cube3.localPosition);

		const sphere = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Sphere);
		//cube2.name = "cube2";
		//sphere.position.x = 1.6;
		//sphere.position.y = 2;
		//sphere.position.z = 1.5;
		//sphere.addScript(script);
		//scene.appendChild(sphere);

		const quad = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Quad);
		//cube2.name = "cube2";
		//plain.position.z = 5;
		quad.position.y = 1;
		//plain.rotation.x = -Tea.radians(50);
		//plain.rotation.y = -Tea.radians(20);
		//plain.rotation.z = Tea.radians(60);
		quad.scale.x = 2;
		quad.scale.y = 2;
		//plain.addScript(script);
		quad.addComponent(Rotate);
		scene.appendChild(quad);
		//this.plain = quad;

		const cylinder = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Cylinder);
		//cylinder.renderer.wireframe = true;
		//cylinder.rotation.x = Tea.radians(30);
		//cylinder.addScript(script);
		//scene.appendChild(cylinder);

		//const plane = this.app.createQuad();
		const plane = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Plane);
		//plane.renderer.wireframe = true;
		//plane.position.z = -9;
		//plane.position.y = -2;
		plane.rotation.eulerAngles = new Tea.Vector3(-20, 0, 0);
		//plane.rotation.eulerAngles = new Tea.Vector3(20, 180, 0);
		//plane.addScript(script);
		//plane.scale.x = 10;
		//plane.scale.y = 10;
		//plane.rotation.x = Tea.radians(90);
		console.log("plane", plane.forward);
		console.log("plane", plane.up);
		console.log("plane", plane.right);
		plane.getComponent(Tea.MeshRenderer).receiveShadows = true;
		//plane.getComponent(Tea.Renderer).material.mainTexture = cam.targetTexture;
		//plane.scale.x = -1;
		scene.appendChild(plane);

		console.log("bounds", plane.getComponent(Tea.MeshFilter).mesh.bounds);

		const capsule = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Capsule);
		//capsule.renderer.wireframe = true;
		//capsule.position.x = 2;
		//capsule.position.y = 2;
		//capsule.position.z = 2;
		//capsule.scale.x = 2;
		//capsule.rotation.x = Tea.radians(90);
		capsule.addComponent(TestScript);
		scene.appendChild(capsule);

		//console.log("capsule", capsule.localToWorldMatrix.toString());

		//capsule.addComponent(Tea.Camera);
		//capsule.addComponent(Tea.MeshRenderer);
		//console.log("component", capsule.getComponent(Tea.Camera));

		const lines = this.app.createObject3D();
		const lineRenderer = lines.addComponent(Tea.LineRenderer);
		//lines.position.x = 3;
		lineRenderer.add(0, 0, 0);
		lineRenderer.add(2, 1, 0);
		lineRenderer.add(-2, 1, 3);
		lineRenderer.add(-3, 5, 0);
		lineRenderer.add(0, 0, 7);
		//lineRenderer.color = new Tea.Color(1, 0, 0, 1);
		lines.addComponent(TestScript2);
		capsule.appendChild(lines);
		//console.log("scale", lines.scale);
		//scene.appendChild(lines);


		var particles = this.app.createParticleSystem();
		//scene.appendChild(particles);


		var textmesh = this.app.createTextMesh();
		//var r = textmesh.getComponent(Tea.MeshRenderer);
		var meshFilter = textmesh.getComponent(Tea.MeshFilter);
		var mesh = meshFilter.mesh as Tea.TextMesh;
		mesh.characterSize = 0.3;
		mesh.fontSize = 20;
		//mesh.color = Tea.Color.red;
		//mesh.color = Tea.Color.black;
		//mesh.font = "Arial";
		//mesh.alignment = Tea.TextAlignment.Center;
		//mesh.anchor = Tea.TextAnchor.LowerRight;
		mesh.text = "Hello world\naあ";
		mesh.update();
		//textmesh.scale.x = 3.1;
		//textmesh.scale.y = 1.5;
		textmesh.position.y = 1;
		textmesh.position.z = -6;
		//document.body.appendChild(mesh.canvas);
		//scene.appendChild(textmesh);

		//var wp = camera.getComponent(Tea.Camera).viewportToWorldPoint(new Tea.Vector3(0, 0, 0));
		//var stats = this.app.createStats();
		//this.app.canvas.parentElement.appendChild(stats.canvas);

		let ray = new Tea.Ray(new Tea.Vector3(0, 1, 0), new Tea.Vector3(0.2, 0.3, 0.4));
		console.log("test", ray.direction, ray.getPoint(6.5), ray.getPoint(-6.5));

		let mt = Tea.MatrixChecker.translate();
		let mx = Tea.MatrixChecker.rotateX();
		let my = Tea.MatrixChecker.rotateY();
		let mz = Tea.MatrixChecker.rotateZ();
		let ms = Tea.MatrixChecker.scale();
		console.log("checker", mt.mul(my).mul(mx).mul(mz).mul(ms).toString());
		//console.log("ortho", Matrix4x4.ortho(5, 400, 10, 100, 0.3, 1000).toString());

		console.log("lookRotation", Tea.Quaternion.lookRotation(new Tea.Vector3(0.01, 1, 0).normalized));
		console.log("lookRotation", Tea.Quaternion.lookRotation(Tea.Vector3.up));
		console.log("lookRotation", Tea.Quaternion.lookRotation(Tea.Vector3.forward, Tea.Vector3.right.mul(2)));
		console.log("lookRotation", Tea.Quaternion.lookRotation(Tea.Vector3.forward, new Tea.Vector3(1,2)));

		var n = new Tea.Vector3(1,1,1);
		var t = new Tea.Vector3(0,-1,1);
		Tea.Vector3.orthoNormalize(n, t);
		console.log("ortho", n, t);

		///*
		this.app.start();

		this.app.readObjFile("../models/teapot/teapot.obj", (object3d) => {
			var scale = 0.04;
			object3d.localScale = new Tea.Vector3(scale, scale, scale);
			object3d.localPosition.z = -4;
			object3d.addComponent(Rotate);
			//scene.appendChild(object3d);
		});

		Tea.File.readImage("../models/google.jpg", (image) => {
			//document.body.appendChild(image);
			const texture = this.app.createTexture(image);
			//texture.filterMode = Tea.FilterMode.Bilinear;
			/*
			cube.renderer.shader.texture = texture;
			quad.renderer.shader.texture = texture;
			cylinder.renderer.shader.texture = texture;
			plane.renderer.shader.texture = texture;
			capsule.renderer.shader.texture = texture;
			*/
			let r = sphere.getComponent(Tea.Renderer);
			r.material.mainTexture = texture;
			r = cube.getComponent(Tea.Renderer);
			//r.material.mainTexture = texture;
			r = quad.getComponent(Tea.Renderer);
			//r.material.mainTexture = texture;
			r = cylinder.getComponent(Tea.Renderer);
			r.material.mainTexture = texture;
			r = plane.getComponent(Tea.Renderer);
			r.material.mainTexture = texture;
			r = capsule.getComponent(Tea.Renderer);
			r.material.mainTexture = texture;
		});

		Tea.File.readImage("../models/earth.jpg", (image) => {
			//document.body.appendChild(image);
			const texture = this.app.createTexture(image);
			//sphere.renderer.shader.texture = texture;
			//capsule.renderer.shader.texture = texture;
		});
		//*/

		var q1 = Tea.Quaternion.euler(90, 0, 45);
		var q2 = Tea.Quaternion.euler(45, -80, 50);
		console.log("Quaternion", q1.lerp(q2, 0.4).toString());
		console.log("Quaternion", q1.slerp(q2, 0.4).toString());
		console.log("Quaternion", q1.lerp(q2, 1.5).toString());
		console.log("Quaternion", q1.lerpUnclamped(q2, 1.5).toString());

		var q3 = Tea.Quaternion.euler(-170, 20, -30);
		q3.eulerAngles = new Tea.Vector3(45, 45, 45);
		var m1 = q3.toMatrix4x4();
		console.log("Quaternion 2", q3.toString());
		console.log("Quaternion 2", m1.toString());
		console.log("Quaternion 2", m1.toQuaternion().toString());

		//var p = new Tea.Plane(Tea.vec3(1,0,0), 0);
		//var p = new Tea.Plane(Tea.vec3(2,5,-3), 1);
		//var p = new Tea.Plane(Tea.vec3(2,6,-3), Tea.vec3(0,1,0));
		var p = new Tea.Plane(Tea.vec3(1, 0, 0), Tea.vec3(0, 1, 0), Tea.vec3(0, -1, 1));
		//p.setNormalAndPosition(Tea.vec3(2,6,-3), Tea.vec3(0,1,0));
		//var p = new Tea.Plane(Tea.vec3(0,1,0), 1);
		//console.log("plane", p.flipped.toString());
		//p.set3Points(Tea.vec3(1, 0, 0), Tea.vec3(0, 1, 0), Tea.vec3(0, -1, 1));
		//p.translate(Tea.vec3(2, 0, 0));
		console.log("plane", p.toString());
		//console.log("plane", p.distance);
		console.log("plane", p.closestPointOnPlane(Tea.vec3(1,1,1)));
		console.log("plane", p.getDistanceToPoint(Tea.vec3(-1,1,1)));
		console.log("plane", p.getDistanceToPoint(Tea.vec3()));
		console.log("plane", p.getSide(Tea.vec3(0, 1, 0)));

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
}
