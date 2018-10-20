import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="Vector3">
			<div class="title">
				<slot></slot>
			</div>
			<div class="value">
				<InputNumber
					:value="x"
					@update="onUpdateX"
					@change="onChangeX">X</InputNumber>
				<InputNumber
					:value="y"
					@update="onUpdateY"
					@change="onChangeY">Y</InputNumber>
				<InputNumber
					:value="z"
					@update="onUpdateZ"
					@change="onChangeZ">Z</InputNumber>
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
		z: {
			type: Number,
			default: 0
		}
	}
})
export class Vector3 extends Vue {
	x: number;
	y: number;
	z: number;

	protected onUpdateX(value: number): void {
		this.$emit("update", value, this.y, this.z);
	}

	protected onUpdateY(value: number): void {
		this.$emit("update", this.x, value, this.z);
	}

	protected onUpdateZ(value: number): void {
		this.$emit("update", this.x, this.y, value);
	}

	protected onChangeX(value: number): void {
		this.$emit("change", value, this.y, this.z);
	}

	protected onChangeY(value: number): void {
		this.$emit("change", this.x, value, this.z);
	}

	protected onChangeZ(value: number): void {
		this.$emit("change", this.x, this.y, value);
	}
}
