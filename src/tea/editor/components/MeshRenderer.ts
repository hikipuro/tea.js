import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div
			class="Component MeshRenderer">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled"
				@config="onClickConfig">{{ name }}</ComponentTitle>
			<CheckBox
				ref="receiveShadows"
				:value="receiveShadows"
				@update="onUpdateReceiveShadows">ReceiveShadows</CheckBox>
			<CheckBox
				ref="wireframe"
				:value="wireframe"
				@update="onUpdateWireframe">Wireframe</CheckBox>
		</div>
	`,
	data: () => {
		return {
			name: "MeshRenderer",
			enabled: false,
			receiveShadows: true,
			wireframe: false
		}
	}
})
export class MeshRenderer extends Vue {
	_component: Tea.MeshRenderer;
	enabled: boolean;
	receiveShadows: boolean;
	wireframe: boolean;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.wireframe = component.wireframe;
		this.receiveShadows = component.receiveShadows;
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

	protected onUpdateReceiveShadows(value: boolean): void {
		this.receiveShadows = value;
		if (this._component) {
			this._component.receiveShadows = value;
		}
	}

	protected onUpdateWireframe(value: boolean): void {
		this.wireframe = value;
		if (this._component) {
			this._component.wireframe = value;
		}
	}
}
