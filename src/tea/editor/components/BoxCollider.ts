import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { ComponentBase } from "./ComponentBase";

@Component({
	template: `
		<div
			class="Component BoxCollider">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled"
				@config="onClickConfig">{{ name }}</ComponentTitle>
		</div>
	`,
	data: () => {
		return {
			name: "BoxCollider",
		}
	}
})
export class BoxCollider extends ComponentBase {
	_component: Tea.BoxCollider;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
	}
}
