import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="InputText">
			<div class="title">
				<slot></slot>
			</div>
			<div class="value">
				<input
					type="text"
					ref="text"
					:value="value"
					@input="onInput"
					@change="onChange">
				</input>
			</div>
		</div>
	`,
	props: {
		value: {
			type: String,
			default: ""
		}
	}
})
export class InputText extends Vue {
	value: string;

	protected onInput(e: Event): void {
		//console.log("onInput");
		var el = this.$refs.text as HTMLInputElement;
		this.$emit("update", el.value);
	}

	protected onChange(e: Event): void {
		//console.log("onChange");
		var el = this.$refs.text as HTMLInputElement;
		this.$emit("update", el.value);
	}
}
