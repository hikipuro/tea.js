import * as Tea from "../Tea";

export class AppRenderer extends Tea.EventDispatcher {
	app: Tea.App;
	isStarted: boolean;
	isPaused: boolean;
	scene: Tea.Scene;
	keyboard: Tea.Keyboard;
	mouse: Tea.Mouse;
	gamepad: Tea.Gamepad;
	useKeyboard: boolean;
	useMouse: boolean;
	useGamepad: boolean;
	time: Tea.Time;
	runInBackground: boolean;
	protected _fps: number;
	protected _interval: number;
	protected _isSceneView: boolean;
	protected _lastTime: number;
	protected _update: FrameRequestCallback;
	protected _handle: number;

	constructor(app: Tea.App) {
		super();
		this.app = app;
		this.isStarted = false;
		this.isPaused = false;
		this.keyboard = new Tea.Keyboard(document.body);
		this.mouse = new Tea.Mouse(app, this.app.canvas);
		this.gamepad = new Tea.Gamepad();
		this.useKeyboard = true;
		this.useMouse = true;
		this.useGamepad = true;
		this.time = new Tea.Time();
		this.runInBackground = false;
		this._fps = 60.0;
		this._interval = 1000.0 / this._fps;
		this._isSceneView = false;
		this._lastTime = 0.0;
		this._update = this.update;
		this._handle = 0;
		this.initEvents();
		this.initScreen();
	}

	get fps(): number {
		return this._fps;
	}
	set fps(value: number) {
		this._fps = value;
		this._interval = 1000.0 / value;
	}

	get isSceneView(): boolean {
		return this._isSceneView;
	}
	set isSceneView(value: boolean) {
		if (this._isSceneView === value) {
			return;
		}
		this._isSceneView = value;
		if (value) {
			this._update = this.updateScene;
		} else {
			this._update = this.update;
		}
	}

	dispatchResizeEvent(): void {
		this.emit("resize");
	}

	start(): void {
		if (this.isStarted === true) {
			return;
		}
		this.isStarted = true;
		this.time.start();
		if (this.isPaused === false) {
			this._lastTime = performance.now();
			this._handle = requestAnimationFrame(this._update);
		}
	}

	stop(): void {
		if (this.isStarted === false) {
			return;
		}
		this.isStarted = false;
		if (this.isPaused === false) {
			cancelAnimationFrame(this._handle);
			this._handle = 0;
		}
	}

	protected initEvents(): void {
		window.addEventListener("blur", this.onWindowBlur);
		window.addEventListener("focus", this.onWindowFocus);
		window.addEventListener("resize", Tea.debounce(() => {
			this.dispatchResizeEvent();
		}, 250));
	}

	protected initScreen(): void {
		var gl = this.app.gl;
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		gl.enable(gl.SCISSOR_TEST);
		gl.scissor(0.0, 0.0, this.app.width, this.app.height);
		gl.clearStencil(0);
	}

	protected update = (time: number): void => {
		if (time < this._lastTime + this._interval) {
			this._handle = requestAnimationFrame(this._update);
			return;
		}
		this._lastTime += this._interval;
		//Tea.Vector3.newCount = 0;
		//Tea.Quaternion.newCount = 0;
		//Tea.Matrix4x4.newCount = 0;
		this.time.update();
		if (this.scene != null) {
			var isEditing = this.app.status.isEditing;
			this.scene.update(isEditing);
			if (this.useKeyboard) {
				this.keyboard.update();
			}
			if (this.useMouse) {
				this.mouse.update();
			}
			if (this.useGamepad) {
				this.gamepad.update();
			}
		}
		this.emit("update");
		this._handle = requestAnimationFrame(this._update);
		//console.log("Tea.Vector3.newCount", Tea.Vector3.newCount);
		//console.log("Tea.Quaternion.newCount", Tea.Quaternion.newCount);
		//console.log("Tea.Matrix4x4.newCount", Tea.Matrix4x4.newCount);
	}

	protected updateScene = (time: number): void => {
		if (time < this._lastTime + this._interval) {
			this._handle = requestAnimationFrame(this._update);
			return;
		}
		this._lastTime += this._interval;
		this.time.update();
		if (this.scene != null) {
			var isEditing = this.app.status.isEditing;
			this.scene.updateScene(isEditing);
			this.keyboard.update();
			this.mouse.update();
		}
		this.emit("update");
		this._handle = requestAnimationFrame(this._update);
	}

	protected onWindowBlur = (): void => {
		if (this.runInBackground) {
			return;
		}
		if (this.isStarted && this.isPaused === false) {
			cancelAnimationFrame(this._handle);
			this._handle = 0;
		}
		this.isPaused = true;
		this.emit("pause");
	}

	protected onWindowFocus = (): void => {
		if (this.runInBackground) {
			return;
		}
		if (this.isStarted && this.isPaused) {
			this._lastTime = performance.now();
			this._handle = requestAnimationFrame(this._update);
		}
		this.isPaused = false;
		this.emit("resume");
	}
}
