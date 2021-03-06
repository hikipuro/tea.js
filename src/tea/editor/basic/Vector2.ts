import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="Vector2">
			<div
				ref="title"
				class="title">
				<slot></slot>
			</div>
			<div class="value">
				<InputNumber
					:value="x"
					:step="step"
					:min="min"
					:max="max"
					:disabled="disabled"
					@update="onUpdateX"
					@change="onChangeX">X</InputNumber>
				<InputNumber
					:value="y"
					:step="step"
					:min="min"
					:max="max"
					:disabled="disabled"
					@update="onUpdateY"
					@change="onChangeY">Y</InputNumber>
			</div>
		</div>
	`,
	props: {
		x: {
			type: Number,
			default: 0
		},
		y: {
			type: Number,
			default: 0
		},
		step: {
			type: Number,
			default: 0.03
		},
		min: {
			type: Number,
			default: -Infinity
		},
		max: {
			type: Number,
			default: Infinity
		},
		disabled: {
			type: Boolean,
			default: false
		}
	}
})
export class Vector2 extends Vue {
	x: number;
	y: number;

	protected onUpdateX(value: number): void {
		this.$emit("update", value, this.y);
	}

	protected onUpdateY(value: number): void {
		this.$emit("update", this.x, value);
	}

	protected onChangeX(value: number): void {
		this.$emit("change", value, this.y);
	}

	protected onChangeY(value: number): void {
		this.$emit("change", this.x, value);
	}
}
