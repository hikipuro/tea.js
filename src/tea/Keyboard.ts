
export class Keyboard {
	protected _element: HTMLElement;
	protected _keys: object;
	protected _prevKeys: object;

	constructor(element: HTMLElement) {
		this._element = element;
		this.addEvents(element);
		window.addEventListener("blur", this.onWindowBlur);
		this.clear();
	}

	get element(): HTMLElement {
		return this._element;
	}
	set element(value: HTMLElement) {
		this.removeEvents(this._element);
		this._element = value;
		this.addEvents(value);
	}

	clear(): void {
		this._keys = {};
		this._prevKeys = Object.assign({}, this._keys);
	}

	isDown(keyCode: string): boolean {
		if (this._prevKeys[keyCode] == null) {
			if (this._keys[keyCode] == null) {
				return false;
			}
			return this._keys[keyCode];
		}
		return this._prevKeys[keyCode] === false
			&& this._keys[keyCode] === true;
	}

	isUp(keyCode: string): boolean {
		if (this._prevKeys[keyCode] == null) {
			return false;
		}
		return this._prevKeys[keyCode] === true
			&& this._keys[keyCode] === false;
	}

	isHeld(keyCode: string): boolean {
		if (this._prevKeys[keyCode] == null) {
			return false;
		}
		return this._prevKeys[keyCode] === true
			&& this._keys[keyCode] === true;
	}

	update(): void {
		for (var key in this._keys) {
			this._prevKeys[key] = this._keys[key];
		}
		//this._prevKeys = Object.assign({}, this._keys);
	}

	protected addEvents(element: HTMLElement): void {
		if (element == null) {
			return;
		}
		element.addEventListener("keydown", this.onKeyDown);
		element.addEventListener("keyup", this.onKeyUp);
	}

	protected removeEvents(element: HTMLElement): void {
		if (element == null) {
			return;
		}
		element.removeEventListener("keydown", this.onKeyDown);
	}

	protected onWindowBlur = () => {
		Object.keys(this._keys).forEach((key: string) => {
			this._keys[key] = false;
		});
		//this.clear();
	}

	protected onKeyDown = (e: KeyboardEvent) => {
		this._keys[e.code] = true;
	}

	protected onKeyUp = (e: KeyboardEvent) => {
		this._keys[e.code] = false;
	}
}

export module Keyboard {
	export class Codes {
		static readonly Backspace: string = "Backspace";
		static readonly Delete: string = "Delete";
		static readonly Tab: string = "Tab";
		static readonly Escape: string = "Escape";
		static readonly Space: string = "Space";
		static readonly ArrowUp: string = "ArrowUp";
		static readonly ArrowDown: string = "ArrowDown";
		static readonly ArrowLeft: string = "ArrowLeft";
		static readonly ArrowRight: string = "ArrowRight";
		static readonly Home: string = "Home";
		static readonly End: string = "End";
		static readonly PageUp: string = "PageUp";
		static readonly PageDown: string = "PageDown";

		static readonly F1: string = "F1";
		static readonly F2: string = "F2";
		static readonly F3: string = "F3";
		static readonly F4: string = "F4";
		static readonly F5: string = "F5";
		static readonly F6: string = "F6";
		static readonly F7: string = "F7";
		static readonly F8: string = "F8";
		static readonly F9: string = "F9";
		static readonly F10: string = "F10";
		static readonly F11: string = "F11";
		static readonly F12: string = "F12";
		static readonly F13: string = "F13";
		static readonly F14: string = "F14";
		static readonly F15: string = "F15";

		static readonly Digit0: string = "Digit0";
		static readonly Digit1: string = "Digit1";
		static readonly Digit2: string = "Digit2";
		static readonly Digit3: string = "Digit3";
		static readonly Digit4: string = "Digit4";
		static readonly Digit5: string = "Digit5";
		static readonly Digit6: string = "Digit6";
		static readonly Digit7: string = "Digit7";
		static readonly Digit8: string = "Digit8";
		static readonly Digit9: string = "Digit9";

		static readonly KeyA: string = "KeyA";
		static readonly KeyB: string = "KeyB";
		static readonly KeyC: string = "KeyC";
		static readonly KeyD: string = "KeyD";
		static readonly KeyE: string = "KeyE";
		static readonly KeyF: string = "KeyF";
		static readonly KeyG: string = "KeyG";
		static readonly KeyH: string = "KeyH";
		static readonly KeyI: string = "KeyI";
		static readonly KeyJ: string = "KeyJ";
		static readonly KeyK: string = "KeyK";
		static readonly KeyL: string = "KeyL";
		static readonly KeyM: string = "KeyM";
		static readonly KeyN: string = "KeyN";
		static readonly KeyO: string = "KeyO";
		static readonly KeyP: string = "KeyP";
		static readonly KeyQ: string = "KeyQ";
		static readonly KeyR: string = "KeyR";
		static readonly KeyS: string = "KeyS";
		static readonly KeyT: string = "KeyT";
		static readonly KeyU: string = "KeyU";
		static readonly KeyV: string = "KeyV";
		static readonly KeyW: string = "KeyW";
		static readonly KeyX: string = "KeyX";
		static readonly KeyY: string = "KeyY";
		static readonly KeyZ: string = "KeyZ";

		static readonly CapsLock: string = "CapsLock";
		static readonly ControlLeft: string = "ControlLeft";
		static readonly ControlRight: string = "ControlRight";
		static readonly ShiftLeft: string = "ShiftLeft";
		static readonly ShiftRight: string = "ShiftRight";
		static readonly Enter: string = "Enter";
		static readonly MetaLeft: string = "MetaLeft";
		static readonly MetaRight: string = "MetaRight";
		static readonly AltLeft: string = "AltLeft";
		static readonly AltRight: string = "AltRight";
	};
}
