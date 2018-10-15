import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { ComponentBase } from "./ComponentBase";

@Component({
	template: `
		<div
			class="Component Light">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled"
				@config="onClickConfig">{{ name }}</ComponentTitle>
		</div>
	`,
	data: () => {
		return {
			name: "Light",
		}
	}
})
export class Light extends ComponentBase {
	_component: Tea.Light;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
	}
}
