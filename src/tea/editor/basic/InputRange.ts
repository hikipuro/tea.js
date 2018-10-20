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
					:value="value"
					@input="onInput"
					@change="onChange">
				</input>
				<input
					type="text"
					ref="text"
					size="1"
					:value="value">
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
}
