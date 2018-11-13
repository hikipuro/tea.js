import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="ClippingPlanes">
			<div
				class="title">
				<slot></slot>
			</div>
			<div class="value">
				<InputNumber :value="near" @update="onUpdateNear">{{ translator.near }}</InputNumber>
				<InputNumber :value="far" @update="onUpdateFar">{{ translator.far }}</InputNumber>
			</div>
		</div>
	`,
	props: {
		near: Number,
		far: Number
	},
	data: () => {
		return {
			translator: {}
		}
	},
})
export class ClippingPlanes extends Vue {
	translator: any;
	near: number;
	far: number;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Camera";
		this.translator.near = translator.getText("Near");
		this.translator.far = translator.getText("Far");
	}

	protected onUpdateNear(value: number): void {
		this.$emit("update", "near", value);
	}

	protected onUpdateFar(value: number): void {
		this.$emit("update", "far", value);
	}
}

@Component({
	template: `
		<div class="Camera">
			<SelectEnum
				ref="clearFlags"
				name="clearFlags"
				:keys="clearFlagsKeys"
				:value="clearFlags"
				@update="onUpdateClearFlags">{{ translator.clearFlags }}</SelectEnum>
			<ColorPicker
				ref="background"
				:value="background"
				@update="onUpdateBackground">{{ translator.background }}</ColorPicker>
			<CheckBox
				ref="orthographic"
				:value="orthographic"
				@update="onUpdateOrthographic">{{ translator.orthographic }}</CheckBox>
			<InputNumber
				v-if="orthographic"
				ref="size"
				class="Size"
				:value="size"
				@update="onUpdateSize">{{ translator.size }}</InputNumber>
			<InputRange
				v-else
				ref="fieldOfView"
				:min="1"
				:max="179"
				:value="fieldOfView"
				@update="onUpdateFov">{{ translator.fieldOfView }}</InputRange>
			<ClippingPlanes
				ref="clippingPlanes"
				:near="nearClipPlane"
				:far="farClipPlane"
				@update="onUpdateClippingPlanes">{{ translator.clippingPlanes }}</ClippingPlanes>
			<Rectangle
				ref="rect"
				:value="rect"
				@update="onUpdateRect">{{ translator.viewportRect }}</Rectangle>
			<InputRange
				ref="depth"
				:min="-100"
				:max="100"
				:value="depth"
				@update="onUpdateDepth">{{ translator.depth }}</InputRange>
			<CheckBox
				ref="enableStereo"
				:value="enableStereo"
				@update="onUpdateEnableStereo">{{ translator.enableStereo }}</CheckBox>
			<InputRange
				v-if="enableStereo"
				ref="stereoDistance"
				:min="-1"
				:max="1"
				:step="0.01"
				:value="stereoDistance"
				@update="onUpdateStereoDistance">{{ translator.stereoDistance }}</InputRange>
			<SelectEnum
				v-if="enableStereo"
				ref="stereoMode"
				name="stereoMode"
				:keys="stereoModeKeys"
				:value="stereoMode"
				@update="onUpdateStereoMode">{{ translator.stereoMode }}</SelectEnum>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Camera",
			enabled: false,
			clearFlagsKeys: [],
			clearFlags: "",
			background: "",
			orthographic: false,
			size: 0,
			fieldOfView: 0,
			nearClipPlane: 0,
			farClipPlane: 0,
			rect: [0, 0, 0, 0],
			depth: 0,
			enableStereo: false,
			stereoDistance: 0,
			stereoModeKeys: [],
			stereoMode: "",
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as Camera;
			self._component.enabled = value;
		}
	},
	components: {
		"ClippingPlanes": ClippingPlanes
	}
})
export class Camera extends Vue {
	_component: Tea.Camera;
	translator: any;
	name: string;
	enabled: boolean;
	clearFlagsKeys: Array<string>;
	clearFlags: string;
	background: string;
	orthographic: boolean;
	size: number;
	fieldOfView: number;
	nearClipPlane: number;
	farClipPlane: number;
	rect: Array<number>;
	depth: number;
	enableStereo: boolean;
	stereoDistance: number;
	stereoModeKeys: Array<string>;
	stereoMode: string;

	translate(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Camera";
		this.name = translator.getText("Title");
		this.translator.clearFlags = translator.getText("ClearFlags");
		this.translator.background = translator.getText("Background");
		this.translator.orthographic = translator.getText("Orthographic");
		this.translator.size = translator.getText("Size");
		this.translator.fieldOfView = translator.getText("FieldOfView");
		this.translator.clippingPlanes = translator.getText("ClippingPlanes");
		this.translator.near = translator.getText("Near");
		this.translator.far = translator.getText("Far");
		this.translator.viewportRect = translator.getText("ViewportRect");
		this.translator.depth = translator.getText("Depth");
		this.translator.enableStereo = translator.getText("EnableStereo");
		this.translator.stereoDistance = translator.getText("StereoDistance");
		this.translator.stereoMode = translator.getText("StereoMode");
		this.$forceUpdate();
	}

	protected created(): void {
		this.translate();
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.clearFlagsKeys = Tea.CameraClearFlags.getKeys();
		this.clearFlags = Tea.CameraClearFlags[component.clearFlags];
		this.background = component.backgroundColor.toCssColor();
		this.orthographic = component.orthographic;
		this.size = component.orthographicSize;
		this.fieldOfView = component.fieldOfView;
		this.nearClipPlane = component.nearClipPlane;
		this.farClipPlane = component.farClipPlane;
		this.rect = component.rect.clone();
		this.depth = component.depth;
		this.enableStereo = component.enableStereo;
		this.stereoDistance = component.stereoDistance;
		this.stereoModeKeys = Tea.CameraStereoMode.getKeys();
		this.$nextTick(() => {
			this.stereoMode = Tea.CameraStereoMode[component.stereoMode];
		});
	}

	protected onUpdateClearFlags(value: string): void {
		this.clearFlags = value;
		if (this._component) {
			this._component.clearFlags = Tea.CameraClearFlags[value];
		}
		this.$emit("update", "clearFlags");
	}

	protected onUpdateBackground(value: Tea.Color): void {
		//console.log("onUpdateBackground", value);
		this.background = value.toCssColor();
		if (this._component) {
			this._component.backgroundColor.copy(value);
		}
		this.$emit("update", "background");
	}

	protected onUpdateOrthographic(value: boolean): void {
		this.orthographic = value;
		if (this._component) {
			this._component.orthographic = value;
		}
		this.$emit("update", "orthographic");
	}

	protected onUpdateSize(value: number): void {
		this.size = value;
		if (this._component) {
			this._component.orthographicSize = value;
		}
		this.$emit("update", "size");
	}

	protected onUpdateFov(value: number): void {
		this.fieldOfView = value;
		if (this._component) {
			this._component.fieldOfView = value;
		}
		this.$emit("update", "fieldOfView");
	}

	protected onUpdateClippingPlanes(type: string, value: number): void {
		switch (type) {
			case "near":
				this.nearClipPlane = value;
				if (this._component) {
					this._component.nearClipPlane = value;
				}
				this.$emit("update", "nearClipPlane");
				break;
			case "far":
				this.farClipPlane = value;
				this._component.farClipPlane = value;
				this.$emit("update", "farClipPlane");
				break;
		}
	}

	protected onUpdateRect(value: Array<number>): void {
		this.rect = value;
		if (this._component) {
			this._component.rect.set(
				value[0], value[1], value[2], value[3]
			);
		}
		this.$emit("update", "rect");
	}

	protected onUpdateDepth(value: number): void {
		this.depth = value;
		if (this._component) {
			this._component.depth = value;
		}
		this.$emit("update", "depth");
	}

	protected onUpdateEnableStereo(value: boolean): void {
		this.enableStereo = value;
		if (this._component) {
			this._component.enableStereo = value;
		}
		this.$emit("update", "enableStereo");
		this.stereoMode = "";
		this.$nextTick(() => {
			if (this._component) {
				var mode = Tea.CameraStereoMode[this._component.stereoMode];
				this.stereoMode = mode;
			}
		});
	}

	protected onUpdateStereoDistance(value: number): void {
		this.stereoDistance = value;
		if (this._component) {
			this._component.stereoDistance = value;
		}
		this.$emit("update", "stereoDistance");
	}

	protected onUpdateStereoMode(value: string): void {
		this.stereoMode = value;
		if (this._component) {
			this._component.stereoMode = Tea.CameraStereoMode[value];
		}
		this.$emit("update", "stereoMode");
	}
}
