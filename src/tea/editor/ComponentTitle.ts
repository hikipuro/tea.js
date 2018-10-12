import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div
			class="ComponentTitle">
			<input
				type="checkbox"
				ref="checkbox"
				:checked="enabled"
				@change="onChange"></input>
			<slot></slot>
		</div>
	`,
	props: {
		enabled: Boolean
	},
	data: () => {
		return {
		}
	}
})
export class ComponentTitle extends Vue {
	enable: boolean;

	protected onChange (): void {
		var checkbox = this.$refs.checkbox as HTMLInputElement;
		this.$emit("update", checkbox.checked);
	}
}
