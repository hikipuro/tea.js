import * as Tea from "./tea/Tea";
import { TestScript } from "./TestScript";
import { TestScript2 } from "./TestScript2";
import { Rotate } from "./Rotate";
import { Matrix4x4 } from "./tea/math/Matrix4x4";

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

		window.addEventListener("resize", () => {
			this.app.canvas.width = document.body.clientWidth;
			this.app.canvas.height = document.body.clientHeight;
		});

		console.log("aspectRatio", this.app.aspectRatio);
		console.log("params", this.app.parameters);
		console.log("contextAttributes", this.app.contextAttributes);

		console.log("rect", (new Tea.Rect(10, 10, 100, 100).toString()));

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
			var m = new Matrix4x4();
			var m2 = new Matrix4x4();
			for (let i = 0; i < 16; i++) {
				var v = Math.random();
				m[i] = v;
				m2[i] = v;
			}
			const loop = 100;
			const count = 200;
			const test2 = Tea.benchmark(() => {
				for (var i = 0; i < loop; i++) {
					//m2.mul2(m2);
				}
			}, count);
			const test1 = Tea.benchmark(() => {
				for (var i = 0; i < loop; i++) {
					m.mul(m);
				}
			}, count);
			console.log("test1", test1);
			console.log("test2", test2, m2.toString());
		}, 1000);
		//*/

		let mm3 = Matrix4x4.identity;
		//mm3[1] = 2;
		//mm3 = mm3.mul(Matrix4x4.translate(1,2,3));
		//mm3 = mm3.mul(Matrix4x4.rotateZXY(
		//	new Tea.Vector3(Tea.radians(10), Tea.radians(20), Tea.radians(30))
		//));
		mm3 = Tea.Matrix4x4.perspective(60, 1, 0.3, 1000);
		console.log("mm34", mm3.toString(), mm3);
		console.log("mm34", mm3.m10);

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

		var l = new Tea.LineSegment();
		l.point.x = 1;
		l.point.y = 1;
		l.direction.x = 2;
		l.direction.y = 2;
		console.log("containsPoint", l.closestPoint(new Tea.Vector3(1, 4.5, 0)));
		//console.log("checker", v.dot());

		var t0 = new Tea.Vector3(1);
		var t1 = new Tea.Vector3(0, -1);
		var t2 = new Tea.Vector3(-1, -1);
		var p0 = new Tea.Vector3(0, -0.51, 0);

		var c0 = t1.sub(t0).cross(p0.sub(t1)).normalized;
		var c1 = t2.sub(t1).cross(p0.sub(t2)).normalized;
		var c2 = t0.sub(t2).cross(p0.sub(t0)).normalized;
		console.log("cross", c0.toString(), c1.toString(), c2.toString());

		var po = new Tea.Polygon();
		po.addPoint(1, 0, 0);
		po.addPoint(0, -1, 0);
		po.addPoint(-1, 0, 0);
		console.log("cross2", po.containsPoint(0.9, -0.01, 0));

		var l1 = new Tea.Line();
		l1.point.y = 1;
		l1.direction.x = 1;
		var l2 = new Tea.Line();
		l2.point.z = 0;
		l2.direction.z = 1;
		l2.direction.y = 1;
		console.log("distance", l1.distance(l2));

		//var q = new Tea.Quaternion(0.5, 0.5, -0.5, 0.5);
		var q = Tea.Quaternion.euler(89, -20, 60);
		console.log("Quaternion 1", Tea.Quaternion.euler(90, 0, 0));
		console.log("Quaternion 1", Tea.Quaternion.euler(90, 90, 0));
		console.log("Quaternion 1", Tea.Quaternion.euler(90, 90, 30));
		console.log("Quaternion 2", q.toString());
		console.log("Quaternion 3", q.eulerAngles);
		console.log("Quaternion 4", q.mul(new Tea.Vector3(2,0,4)));
		console.log("color", new Tea.Color(0.4, 0.4, 0.4).grayscale);

		var text = new Tea.TextMesh(this.app);
		document.body.appendChild(text.canvas);
		text.lineSpacing = 1;
		//text.fontStyle = Tea.FontStyle.Normal;
		//text.text = "aa\r\nBBB\ncc";
		text.fontSize = 30;
		text.text = "Hello world\nTest";
		//text.color = Tea.Color.red;
		//text.color.r = 1;
		text.update();
		//text.text = "test";
		/*
		var image = text.getImageData();
		for (var y = 0; y < image.height; y++) {
			for (var x = 0; x < image.width; x++) {
				var index = (y * image.width + x) * 4;
				var r = image.data[index];
				var g = image.data[index + 1];
				var bb = image.data[index + 2];
				var a = image.data[index + 3];
				console.log("image data", `${x}, ${y}`, r, g, bb, a);
			}
		}
		//*/
		//return;


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
		cube.position.z = -5;
		cube.scale.x = 2;
		//cube.scale.y = -1;
		//cube.scale.z = -1;
		cube.rotation = Tea.Quaternion.euler(0, 0, 90);
		//cube.rotation.y = Tea.radians(20);
		//cube.addScript(new Rotate());
		scene.appendChild(cube);

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
		quad.position.y = 1;
		//plain.rotation.x = -Tea.radians(50);
		//plain.rotation.y = -Tea.radians(20);
		//plain.rotation.z = Tea.radians(60);
		quad.scale.x = 2;
		quad.scale.y = 2;
		//plain.addScript(script);
		quad.addScript(new Rotate());
		scene.appendChild(quad);
		//this.plain = quad;

		const cylinder = this.app.createCylinder();
		//cylinder.renderer.wireframe = true;
		//cylinder.rotation.x = Tea.radians(30);
		//cylinder.addScript(script);
		//scene.appendChild(cylinder);

		//const plane = this.app.createQuad();
		const plane = this.app.createPlane();
		//plane.renderer.wireframe = true;
		//plane.position.z = -9;
		//plane.rotation.x = Tea.radians(90);
		//plane.addScript(script);
		//plane.scale.x = 10;
		//plane.scale.y = 10;
		//plane.rotation.x = Tea.radians(90);
		scene.appendChild(plane);

		const capsule = this.app.createCapsule();
		//capsule.renderer.wireframe = true;
		capsule.position.x = 2;
		capsule.position.y = 2;
		capsule.position.z = 2;
		//capsule.scale.x = 2;
		//capsule.rotation.x = Tea.radians(90);
		capsule.addScript(script);
		scene.appendChild(capsule);

		//console.log("capsule", capsule.localToWorldMatrix.toString());

		capsule.addComponent(Tea.Camera);
		//capsule.addComponent(Tea.MeshRenderer);
		console.log("component", capsule.getComponent(Tea.Camera));

		const lines = this.app.createObject3D();
		const lineRenderer = lines.addComponent(Tea.LineRenderer);
		//lines.position.x = 3;
		lineRenderer.add(0, 0, 0);
		lineRenderer.add(2, 1, 0);
		lineRenderer.add(-2, 1, 3);
		lineRenderer.add(-3, 5, 0);
		lineRenderer.add(0, 0, 7);
		//lineRenderer.color = new Tea.Color(1, 0, 0, 1);
		lines.addScript(new TestScript2());
		capsule.appendChild(lines);
		//scene.appendChild(lines);


		var textmesh = this.app.createTextMesh();
		var r = textmesh.getComponent(Tea.MeshRenderer);
		(r.mesh as Tea.TextMesh).fontSize = 40;
		//(r.mesh as Tea.TextMesh).color = Tea.Color.red;
		//(r.mesh as Tea.TextMesh).color = Tea.Color.black;
		(r.mesh as Tea.TextMesh).text = "Hello world\naあいうえお";
		textmesh.scale.x = 3.1;
		textmesh.scale.y = 1.5;
		textmesh.position.z = -6;
		//scene.appendChild(textmesh);

		var e = new Tea.EventDispatcher();
		e.setMaxListeners(0);
		var handler = (a) => {
			console.log("on event", a);
		};
		e.on("event", handler);
		e.once("event", (a) => {
			console.log("once event", a);
		});
		//e.removeListener("event", handler);
		e.emit("event2", "bbb", 2);
		//e.emit("event", "aaa", 2);
		e.emit("event", "bbb", 2);
		console.log("names", e.eventNames());
		console.log("count", e.listenerCount("event"));
		console.log("count", e.listenerCount(""));
		console.log("count", e.listenerCount("1"));
		console.log("count", e.listeners("1"));
		console.log("count", e.listeners("event"));

		let ray = new Tea.Ray(new Tea.Vector3(0, 1, 0), new Tea.Vector3(0.2, 0.3, 0.4));
		console.log("test", ray.direction, ray.getPoint(6.5), ray.getPoint(-6.5));

		let mt = Tea.MatrixChecker.translate();
		let mx = Tea.MatrixChecker.rotateX();
		let my = Tea.MatrixChecker.rotateY();
		let mz = Tea.MatrixChecker.rotateZ();
		let ms = Tea.MatrixChecker.scale();
		console.log("checker", mt.mul(my).mul(mx).mul(mz).mul(ms).toString());
		console.log("ortho", Matrix4x4.ortho(5, 400, 10, 100, 0.3, 1000).toString());

		console.log("lookRotation", Tea.Quaternion.lookRotation(Tea.Vector3.up));
		console.log("lookRotation", Tea.Quaternion.lookRotation(Tea.Vector3.forward));
		console.log("lookRotation", Tea.Quaternion.lookRotation(Tea.Vector3.forward, Tea.Vector3.right.mul(2)));
		console.log("lookRotation", Tea.Quaternion.lookRotation(Tea.Vector3.forward, new Tea.Vector3(1,2)));

		var n = new Tea.Vector3(1,1,1);
		var t = new Tea.Vector3(0,-1,1);
		Tea.Vector3.orthoNormalize(n, t);
		console.log("ortho", n, t);

		///*
		this.app.start();

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
			let r = cube.getComponent(Tea.Renderer);
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
