import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="ColorPicker">
			<div
				class="title">
				<slot></slot>
			</div>
			<input
				type="color"
				ref="color"
				:value="value"
				@change="onChange"></input>
		</div>
	`,
	props: {
		value: String
	}
})
export class ColorPicker extends Vue {
	protected onChange (): void {
		var color = this.$refs.color as HTMLInputElement;
		this.$emit("update", color.value);
	}
}
