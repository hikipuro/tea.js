import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div
			class="Component Rigidbody">
			<div class="name">{{ name }}</div>
		</div>
	`,
	data: () => {
		return {
			name: "Rigidbody"
		}
	}
})
export class Rigidbody extends Vue {
	_component: Tea.Rigidbody;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
	}

	protected destroyed(): void {
		this._component = undefined;
	}
}
