import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Material } from "./Material";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="MeshRenderer">
			<CheckBox
				ref="receiveShadows"
				:value="receiveShadows"
				@update="onUpdateReceiveShadows">{{ translator.receiveShadows }}</CheckBox>
			<CheckBox
				ref="wireframe"
				:value="wireframe"
				@update="onUpdateWireframe">{{ translator.wireframe }}</CheckBox>
			<Material
				ref="material"
				@update="onUpdateMaterial"></Material>
		</div>
	`,
	data: () => {
		return {
			translator: {},
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
	},
	components: {
		Material: Material
	}
})
export class MeshRenderer extends Vue {
	_component: Tea.MeshRenderer;
	translator: any;
	name: string;
	enabled: boolean;
	receiveShadows: boolean;
	wireframe: boolean;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/MeshRenderer";
		this.name = translator.getText("Title");
		this.translator.receiveShadows = translator.getText("ReceiveShadows");
		this.translator.wireframe = translator.getText("Wireframe");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.wireframe = component.wireframe;
		this.receiveShadows = component.receiveShadows;
		var material = this.$refs.material as Material;
		material.setMaterial(component.material);
		//material.$forceUpdate();
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

	protected onUpdateMaterial(name: string): void {
		this.$emit("update", name);
	}
}

Tea.MeshRenderer.editorView = MeshRenderer;
