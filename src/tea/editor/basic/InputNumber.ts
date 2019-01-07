import Vue from "vue";
import Component from "vue-class-component";

declare global {
	interface HTMLElement {
		requestPointerLock(): void;
	}
	interface Document {
		exitPointerLock(): void;
	}
}

@Component({
	template: `
		<div class="InputNumber">
			<div
				ref="title"
				class="title"
				@mousedown="onMouseDownTitle">
				<slot></slot>
			</div>
			<input
				ref="text"
				type="text"
				size="1"
				:value="value"
				:disabled="disabled"
				@change="onChange"
				@keydown="onKeyDown"
				@keyup="onKeyUp"
				@keypress="onKeyPress"
				@focus="onFocus">
			</input>
		</div>
	`,
	props: {
		value: {
			type: Number,
			default: 0
		},
		step: {
			type: Number,
			default: 0.03
		},
		min: {
			type: Number,
			default: Number.NEGATIVE_INFINITY
		},
		max: {
			type: Number,
			default: Number.POSITIVE_INFINITY
		},
		disabled: {
			type: Boolean,
			default: false
		},
		enablePointerLock: {
			type: Boolean,
			default: true
		}
	}
})
export class InputNumber extends Vue {
	value: number;
	step: number;
	min: number;
	max: number;
	disabled: boolean;
	enablePointerLock: boolean;
	protected _prev: number;
	protected _mouseDownValue: number;
	protected _mouseDownX: number;
	protected _mouseDownY: number;

	protected update(): void {
		var el = this.$refs.text as HTMLInputElement;
		var text = el.value;
		if (text === "-0" || text === "-0.") {
			return;
		}
		var value = parseFloat(text);
		if (isNaN(value)) {
			return;
		}
		value = this.clampValue(value);
		if (this._prev === value) {
			return;
		}
		this._prev = value;
		this.$emit("update", value);
	}

	protected clampValue(value: number): number {
		value = Math.max(value, this.min);
		return Math.min(value, this.max);
	}

	protected onChange(e: Event): void {
		var el = this.$refs.text as HTMLInputElement;
		var value = parseFloat(el.value);
		if (isNaN(value)) {
			el.value = "0";
		} else {
			el.value = String(value);
		}
		this.update();
		this.$emit("change", this._prev);
	}

	protected onKeyDown(e: KeyboardEvent): void {
		if (this.disabled) {
			return;
		}
		var value = this.value;
		switch (e.key) {
			case "ArrowUp":
				value++;
				value = this.clampValue(value);
				this.$emit("update", value);
				return;
			case "ArrowDown":
				value--;
				value = this.clampValue(value);
				this.$emit("update", value);
				return;
		}
	}

	protected onKeyUp(e: KeyboardEvent): void {
		if (this.disabled) {
			return;
		}
		this.update();
	}

	protected onKeyPress(e: KeyboardEvent): void {
		if (this.disabled) {
			return;
		}
		if (e.type === "paste") {
			e.returnValue = false;
			e.preventDefault();
			return;
		}
		var regex = /[0-9]|\.|\-/;
		if (!regex.test(e.key)) {
			e.returnValue = false;
			e.preventDefault();
			return;
		}
	}

	protected onFocus(e: FocusEvent): void {
		if (this.disabled) {
			return;
		}
		var el = this.$refs.text as HTMLInputElement;
		el.setSelectionRange(0, el.value.length);
	}

	protected onMouseDownTitle(e: MouseEvent): void {
		if (this.disabled) {
			return;
		}
		this._mouseDownValue = this.value;
		if (this.enablePointerLock) {
			document.addEventListener("mousemove", this.onMouseMoveTitle);
			window.addEventListener("mouseup", this.onMouseUpTitle);
			this._mouseDownX = 0;
			this._mouseDownY = 0;
			var el = this.$refs.title as HTMLElement;
			el.requestPointerLock();
			return;
		}
		window.addEventListener("mousemove", this.onMouseMoveTitle);
		window.addEventListener("mouseup", this.onMouseUpTitle);
		this._mouseDownX = e.screenX;
		this._mouseDownY = e.screenY;
	}

	protected onMouseMoveTitle(e: MouseEvent): void {
		if (this.disabled) {
			return;
		}
		if (this.enablePointerLock) {
			this._mouseDownX += e.movementX;
			this._mouseDownY -= e.movementY;
			var x = this._mouseDownX;
			var y = this._mouseDownY;
			var value = this._mouseDownValue + (x + y) * this.step;
			var v = this.clampValue(value);
			if (v !== value) {
				this._mouseDownX -= e.movementX;
				this._mouseDownY += e.movementY;
			}
			this._prev = v;
			this.$emit("update", v);
			return;
		}
		var x = e.screenX - this._mouseDownX;
		var y = this._mouseDownY - e.screenY;
		var value = this._mouseDownValue + (x + y) * this.step;
		value = this.clampValue(value);
		this._prev = value;
		this.$emit("update", value);
	}

	protected onMouseUpTitle(e: MouseEvent): void {
		if (this.disabled) {
			return;
		}
		this.$emit("change", this.value);
		if (this.enablePointerLock) {
			document.removeEventListener("mousemove", this.onMouseMoveTitle);
			window.removeEventListener("mouseup", this.onMouseUpTitle);
			document.exitPointerLock();
			return;
		}
		window.removeEventListener("mousemove", this.onMouseMoveTitle);
		window.removeEventListener("mouseup", this.onMouseUpTitle);
	}
}
