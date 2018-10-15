import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div
			class="Component MeshFilter">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled"
				@config="onClickConfig">{{ name }}</ComponentTitle>
		</div>
	`,
	data: () => {
		return {
			name: "MeshFilter",
			enabled: false
		}
	}
})
export class MeshFilter extends Vue {
	_component: Tea.MeshFilter;
	enabled: boolean;
	receiveShadows: boolean;
	wireframe: boolean;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
	}

	protected destroyed(): void {
		this._component = undefined;
	}

	protected onUpdateEnabled(value: boolean): void {
		this.enabled = value;
		if (this._component) {
			this._component.enabled = value;
		}
	}

	protected onClickConfig(): void {
		this.$emit("config", this._component);
	}
}
