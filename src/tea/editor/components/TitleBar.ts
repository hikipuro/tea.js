import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="TitleBar">
			<input
				ref="checkbox"
				type="checkbox"
				v-if="enabled != null"
				:checked="enabled"
				@change="onChange"></input>
			<div
				class="spacer"
				v-if="enabled == null"></div>
			<div
				class="title"
				@click="onClickTitle"><slot></slot></div>
			<div
				v-if="enableConfig"
				ref="config"
				class="config"
				@click="onClickConfig">⚙️</div>
		</div>
	`,
	props: {
		enabled: {
			type: Boolean,
			default: null
		},
		enableConfig: {
			type: Boolean,
			default: true
		}
	}
})
export class TitleBar extends Vue {
	enabled: boolean;

	protected onChange(): void {
		var checkbox = this.$refs.checkbox as HTMLInputElement;
		this.$emit("update", checkbox.checked);
	}

	protected onClickTitle(e: MouseEvent): void {
		this.$emit("clickTitle", e);
	}

	protected onClickConfig(e: MouseEvent): void {
		this.$emit("config", e);
	}
}
