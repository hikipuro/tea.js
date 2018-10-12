import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div
			class="Component Script">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled">{{ name }}</ComponentTitle>
		</div>
	`,
	data: () => {
		return {
			name: "Script",
			enabled: false,
		}
	}
})
export class Script extends Vue {
	_component: Tea.Script;
	enabled: boolean;

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
}
