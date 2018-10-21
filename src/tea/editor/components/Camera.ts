import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="ClippingPlanes">
			<div
				class="title">
				<slot></slot>
			</div>
			<div class="value">
				<InputNumber :value="near" @update="onUpdateNear">Near</InputNumber>
				<InputNumber :value="far" @update="onUpdateFar">Far</InputNumber>
			</div>
		</div>
	`,
	props: {
		near: Number,
		far: Number
	}
})
export class ClippingPlanes extends Vue {
	near: number;
	far: number;

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
				@update="onUpdateClearFlags">Clear Flags</SelectEnum>
			<ColorPicker
				ref="background"
				:value="background"
				@update="onUpdateBackground">Background</ColorPicker>
			<CheckBox
				ref="orthographic"
				:value="orthographic"
				@update="onUpdateOrthographic">Orthographic</CheckBox>
			<InputNumber
				v-if="orthographic"
				ref="size"
				class="Size"
				:value="size"
				@update="onUpdateSize">Size</InputNumber>
			<InputRange
				v-else
				ref="fieldOfView"
				:min="1"
				:max="179"
				:value="fieldOfView"
				@update="onUpdateFov">Field of View</InputRange>
			<ClippingPlanes
				ref="clippingPlanes"
				:near="nearClipPlane"
				:far="farClipPlane"
				@update="onUpdateClippingPlanes">Clipping Planes</ClippingPlanes>
			<Rectangle
				ref="rect"
				:value="rect"
				@update="onUpdateRect">Viewport Rect</Rectangle>
			<InputRange
				ref="depth"
				:min="-100"
				:max="100"
				:value="depth"
				@update="onUpdateDepth">Depth</InputRange>
		</div>
	`,
	data: () => {
		return {
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
			depth: 0
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
	}

	protected onUpdateClearFlags(value: string): void {
		this.clearFlags = value;
		if (this._component) {
			this._component.clearFlags = Tea.CameraClearFlags[value];
		}
	}

	protected onUpdateBackground(value: Tea.Color): void {
		//console.log("onUpdateBackground", value);
		this.background = value.toCssColor();
		if (this._component) {
			this._component.backgroundColor.copy(value);
		}
	}

	protected onUpdateOrthographic(value: boolean): void {
		this.orthographic = value;
		if (this._component) {
			this._component.orthographic = value;
		}
	}

	protected onUpdateSize(value: number): void {
		this.size = value;
		if (this._component) {
			this._component.orthographicSize = value;
		}
	}

	protected onUpdateFov(value: number): void {
		this.fieldOfView = value;
		if (this._component) {
			this._component.fieldOfView = value;
		}
	}

	protected onUpdateClippingPlanes(type: string, value: number): void {
		switch (type) {
			case "near":
				this.nearClipPlane = value;
				if (this._component) {
					this._component.nearClipPlane = value;
				}
				break;
			case "far":
				this.farClipPlane = value;
				this._component.farClipPlane = value;
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
	}

	protected onUpdateDepth(value: number): void {
		this.depth = value;
		if (this._component) {
			this._component.depth = value;
		}
	}
}
