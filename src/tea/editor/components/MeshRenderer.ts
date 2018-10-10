import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div
			class="Component MeshRenderer">
			<div class="name">{{ name }}</div>
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
			receiveShadows: true,
			wireframe: false
		}
	}
})
export class MeshRenderer extends Vue {
	_component: Tea.MeshRenderer;
	receiveShadows: boolean;
	wireframe: boolean;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.wireframe = component.wireframe;
		this.receiveShadows = component.receiveShadows;
	}

	protected destroyed(): void {
		this._component = undefined;
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
