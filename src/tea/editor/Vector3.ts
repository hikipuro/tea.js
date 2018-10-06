import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";

@Component({
	template: `
		<div class="Vector3">
			<template v-if="value">
				<div class="title">{{ text }}</div>
				<div class="value">
					X <input type="text" size="1" :value="x"></input>
					Y <input type="text" size="1" :value="y"></input>
					Z <input type="text" size="1" :value="z"></input>
				</div>
			</template>
		</div>
	`,
	props: {
		text: String,
		value: Array
	},
	data: () => {
		return {
			//text: "",
			//value: null
		}
	}
})
export class Vector3 extends Vue {
	text: string;
	value: Tea.Vector3;

	get x(): string {
		if (this.value == null) {
			return "";
		}
		return this.toText(this.value[0]);
	}

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
}
