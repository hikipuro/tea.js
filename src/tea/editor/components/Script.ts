import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div
			class="Component Script">
			<div class="name">{{ name }}</div>
		</div>
	`,
	data: () => {
		return {
			name: "Script"
		}
	}
})
export class Script extends Vue {
	_component: Tea.Script;

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
