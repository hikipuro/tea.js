import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="MeshRenderer">
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
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as MeshRenderer;
			self._component.enabled = value;
		}
	}
})
export class MeshRenderer extends Vue {
	_component: Tea.MeshRenderer;
	name: string;
	enabled: boolean;
	receiveShadows: boolean;
	wireframe: boolean;

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.wireframe = component.wireframe;
		this.receiveShadows = component.receiveShadows;
	}

	protected onUpdateReceiveShadows(value: boolean): void {
		this.receiveShadows = value;
		if (this._component) {
			this._component.receiveShadows = value;
		}
		this.$emit("update", "receiveShadows");
	}

	protected onUpdateWireframe(value: boolean): void {
		this.wireframe = value;
		if (this._component) {
			this._component.wireframe = value;
		}
		this.$emit("update", "wireframe");
	}
}
