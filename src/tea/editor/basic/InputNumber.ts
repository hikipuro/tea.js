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
				@change="onChange"
				@keydown="onKeyDown"
				@keyup="onKeyUp"
				@keypress="onKeyPress"
				@focus="onFocus">
			</input>
		</div>
	`,
	props: {
		value: Number,
		step: {
			type: Number,
			default: 0.03
		},
		min: {
			type: Number,
			default: Number.NEGATIVE_INFINITY
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
		value = Math.max(value, this.min);
		if (this._prev === value) {
			return;
		}
		this._prev = value;
		this.$emit("update", value);
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
		var value = this.value;
		switch (e.key) {
			case "ArrowUp":
				value++;
				value = Math.max(value, this.min);
				this.$emit("update", value);
				return;
			case "ArrowDown":
				value--;
				value = Math.max(value, this.min);
				this.$emit("update", value);
				return;
		}
	}

	protected onKeyUp(e: KeyboardEvent): void {
		this.update();
	}

	protected onKeyPress(e: KeyboardEvent): void {
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
		var el = this.$refs.text as HTMLInputElement;
		el.setSelectionRange(0, el.value.length);
	}

	protected onMouseDownTitle(e: MouseEvent): void {
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
		if (this.enablePointerLock) {
			this._mouseDownX += e.movementX;
			this._mouseDownY -= e.movementY;
			var x = this._mouseDownX;
			var y = this._mouseDownY;
			var value = this._mouseDownValue + (x + y) * this.step;
			value = Math.max(value, this.min);
			this._prev = value;
			this.$emit("update", value);
			return;
		}
		var x = e.screenX - this._mouseDownX;
		var y = this._mouseDownY - e.screenY;
		var value = this._mouseDownValue + (x + y) * this.step;
		value = Math.max(value, this.min);
		this._prev = value;
		this.$emit("update", value);
	}

	protected onMouseUpTitle(e: MouseEvent): void {
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
