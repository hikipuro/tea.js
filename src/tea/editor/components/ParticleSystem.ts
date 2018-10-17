import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { ComponentBase } from "./ComponentBase";

@Component({
	template: `
		<div
			class="Component ParticleSystem">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled"
				@config="onClickConfig">{{ name }}</ComponentTitle>
		</div>
	`,
	data: () => {
		return {
			name: "ParticleSystem",
		}
	}
})
export class ParticleSystem extends ComponentBase {
	_component: Tea.ParticleSystem;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
	}
}
