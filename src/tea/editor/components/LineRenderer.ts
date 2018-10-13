import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div
			class="Component LineRenderer">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled"
				@config="onClickConfig">{{ name }}</ComponentTitle>
		</div>
	`,
	data: () => {
		return {
			name: "LineRenderer",
			enabled: false,
		}
	}
})
export class LineRenderer extends Vue {
	_component: Tea.LineRenderer;
	enabled: boolean;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
	}

	protected destroyed(): void {
		this._component = undefined;
	}

	protected onUpdateEnabled(value: boolean): void {
		this.enabled = value;
		if (this._component) {
			this._component.enabled = value;
		}
	}

	protected onClickConfig(): void {
		this.$emit("config", this._component);
	}
}
