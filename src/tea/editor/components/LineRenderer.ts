import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div
			class="Component LineRenderer">
			<div class="name">{{ name }}</div>
		</div>
	`,
	data: () => {
		return {
			name: "LineRenderer"
		}
	}
})
export class LineRenderer extends Vue {
	_component: Tea.LineRenderer;

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
