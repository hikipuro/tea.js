import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div
			class="Component Light">
			<div class="name">{{ name }}</div>
		</div>
	`,
	data: () => {
		return {
			name: "Light"
		}
	}
})
export class Light extends Vue {
	_component: Tea.Light;

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
