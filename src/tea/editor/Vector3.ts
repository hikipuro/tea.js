import Vue from "vue";
import Component from "vue-class-component";
//import * as Tea from "../Tea";

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
	props: {
		text: String,
		x: Number,
		y: Number,
		z: Number
	}
})
export class Vector3 extends Vue {
	text: string;
	x: number;
	y: number;
	z: number;

	/*
	get y(): string {
		if (this.value == null) {
			return "";
		}
		return this.toText(this.value[1]);
	}

	get z(): string {
		if (this.value == null) {
			return "";
		}
		return this.toText(this.value[2]);
	}

	protected toText(value: number): string {
		var text = value.toFixed(5).replace(/\.0+$/, "");
		if (text.indexOf(".") < 0) {
			if (text == "-0") {
				return "0";
			}
			return text;
		}
		text = text.replace(/0+$/, "");
		return text;
	}
	*/

	protected onUpdateX(value: number): void {
		this.$emit("update", value, this.y, this.z);
	}

	protected onUpdateY(value: number): void {
		this.$emit("update", this.x, value, this.z);
	}

	protected onUpdateZ(value: number): void {
		this.$emit("update", this.x, this.y, value);
	}
}
