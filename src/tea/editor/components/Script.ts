import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { ComponentBase } from "./ComponentBase";

@Component({
	template: `
		<div
			class="Component Script">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled"
				@config="onClickConfig">{{ name }}</ComponentTitle>
		</div>
	`,
	data: () => {
		return {
			name: "Script",
		}
	}
})
export class Script extends ComponentBase {
	_component: Tea.Script;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.name = this._component.className + " (Script)";
	}
}
