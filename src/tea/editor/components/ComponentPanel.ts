import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { TitleBar } from "./TitleBar";

@Component({
	template: `
		<div class="ComponentPanel">
			<TitleBar
				:enabled="enabled"
				@update="onUpdateEnabled"
				@config="onClickConfig">{{ name }}</TitleBar>
			<component
				ref="component"
				:is="type"></component>
		</div>
	`,
	props: {
		type: Function
	},
	data: () => {
		return {
			name: "Component",
			enabled: false,
		}
	},
	components: {
		TitleBar: TitleBar
	}
})
export class ComponentPanel extends Vue {
	name: string;
	enabled: boolean;

	protected mounted(): void {
		this.updateTitleBar();
	}

	protected updated(): void {
		this.updateTitleBar();
	}

	protected updateTitleBar(): void {
		var component = this.$refs.component as Vue;
		this.name = component.$data.name;
		this.enabled = component.$data.enabled;
	}

	protected onUpdateEnabled(value: boolean): void {
		this.enabled = value;
		var component = this.$refs.component as Vue;
		component.$data.enabled = value;
	}

	protected onClickConfig(): void {
		var component = this.$refs.component as any;
		this.$emit("config", component._component);
	}
}
