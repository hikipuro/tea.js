import * as Electron from "electron";
import * as Tea from "./tea/Tea";
import { TestScript } from "./TestScript";
import { TestScript2 } from "./TestScript2";
import { Rotate } from "./Rotate";
import { CameraRotate } from "./CameraRotate";
import { HitTest } from "./HitTest";

import { Editor } from "./tea/editor/Editor";
import { LocalFile } from "./tea/editor/LocalFile";
import { EditorSceneLoader } from "./tea/editor/EditorSceneLoader";
var editor: Editor;

export class Main {
	app: Tea.App;
	renderer: Tea.Renderer;
	camera: Tea.Camera;
	texture: Tea.Texture;
	plain: Tea.Object3D;

	public count: number;

	constructor() {
		//console.log(Tea.App.systemLanguage);
		//console.log(Tea.App.absoluteURL);
		//console.log("devicePixelRatio", Tea.Screen.dpi);
		//console.log("width", Tea.Screen.width);
		//console.log("height", Tea.Screen.height);
		//console.log(Tea.Screen.fullscreen);
		console.log(Electron.remote.app.getGPUFeatureStatus());

		editor = Editor.instance;
		editor.$nextTick(this.startEditor);
	}

	startEditor = (): void => {
		var config = Electron.ipcRenderer.sendSync("getConfig");
		if (config.isDebug) {
			this.debug();
			return;
		}
		//this.debug();
		this.init();
	}

	init(): void {
		var app = new Tea.App("canvas", {
			antialias: false,
			alpha: false,
			//premultipliedAlpha: false
		});
		this.app = app;
		global["app"] = app;
		editor.setApp(app);
		app.status.isEditor = true;
		app.isEditing = true;
		app.enableUint32Index();
		app.width = app.canvas.parentElement.clientWidth;
		app.height = app.canvas.parentElement.clientHeight;

		var scenePath = "scene.json";
		var data = LocalFile.readText(scenePath);
		if (data == null) {
			console.log("error");
			this.setNewScene();
			app.start();
			return;
		}
		var json = JSON.parse(data);
		EditorSceneLoader.load(app, json, (scene: Tea.Scene) => {
			if (scene == null) {
				console.log("error: load scene", scenePath);
				this.setNewScene();
				app.start();
				return;
			}
			app.scene = scene;
			editor.setScene(scene);
			editor.status.scenePath = scenePath;
			app.start();
		});
	}

	setNewScene(): void {
		var app = this.app;
		var scene = app.createScene();
		var camera = app.createCamera();
		var light = app.createDirectionalLight();
		scene.addChild(camera);
		scene.addChild(light);
		app.scene = scene;
		editor.setScene(scene);
	}

	debug(): void {
		this.count = 0;
		var app = new Tea.App("canvas", {
			antialias: false,
			alpha: false,
			//premultipliedAlpha: false
		});
		this.app = app;
		global["app"] = this.app;
		editor.setApp(app);
		app.status.isEditor = true;
		app.isEditing = true;
		app.enableUint32Index();
		app.width = app.canvas.parentElement.clientWidth;
		app.height = app.canvas.parentElement.clientHeight;

		this.app.status.isEditor = true;
		this.app.isEditing = true;
		this.app.enableUint32Index();
		this.app.width = this.app.canvas.parentElement.clientWidth;
		this.app.height = this.app.canvas.parentElement.clientHeight;
		//this.app.setPixelRatio(window.devicePixelRatio);
		//this.app.canvas.style.background = "#000";
		//this.app.width = 400;
		//this.app.height = 400;
		//this.app.canvas.style.width = "100%";
		//this.app.canvas.width = document.body.clientWidth;
		//this.app.canvas.height = document.body.clientHeight;

		//this.app.renderer.on("resize", () => {
			//this.app.canvas.width = document.body.clientWidth;
			//this.app.canvas.height = document.body.clientHeight;
		//});

		//console.log("aspectRatio", this.app.aspectRatio);
		//console.log("params", this.app.parameters);
		//console.log("contextAttributes", this.app.contextAttributes);

		/*
		setTimeout(() => {
			let obj = [];
			for (let i = 0; i < 100000; i++) {
				obj[i] = i;
			}
			var count = 200;
			var test1 = Tea.benchmark(() => {
				let total = 0;
				for (let i = 0; i < obj.length; i++) {
					total += obj[i];
				}
				//console.log("total", total);
			}, count);
			var test2 = Tea.benchmark(() => {
				let total: number = 0;
				var l: number = obj.length;
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
			var loop = 100;
			var count = 200;
			/*
			var m1 = new Tea.Matrix4x4();
			var m2 = Tea.Matrix4x4.identity;
			var test1 = Tea.benchmark(() => {
				for (var i = 0; i < loop; i++) {
					m1.copy2(m2);
				}
			}, count);
			m1 = new Tea.Matrix4x4();
			m2 = Tea.Matrix4x4.identity;
			var test2 = Tea.benchmark(() => {
				for (var i = 0; i < loop; i++) {
					m1.copy(m2);
				}
			}, count);
			console.log("test1", test1);
			console.log("test2", test2);
			*/
		}, 1000);
		//*/

		//console.log("perspective");
		//console.log(Tea.Matrix4.perspective(60, 1, 0.3, 1000).toString());

		/*
		var mm = Tea.Matrix4.lookAt(new Tea.Vector3(10, 20, 30), new Tea.Vector3(3,2,1), Tea.Vector3.up);
		console.log("matrix",mm.toString());
		console.log(mm.inverse.toString());
		console.log((mm.mul(mm.inverse).toString()));
		console.log("v", Tea.Vector2.one.toString());

		var mmm = new Tea.Matrix4();
		mmm.setColumn(0, new Tea.Vector4(1, 2, 3, 4));
		console.log(mm.mul(Tea.Vector4.one));
		*/

		var scene = this.app.createScene();
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
		this.app.scene = scene;
		editor.setScene(scene);
		scene.enablePostProcessing = true;

		var light = this.app.createDirectionalLight();
		//light.getComponent(Tea.Light).color.set(1.0,0,0,1);
		//light.getComponent(Tea.Light).type = Tea.LightType.Point;
		//light.getComponent(Tea.Light).intensity = 0.5;
		//light.getComponent(Tea.Light).range = 1;
		light.localRotation = Tea.Quaternion.euler(90, 0, 0);
		//light.localPosition = light.localRotation.mul(new Tea.Vector3(0,0,-1)).mul(10);
		console.log("light", light.localPosition);
		//light.addComponent(Rotate);
		scene.addChild(light);

		var light2 = this.app.createDirectionalLight();
		light2.getComponent(Tea.Light).type = Tea.LightType.Point;
		light2.getComponent(Tea.Light).color.set(1, 0, 0, 1);
		//light2.getComponent(Tea.Light).intensity = 10;
		//light2.getComponent(Tea.Light).range = 10;
		light2.localPosition.set(3, 5, 0);
		//light2.localRotation = Tea.Quaternion.euler(90, 0, 0);
		//scene.appendChild(light2);

		/*
		var light3 = this.app.createLight();
		light3.getComponent(Tea.Light).type = Tea.LightType.Point;
		light3.getComponent(Tea.Light).color.set(0,1,0,1);
		light3.getComponent(Tea.Light).intensity = 3;
		light3.getComponent(Tea.Light).range = 1;
		light3.localPosition.set(-5, 3, 0);
		light3.localRotation = Tea.Quaternion.euler(30, 60, 0);
		scene.appendChild(light3);

		var light4 = this.app.createLight();
		light4.getComponent(Tea.Light).type = Tea.LightType.Point;
		light4.getComponent(Tea.Light).color.set(0,0,1,1);
		light4.getComponent(Tea.Light).intensity = 3;
		light4.getComponent(Tea.Light).range = 1;
		light4.localPosition.set(0, 3, -5);
		light4.localRotation = Tea.Quaternion.euler(30, 60, 0);
		scene.appendChild(light4);
		*/

		var camera = this.app.createCamera();
		camera.getComponent(Tea.Camera).clearFlags = Tea.CameraClearFlags.Skybox;
		//camera.getComponent(Tea.Camera).orthographic = true;
		//camera.getComponent(Tea.Camera).orthographicSize = 5;
		//camera.localPosition = new Tea.Vector3(0, 4, 0);
		//camera.localRotation = Tea.Quaternion.euler(90, 0, 0);
		scene.addChild(camera);
		//camera.addComponent(CameraRotate);

		/*
		var renderTexture = new Tea.RenderTexture(this.app);
		var camera2 = this.app.createCamera();
		camera2.getComponent(Tea.Camera).targetTexture = renderTexture;
		scene.appendChild(camera2);
		*/

		var camera2 = this.app.createShadowMapCamera();
		camera2.localPosition = light.localPosition.clone();
		camera2.localRotation = light.localRotation.clone();
		//var cam = camera2.getComponent(Tea.LightCamera);
		scene.addChild(camera2);
		//camera2.removeComponent(camera2.getComponent(Tea.Camera));

		setTimeout(() => {
			//console.log("ray", scene.camera.screenPointToRay(new Tea.Vector3(100, 100)).toString());
			//console.log("ray2", scene.camera.viewportPointToRay(new Tea.Vector3(0.5, 0.5)).toString());
		}, 100);


		//console.log("camera", scene.camera.cameraToWorldMatrix.toString());
		//console.log("camera", scene.camera.worldToCameraMatrix.toString());
		//console.log("camera", scene.camera.projectionMatrix);

		//var script = new TestScript();

		var skybox = scene.renderSettings.skybox;
		skybox.front.load("../models/skybox/Sunny_01A_front.jpg");
		skybox.back.load("../models/skybox/Sunny_01A_back.jpg");
		skybox.up.load("../models/skybox/Sunny_01A_up.jpg");
		skybox.down.load("../models/skybox/Sunny_01A_down.jpg");
		skybox.left.load("../models/skybox/Sunny_01A_left.jpg");
		skybox.right.load("../models/skybox/Sunny_01A_right.jpg");

		var cube = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Cube);
		//cube.name = "cube";
		cube.position.set(0, 2, 0);
		//cube.position.z = 5;
		//cube.scale.y = -1;
		//cube.scale.x = 1.4;
		//cube.localRotation = Tea.Quaternion.euler(45, 0, 0);
		//cube.rotation.y = Tea.radians(20);
		cube.addComponent(Rotate);
		//cube.getComponent(Tea.Renderer).material.mainTexture = renderTexture;
		var box2 = cube.addComponent(Tea.BoxCollider);
		box2.size = cube.getComponent(Tea.MeshFilter).mesh.bounds.size.clone();
		scene.addChild(cube);

		this.app.audio.volume = 0.5;
		var audioSource = cube.addComponent(Tea.AudioSource);
		var sound = new Tea.AudioClip(this.app);
		sound.load("./media/jump01.mp3", (err) => {
			if (err) {
				return;
			}
			var count = 0;
			audioSource.clip = sound;
			audioSource.play();
			setInterval(() => {
				count++;
				this.app.audio.pan = Math.sin(count);
				audioSource.play();
			}, 1000);
		});

		var cube2 = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Cube);
		cube2.position.x = 2;
		cube2.position.y = 3;
		cube2.rotation.rotateEuler(40,0,0);
		cube2.scale.set(2,1,1);
		//cube2.name = "cube2";
		//scene.appendChild(cube2);
		//scene.appendChild(cube2);
		cube2.getComponent(Tea.MeshRenderer).receiveShadows = true;
		cube2.parent = cube;
		//cube.translate(-4,0,0);
		//cube.rotate(0, 45, 0);
		//cube.scale.set(1,1,1);
		console.log(cube2.localPosition);
		console.log(cube2.localEulerAngles);
		console.log(cube2.localScale);
		//cube2.addComponent(HitTest);
		//var box2 = cube2.addComponent(Tea.BoxCollider);
		//box2.size = cube2.getComponent(Tea.MeshFilter).mesh.bounds.size;
		//cube2.localPosition = new Tea.Vector3(2, 0, 0);
		//cube2.rotation = Tea.Quaternion.euler(0,45,0);
		//cube.scale = new Tea.Vector3(2, 1, 1);
		//cube2.localPosition = new Tea.Vector3(2, 0, 0);
		//cube.rotate(45, 0, 0);
		//cube2.localPosition = new Tea.Vector3(0, 2, 0);

		var cube3 = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Cube);
		cube3.position.x = 4;
		cube3.position.y = 2;
		cube3.parent = cube2;

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

		//console.log("cube2", cube2.localPosition);
		//console.log("cube2", cube2.localScale);
		//console.log("cube3", cube3.localPosition);
		//*/

		var sphere = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Sphere);
		//cube2.name = "cube2";
		//sphere.position.x = 1.6;
		//sphere.position.y = 2;
		//sphere.position.z = 1.5;
		//sphere.addScript(script);
		//scene.appendChild(sphere);

		var quad = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Quad);
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
		scene.addChild(quad);
		//this.plain = quad;
		//cube2.parent = quad;
		console.log(cube2.localPosition);
		console.log(cube2.localEulerAngles);
		console.log(cube2.localScale);

		console.log(quad.find("Cube"));
		console.log(cube3.getSiblingIndex());
		console.log(cube3.isChildOf(quad));
		console.log(cube3.isChildOf(cube2));
		console.log(cube3.isChildOf(cube));
		console.log(cube2.isChildOf(quad));
		console.log(cube2.isChildOf(cube));

		var cylinder = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Cylinder);
		//cylinder.renderer.wireframe = true;
		//cylinder.rotation.x = Tea.radians(30);
		//cylinder.addScript(script);
		//scene.appendChild(cylinder);

		//var plane = this.app.createQuad();
		var plane = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Plane);
		//plane.renderer.wireframe = true;
		//plane.position.z = 1;
		//plane.position.y = -2;
		//plane.rotation.eulerAngles = new Tea.Vector3(-20, 0, 0);
		plane.rotation.eulerAngles = new Tea.Vector3(20, 180, 0);
		//plane.addScript(script);
		//plane.scale.x = 10;
		//plane.scale.y = 10;
		//plane.rotation.x = Tea.radians(90);
		console.log("plane", plane.forward);
		console.log("plane", plane.up);
		console.log("plane", plane.right);
		//plane.getComponent(Tea.MeshRenderer).receiveShadows = true;
		//plane.getComponent(Tea.MeshRenderer).material.mainTexture = camera2.getComponent(Tea.LightCamera).targetTexture;
		//plane.scale.x = -1;
		/*
		var ps = plane.getComponent(Tea.Renderer).material.shader;
		ps.settings.enableStencilTest = true;
		ps.settings.stencil.func = Tea.ShaderTestFunc.Always;
		ps.settings.stencil.ref = 1;
		ps.settings.stencil.fail = Tea.ShaderStencilOp.Keep;
		ps.settings.stencil.zfail = Tea.ShaderStencilOp.Replace;
		ps.settings.stencil.zpass = Tea.ShaderStencilOp.Replace;
		*/
		
		plane.addComponent(HitTest);
		var rigidbody = plane.addComponent(Tea.Rigidbody);
		//rigidbody.useGravity = false;
		//rigidbody.drag = 10;
		rigidbody.addForce(1, 0, 0, Tea.ForceMode.VelocityChange);
		//rigidbody.addTorque(new Tea.Vector3(10, 10, 10));
		//rigidbody.constraints |= Tea.RigidbodyConstraints.FreezePositionX;
		var box = plane.addComponent(Tea.BoxCollider);
		box.size = plane.getComponent(Tea.MeshFilter).mesh.bounds.size;
		console.log("box.size", box.size);
		scene.addChild(plane);

		console.log("bounds", plane.getComponent(Tea.MeshFilter).mesh.bounds);

		var capsule = Tea.Object3D.createPrimitive(this.app, Tea.PrimitiveType.Capsule);
		//capsule.renderer.wireframe = true;
		//capsule.position.x = 2;
		//capsule.position.y = 2;
		//capsule.position.z = 2;
		//capsule.scale.x = 2;
		capsule.rotation = Tea.Quaternion.euler(0, 0, 45);
		/*
		console.log("extension", this.app.isExtensionSupported(Tea.GLExtensions.OES_standard_derivatives));
		this.app.getExtension(Tea.GLExtensions.OES_standard_derivatives);
		var s = new Tea.Shader(this.app);
		s.attach(
			Tea.Shader.flatVertexShaderSource,
			Tea.Shader.flatFragmentShaderSource
		);
		capsule.getComponent(Tea.Renderer).material.shader = s;
		*/
		/*
		var cs = capsule.getComponent(Tea.Renderer).material.shader;
		cs.settings.enableStencilTest = false;
		cs.settings.stencil.func = Tea.ShaderTestFunc.Equal;
		cs.settings.stencil.ref = 1;
		cs.settings.stencil.fail = Tea.ShaderStencilOp.Keep;
		cs.settings.stencil.zfail = Tea.ShaderStencilOp.Keep;
		cs.settings.stencil.zpass = Tea.ShaderStencilOp.Keep;
		*/
		var box1 = capsule.addComponent(Tea.BoxCollider);
		box1.size = capsule.getComponent(Tea.MeshFilter).mesh.bounds.size.clone();
		capsule.addComponent(TestScript).cube = cube;
		scene.addChild(capsule);

		//console.log("capsule", capsule.localToWorldMatrix.toString());

		//capsule.addComponent(Tea.Camera);
		//capsule.addComponent(Tea.MeshRenderer);
		//console.log("component", capsule.getComponent(Tea.Camera));

		var lines = this.app.createObject3D();
		var lineRenderer = lines.addComponent(Tea.LineRenderer);
		lineRenderer.material = Tea.Material.getDefault(this.app);
		//lines.position.x = 3;
		lineRenderer.add(0, 0, 0);
		lineRenderer.add(2, 1, 0);
		lineRenderer.add(-2, 1, 3);
		lineRenderer.add(-3, 5, 0);
		lineRenderer.add(0, 0, 7);
		//lineRenderer.color = new Tea.Color(1, 0, 0, 1);
		lines.addComponent(TestScript2);
		lines.parent = capsule;
		//console.log("scale", lines.scale);
		//scene.appendChild(lines);


		var particles = this.app.createParticleSystem();
		var ps = particles.getComponent(Tea.ParticleSystem);
		ps.main.loop = true;
		//ps.main.maxParticles = 10000;
		ps.emission.rateOverTime = new Tea.ParticleSystem.MinMaxCurve(60);
		//ps.emission.rateOverTimeMultiplier = 1;
		//ps.shape.angle = 0;
		ps.shape.arcMode = Tea.ParticleSystemShapeMultiModeValue.Loop;
		//ps.main.startSize.constant = 2;
		//ps.main.gravityModifier.constant = 0.2;
		//ps.velocityOverLifetime.enabled = true;
		ps.velocityOverLifetime.x.constant = 1;
		ps.colorOverLifetime.enabled = true;
		//ps.colorOverLifetime.color.mode = Tea.ParticleSystemGradientMode.RandomColor;
		//console.log("ps.colorOverLifetime.color.mode", ps.colorOverLifetime.color.mode);
		ps.colorOverLifetime.color.gradient.setKeys([
			new Tea.GradientColorKey(Tea.Color.blue, 0),
			new Tea.GradientColorKey(Tea.Color.red, 0.1),
			new Tea.GradientColorKey(Tea.Color.yellow, 0.5),
			new Tea.GradientColorKey(Tea.Color.white, 1)
		], [
			new Tea.GradientAlphaKey(1, 0),
			new Tea.GradientAlphaKey(0, 1)
		]);
		//ps.main.startSize = new Tea.ParticleSystem.MinMaxCurve(10, Tea.AnimationCurve.easeInOut(0, 0, 1, 1));
		//ps.main.startSpeed = 2;
		//ps.main.startSize = 0.5;
		//scene.addChild(particles);
		//ps.start();

		var curve = Tea.AnimationCurve.easeInOut(0, 3, 1, 5);
		console.log(curve);
		var curve2 = new Tea.AnimationCurve();
		//curve2.addKey(0, 1);
		curve2.addKey(3, 2);
		//curve2.addKey(1, 1);
		console.log(curve.evaluate(0.1));
		console.log(curve.evaluate(0.2));
		console.log(curve.evaluate(0.3));
		console.log(curve.evaluate(0.4));
		console.log(curve.evaluate(0.5));

		var g = new Tea.Gradient();
		g.mode = Tea.GradientMode.Blend;
		g.setKeys([
			new Tea.GradientColorKey(Tea.Color.black, 0),
			new Tea.GradientColorKey(Tea.Color.white, 1)
		], [
			new Tea.GradientAlphaKey(0, 0),
			new Tea.GradientAlphaKey(1, 1)
		]);
		console.log("Gradient", g.evaluate(2));
		console.log("Gradient", g.evaluate(0.1));


		var textmesh = this.app.createTextMesh();
		//var r = textmesh.getComponent(Tea.MeshRenderer);
		var mesh = textmesh.getComponent(Tea.TextMesh);
		//var mesh = meshFilter.mesh as Tea.TextMesh;
		mesh.color.set(1,1,1,1);
		mesh.characterSize = 0.1;
		mesh.fontSize = 100;
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
		textmesh.addComponent(TestScript2);
		scene.addChild(textmesh);

		//var wp = camera.getComponent(Tea.Camera).viewportToWorldPoint(new Tea.Vector3(0, 0, 0));
		//var stats = this.app.createStats();
		//this.app.canvas.parentElement.appendChild(stats.canvas);

		var ray = new Tea.Ray(new Tea.Vector3(0, 1, 0), new Tea.Vector3(0.2, 0.3, 0.4));
		console.log("test", ray.direction, ray.getPoint(6.5), ray.getPoint(-6.5));

		///*
		this.app.start();

		var objList = [
			{
				path: "../models/teapot/teapot.obj",
				scale: 0.04
			},
			{
				path: "../models/bunny.obj",
				scale: 2
			},
			{
				path: "../models/dragon.obj",
				scale: 4
			},
			{
				path: "../models/CornellBox/CornellBox-Original.obj",
				scale: 2
			},
			{
				path: "../models/bedroom/iscv2.obj",
				scale: 2
			}
		];
		var objIndex = 2;
		/*
		this.app.readObjFile(objList[objIndex].path, (object3d) => {
			var scale = objList[objIndex].scale;
			object3d.localScale = new Tea.Vector3(scale, scale, scale);
			object3d.localPosition.z = -4;
			object3d.addComponent(Rotate);
			scene.addChild(object3d);
		});
		//*/

		Tea.File.readImage("../models/texture.png", (err, image) => {
			var texture = this.app.createTexture(image);
			let r = plane.getComponent(Tea.Renderer);
			r.material.setTexture("_NormalTex", texture);
			r = capsule.getComponent(Tea.Renderer);
			r.material.setTexture("_NormalTex", texture);
		});

		var texture = new Tea.Texture(this.app);
		texture.load("../models/google.jpg", (err, url) => {
			if (err) {
				return;
			}
		//Tea.File.readImage("./models/google.jpg", (err, image) => {
			//document.body.appendChild(image);
			//var texture = this.app.createTexture(image);
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
			//r = cube.getComponent(Tea.Renderer);
			//r.material.mainTexture = texture;
			r = quad.getComponent(Tea.Renderer);
			//r.material.mainTexture = texture;
			r = cylinder.getComponent(Tea.Renderer);
			r.material.mainTexture = texture;
			r = plane.getComponent(Tea.Renderer);
			//r.material.mainTexture = texture;
			r = capsule.getComponent(Tea.Renderer);
			r.material.mainTexture = texture;
		});

		Tea.File.readImage("../models/earth.jpg", (err, image) => {
			//document.body.appendChild(image);
			var texture = this.app.createTexture(image);
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

		var canvasObject = app.createCanvas();
		scene.addChild(canvasObject);

		var text = canvasObject.find("Text").getComponent(Tea.UI.Text);
		//var canvas = text.canvas;
		//canvas.style.top = "0";
		//canvas.style.position = "fixed";
		//document.body.appendChild(canvas);

		//var json = JSON.stringify(scene.toJSON(), null, 2);
		//console.log(json, json.length);

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

		//Tea.File.readImage("./teapot/default.png", (image) => {
		Tea.File.readImage("./models/google.jpg", (image) => {
			//document.body.appendChild(image);
			var texture = this.app.createTexture(image);
			this.texture = texture;
			this.start();
		});

		Tea.File.readText("models/cube.dae", (data) => {
			var mesh = Tea.DaeReader.read(data);
		});

		var v3 = new Tea.Vector3(-2, -3, -4);
		console.log(v3.magnitude);
		*/
	}
}

var main: Main = null;
var loaded = () => {
	document.removeEventListener(
		"DOMContentLoaded", loaded
	);
	main = new Main();
};
document.addEventListener(
	"DOMContentLoaded", loaded
);
