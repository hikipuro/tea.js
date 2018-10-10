import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div
			class="Component BoxCollider">
			<div class="name">{{ name }}</div>
		</div>
	`,
	data: () => {
		return {
			name: "BoxCollider"
		}
	}
})
export class BoxCollider extends Vue {
	_component: Tea.BoxCollider;

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
