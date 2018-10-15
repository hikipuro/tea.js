import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { ComponentBase } from "./ComponentBase";

@Component({
	template: `
		<div
			class="Component Rigidbody">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled"
				@config="onClickConfig">{{ name }}</ComponentTitle>
		</div>
	`,
	data: () => {
		return {
			name: "Rigidbody",
		}
	}
})
export class Rigidbody extends ComponentBase {
	_component: Tea.Rigidbody;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
	}
}
