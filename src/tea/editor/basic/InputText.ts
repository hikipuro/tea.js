import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="InputText">
			<div
				ref="title"
				class="title">
				<slot></slot>
			</div>
			<input
				type="text"
				ref="text"
				:value="value"
				@input="onInput"
				@change="onChange"
				@focus="onFocus">
			</input>
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

	protected onFocus(e: FocusEvent): void {
		var el = this.$refs.text as HTMLInputElement;
		el.setSelectionRange(0, el.value.length);
	}
}
