import Vue from "vue";
import Component from "vue-class-component";

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
		value: Number
	},
	computed: {
		/*
		v: function (): string {
			var item = this as InputNumber;
			if (item.value;
		}
		//*/
	},
	data: () => {
		return {
			step: 0.03,
			enablePointerLock: true
		}
	}
})
export class InputNumber extends Vue {
	value: number;
	step: number;
	enablePointerLock: boolean;
	protected _prev: number;
	protected _mouseDownValue: number;
	protected _mouseDownX: number;
	protected _mouseDownY: number;

	protected update(): void {
		var el = this.$refs.text as HTMLInputElement;
		var value = parseFloat(el.value);
		if (isNaN(value)) {
			this._prev = 0;
			this.$emit("update", 0);
			return;
		}
		if (this._prev === value) {
			return;
		}
		this._prev = value;
		this.$emit("update", value);
	}

	protected onChange(e: Event): void {
		this.update();
	}

	protected onKeyDown(e: KeyboardEvent): void {
		var value = this.value;
		switch (e.key) {
			case "ArrowUp":
				this.$emit("update", value + 1);
				return;
			case "ArrowDown":
				this.$emit("update", value - 1);
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
			this.$emit("update", value);
			return;
		}
		var x = e.screenX - this._mouseDownX;
		var y = this._mouseDownY - e.screenY;
		var value = this._mouseDownValue + (x + y) * this.step;
		this.$emit("update", value);
	}

	protected onMouseUpTitle(e: MouseEvent): void {
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
