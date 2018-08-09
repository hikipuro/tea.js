import * as Tea from "./Tea";

export class Mouse {
	x: number = 0;
	y: number = 0;
	prevX: number = 0;
	prevY: number = 0;
	buttons: Array<boolean>;
	prevButtons: Array<boolean>;
	protected _app: Tea.App;
	protected _element: HTMLElement;
	protected _lastMoveTime: number = 0;

	constructor(app: Tea.App, element: HTMLElement) {
		this._app = app;
		this._element = element;
		this.addEvents(element);
		window.addEventListener("mouseup", this.onMouseUp);
		//window.addEventListener("touchend", this.onMouseUp);
		this.buttons = new Array(5);
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
		this.prevButtons = Object.assign({}, this.buttons);
	}

	protected addEvents(element: HTMLElement): void {
		if (element == null) {
			return;
		}
		element.addEventListener("mousemove", this.onMouseMove);
		element.addEventListener("mousedown", this.onMouseDown);
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
		//element.removeEventListener("mouseup", this.onMouseUp);

		//element.removeEventListener("touchmove", this.onMouseMove);
		//element.removeEventListener("touchstart", this.onMouseDown);
		//element.removeEventListener("touchend", this.onMouseUp);
	}

	protected onMouseMove = (e: MouseEvent): void => {
		//e.stopPropagation();
		const now = Tea.now();
		if (now <= this._lastMoveTime + 16) {
			return;
		}
		this._lastMoveTime = now;
		this.x = e.offsetX;
		this.y = this._app.height - (e.offsetY + 1);
	}

	protected onMouseDown = (e: MouseEvent): void => {
		e.preventDefault();
		e.stopPropagation();
		this.buttons[e.button] = true;
	}

	protected onMouseUp = (e: MouseEvent): void => {
		e.stopPropagation();
		this.buttons[e.button] = false;
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
