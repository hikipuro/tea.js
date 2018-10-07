import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="InputNumber">
			<div class="title">
				<slot></slot>
			</div>
			<input
				type="text"
				size="1"
				ref="text"
				:value="value"
				@change="onChange"
				@keydown="onKeyDown"
				@keyup="onKeyUp"
				@keypress="onKeyPress">
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
		}
	}
})
export class InputNumber extends Vue {
	value: number;
	protected _prev: number;

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
}
