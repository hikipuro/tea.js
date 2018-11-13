export class TeaGamepad {
	protected static readonly MaxIndex = 8;
	protected static readonly MaxButtons = 20;
	count: number;
	protected _table: {[key: number]: number};
	protected _pads: Array<Gamepad>;
	protected _assigns: Array<TeaGamepad.Assign>;
	protected _buttons: Array<Array<number>>;

	constructor() {
		this.count = 0;
		this.clear();
		window.addEventListener("gamepadconnected", this.onConnected);
		window.addEventListener("gamepaddisconnected", this.onDisconnected);
	}
	
	clear(): void {
		this._table = {};
		this._pads = [];
		this._assigns = [];
		this._buttons = [];
	}

	assign(index: number, assign: TeaGamepad.Assign): void {
		if (assign == null) {
			return;
		}
		var pads = this._pads;
		var assigns = this._assigns;
		if (pads[index] == null || assigns[index] == null) {
			return;
		}
		assigns[index] = assign;
	}

	axis(index: number, axis: string | number): number {
		var pads = this._pads;
		var pad = pads[index];
		if (pad == null) {
			return 0.0;
		}
		if (typeof axis === "string") {
			axis = this._assigns[index].axis(axis);
		}
		if (axis < 0) {
			return 0.0;
		}
		var a = pad.axes[axis];
		if (a == null) {
			return 0.0;
		}
		return a;
	}
	
	isDown(index: number, button: string | number): boolean {
		var pads = this._pads;
		if (pads[index] == null) {
			return false;
		}
		if (typeof button === "string") {
			button = this._assigns[index].button(button);
		}
		if (button < 0) {
			return false;
		}
		var value = pads[index].buttons[button].value;
		var prev = this._buttons[index][button];
		return value === 1 && prev === 0;
	}

	isUp(index: number, button: string | number): boolean {
		var pads = this._pads;
		if (pads[index] == null) {
			return false;
		}
		if (typeof button === "string") {
			button = this._assigns[index].button(button);
		}
		if (button < 0) {
			return false;
		}
		var value = pads[index].buttons[button].value;
		var prev = this._buttons[index][button];
		return value === 0 && prev === 1;
	}

	isHeld(index: number, button: string | number): boolean {
		var pads = this._pads;
		if (pads[index] == null) {
			return false;
		}
		if (typeof button === "string") {
			button = this._assigns[index].button(button);
		}
		if (button < 0) {
			return false;
		}
		var value = pads[index].buttons[button].value;
		var prev = this._buttons[index][button];
		return value === 1 && prev === 1;
	}

	update(): void {
		var pads = this._pads;
		var length = pads.length;
		for (var i = 0; i < length; i++) {
			var pad = pads[i];
			if (pad == null) {
				continue;
			}
			this.saveState(i, pad);
		}
		this.scan();
	}

	protected scan(): void {
		var pads = this._pads;
		var gamepads = navigator.getGamepads();
		var length = gamepads.length;
		for (var i = 0; i < length; i++) {
			var pad = gamepads[i];
			if (pad == null) {
				continue;
			}
			var index = this._table[pad.index];
			if (index == null) {
				continue;
			}
			pads[index] = pad;
		}
	}

	protected saveState(index: number, pad: Gamepad): void {
		var buttons = this._buttons[index];
		var padButtons = pad.buttons;
		var length = padButtons.length;
		for (var n = 0; n < length; n++) {
			buttons[n] = padButtons[n].value;
		}
	}

	protected onConnected = (e: GamepadEvent): void => {
		var pad = e.gamepad;
		var pads = this._pads;
		var index = this.count;
		this._table[pad.index] = index;
		pads.push(pad);
		this._assigns.push(TeaGamepad.XBox360Controller);
		this._buttons.push([]);
		var buttons = this._buttons[index];
		var length = pad.buttons.length;
		for (var i = 0; i < length; i++) {
			buttons.push(0);
		}
		this.count++;
	}

	protected onDisconnected = (e: GamepadEvent): void => {
		this.count--;
		var pad = e.gamepad;
		var pads = this._pads;
		var index = this._table[pad.index];
		delete this._table[pad.index];
		delete pads[index];
		delete this._assigns[index];
		delete this._buttons[index];
	}
}

export module TeaGamepad {
	export class Assign {
		protected _buttons: {[key: string]: number};
		protected _axes: {[key: string]: number};

		constructor(buttons: any = null, axes: any = null) {
			if (buttons == null) {
				buttons = {};
			}
			if (axes == null) {
				axes = {};
			}
			this._buttons = buttons;
			this._axes = axes;
		}

		assign(name: string, button: number): void {
			this._buttons[name] = button;
		}

		button(name: string): number {
			if (this._buttons[name] == null) {
				return -1;
			}
			return this._buttons[name];
		}

		axis(name: string): number {
			if (this._axes[name] == null) {
				return -1;
			}
			return this._axes[name];
		}
	}

	export const XBox360Controller: Assign = new TeaGamepad.Assign(
		{
			A: 0,
			B: 1,
			X: 2,
			Y: 3,
			LB: 4,
			RB: 5,
			LT: 6,
			RT: 7,
			Back: 8,
			Start: 9,
			LStick: 10,
			RStick: 11,
			Up: 12,
			Down: 13,
			Left: 14,
			Right: 15,
			Xbox: 16,
		}, {
			LX: 0,
			LY: 1,
			RX: 2,
			RY: 3,
		}
	);
}
