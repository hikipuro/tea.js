import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="TitleBar">
			<input
				ref="checkbox"
				type="checkbox"
				:checked="enabled"
				@change="onChange"></input>
			<div class="title"><slot></slot></div>
			<div
				ref="config"
				class="config"
				@click="onClickConfig">⚙️</div>
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
export class TitleBar extends Vue {
	enable: boolean;

	protected onChange(): void {
		var checkbox = this.$refs.checkbox as HTMLInputElement;
		this.$emit("update", checkbox.checked);
	}

	protected onClickConfig(): void {
		this.$emit("config");
	}
}