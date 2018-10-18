import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="Vector3">
			<div class="title">
				<slot></slot>
			</div>
			<div class="value">
				<InputNumber :value="x" @update="onUpdateX">X</InputNumber>
				<InputNumber :value="y" @update="onUpdateY">Y</InputNumber>
				<InputNumber :value="z" @update="onUpdateZ">Z</InputNumber>
			</div>
		</div>
	`,
	data: () => {
		return {
			x: 0,
			y: 0,
			z: 0
		};
	}
})
export class Vector3 extends Vue {
	x: number;
	y: number;
	z: number;

	protected onUpdateX(value: number): void {
		this.x = value;
		this.$emit("update", value, this.y, this.z);
	}

	protected onUpdateY(value: number): void {
		this.y = value;
		this.$emit("update", this.x, value, this.z);
	}

	protected onUpdateZ(value: number): void {
		this.z = value;
		this.$emit("update", this.x, this.y, value);
	}
}
