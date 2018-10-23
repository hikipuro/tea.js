import Vue from "vue";
import Component from "vue-class-component";
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
				:is="type"
				@update="onUpdate"
				@change="onChange"></component>
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
	type: Function;
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
		this.$emit("update", "enabled", value);
	}

	protected onClickConfig(): void {
		var component = this.$refs.component as any;
		this.$emit("config", component._component);
	}

	protected onUpdate(property: string, value: any): void {
		this.$emit("update", property, value);
	}

	protected onChange(property: string, value: any): void {
		var component = (this.$refs.component as any)._component;
		var type = null;
		if (component != null) {
			type = component.constructor;
		}
		this.$emit("change", type, property, value);
	}
}
