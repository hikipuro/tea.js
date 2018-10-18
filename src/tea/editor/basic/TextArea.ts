import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="TextArea">
			<div
				ref="title"
				class="title">
				<slot></slot>
			</div>
			<textarea
				ref="text"
				rows="3"
				:value="value"
				@input="onInput"></textarea>
		</div>
	`,
	props: {
		value: {
			type: String,
			default: ""
		}
	},
	data: () => {
		return {
		}
	}
})
export class TextArea extends Vue {
	value: string;

	onInput(e: Event): void {
		var text = this.$refs.text as HTMLTextAreaElement;
		this.$emit("update", text.value);
	}
}
