import * as Tea from "./Tea";

export class Mouse {
	x: number = 0;
	y: number = 0;
	wheelX: number = 0;
	wheelY: number = 0;
	prevX: number = 0;
	prevY: number = 0;
	buttons: Array<boolean>;
	prevButtons: Array<boolean>;
	protected _app: Tea.App;
	protected _element: HTMLElement;
	protected _buttonCount: number = 5;
	protected _isMoved: boolean;
	protected _position: Tea.Vector3;
	protected _isPassiveSupported: boolean;

	constructor(app: Tea.App, element: HTMLElement) {
		this._app = app;
		this._element = element;
		this._isMoved = false;
		this._position = new Tea.Vector3();
		this._isPassiveSupported = false;
		this.checkPassiveSupported();
		this.addEvents(element);
		this.buttons = new Array(this._buttonCount);
		this.buttons.fill(false);
		this.prevButtons = Object.assign({}, this.buttons);
	}

	get element(): HTMLElement {
		return this._element;
	}
	set element(value: HTMLElement) {
		this.removeEvents(this._element);
		this._element = value;
		this.addEvents(value);
	}

	get isMoved(): boolean {
		return this.x !== this.prevX
			|| this.y !== this.prevY;
	}

	get position(): Tea.Vector3 {
		return this._position;
	}

	isDown(button: number): boolean {
		return this.buttons[button] === true
			&& this.prevButtons[button] === false;
	}

	isUp(button: number): boolean {
		return this.buttons[button] === false
			&& this.prevButtons[button] === true;
	}

	isHeld(button: number): boolean {
		return this.buttons[button] === true
			&& this.prevButtons[button] === true;
	}

	update(): void {
		this.prevX = this.x;
		this.prevY = this.y;
		this.wheelX = 0;
		this.wheelY = 0;
		this._isMoved = false;
		var length = this._buttonCount;
		for (var i = 0; i < length; i++) {
			this.prevButtons[i] = this.buttons[i];
		}
	}

	protected addEvents(element: HTMLElement): void {
		if (element == null) {
			return;
		}
		var options: AddEventListenerOptions = {
			capture: false
		};
		if (this._isPassiveSupported) {
			options.passive = true;
		}
		element.addEventListener("mousemove", this.onMouseMove, options);
		element.addEventListener("mousedown", this.onMouseDown, options);
		window.addEventListener("mouseup", this.onMouseUp, options);
		options.passive = false;
		element.addEventListener("wheel", this.onWheel, options);

		//element.addEventListener("mouseup", this.onMouseUp);
		//element.addEventListener("touchmove", this.onMouseMove);
		//element.addEventListener("touchstart", this.onMouseDown);
		//element.addEventListener("touchend", this.onMouseUp);
	}

	protected removeEvents(element: HTMLElement): void {
		if (element == null) {
			return;
		}
		element.removeEventListener("mousemove", this.onMouseMove);
		element.removeEventListener("mousedown", this.onMouseDown);
		window.removeEventListener("mouseup", this.onMouseUp);
		element.removeEventListener("wheel", this.onWheel);

		//element.removeEventListener("mouseup", this.onMouseUp);
		//element.removeEventListener("touchmove", this.onMouseMove);
		//element.removeEventListener("touchstart", this.onMouseDown);
		//element.removeEventListener("touchend", this.onMouseUp);
	}

	protected checkPassiveSupported(): void {
		try {
			var options = Object.defineProperty(
				{}, "passive", {
					get: () => {
						this._isPassiveSupported = true;
					}
				}
			);
			window.addEventListener("test", null, options);
		} catch(err) {}
	}

	protected onMouseMove = (e: MouseEvent): void => {
		if (this._isMoved) {
			return;
		}
		//e.stopPropagation();
		var width = this._app.width;
		var height = this._app.height;
		var clientWidth = this._element.clientWidth;
		var clientHeight = this._element.clientHeight;
		this.x = width * e.offsetX / clientWidth;
		this.y = height * (1.0 - (e.offsetY / clientHeight));
		this._position.set(this.x, this.y, 0);
		this._isMoved = true;
	}

	protected onMouseDown = (e: MouseEvent): void => {
		//e.preventDefault();
		//e.stopPropagation();
		this.buttons[e.button] = true;
	}

	protected onMouseUp = (e: MouseEvent): void => {
		//e.stopPropagation();
		this.buttons[e.button] = false;
	}

	protected onWheel = (e: WheelEvent): void => {
		e.preventDefault();
		this.wheelX = e.deltaX;
		this.wheelY = e.deltaY;
	}
}


export module Mouse {
	export class Button {
		static readonly Left: number = 0;
		static readonly Center: number = 1;
		static readonly Right: number = 2;
		static readonly BrowserBack: number = 3;
		static readonly BrowserForward: number = 4;
	}
}
