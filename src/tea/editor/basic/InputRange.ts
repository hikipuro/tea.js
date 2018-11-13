import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="InputRange">
			<div class="title">
				<slot></slot>
			</div>
			<div
				class="value">
				<input
					type="range"
					ref="range"
					:min="min"
					:max="max"
					:step="step"
					:value="value"
					@input="onInput"
					@change="onChange">
				</input>
				<input
					type="text"
					ref="text"
					size="1"
					:value="value"
					@focus="onFocus"
					@blur="onBlur"
					@keyup="onKeyUp"
					@keypress="onKeyPress">
				</input>
			</div>
		</div>
	`,
	props: {
		min: {
			type: Number,
			default: -100
		},
		max: {
			type: Number,
			default: 100
		},
		step: {
			type: Number,
			default: 1
		},
		value: {
			type: Number,
			default: 0
		}
	}
})
export class InputRange extends Vue {
	min: number;
	max: number;
	value: number;

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
		value = Math.min(value, this.max);
		//el.value = String(value);
		this.$emit("update", value);
	}

	protected onInput(e: Event): void {
		var el = this.$refs.range as HTMLInputElement;
		var value = parseFloat(el.value);
		this.$emit("update", value);
	}

	protected onChange(e: Event): void {
		var el = this.$refs.range as HTMLInputElement;
		var value = parseFloat(el.value);
		this.$emit("update", value);
	}

	protected onFocus(e: FocusEvent): void {
		var el = this.$refs.text as HTMLInputElement;
		el.setSelectionRange(0, el.value.length);
	}

	protected onBlur(): void {
		var range = this.$refs.range as HTMLInputElement;
		var text = this.$refs.text as HTMLInputElement;
		text.value = range.value;
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
