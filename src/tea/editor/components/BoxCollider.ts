import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

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
			enabled: false,
		}
	}
})
export class BoxCollider extends Vue {
	_component: Tea.BoxCollider;
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
