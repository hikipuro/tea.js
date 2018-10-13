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
		<div
			class="Component Camera">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled">{{ name }}</ComponentTitle>
			<SelectEnum
				ref="clearFlags"
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
				:near="near"
				:far="far"
				@update="onUpdateClippingPlanes">Clipping Planes</ClippingPlanes>
			<Rectangle
				ref="rect"
				:value="rect"
				@update="onUpdateRect">Viewport Rect</Rectangle>
		</div>
	`,
	data: () => {
		return {
			name: "Camera",
			enabled: false,
			clearFlags: "",
			background: "",
			orthographic: false,
			size: 0,
			fieldOfView: 0,
			near: 0,
			far: 0,
			rect: [0, 0, 0, 0]
		}
	},
	components: {
		"ClippingPlanes": ClippingPlanes
	}
})
export class Camera extends Vue {
	_component: Tea.Camera;
	enabled: boolean;
	clearFlags: string;
	background: string;
	orthographic: boolean;
	size: number;
	fieldOfView: number;
	near: number;
	far: number;
	rect: Array<number>;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		var clearFlags = this.$refs.clearFlags as Vue;
		clearFlags.$data.keys = Tea.CameraClearFlags.getKeys();
		this.$nextTick(() => {
			this.clearFlags = Tea.CameraClearFlags[component.clearFlags];
		});
		this.background = component.backgroundColor.toCssColor();
		this.orthographic = component.orthographic;
		this.size = component.orthographicSize;
		this.fieldOfView = component.fieldOfView;
		this.near = component.nearClipPlane;
		this.far = component.farClipPlane;
		this.rect = component.rect.clone();
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

	protected onUpdateClearFlags(value: string): void {
		this.clearFlags = value;
		if (this._component) {
			this._component.clearFlags = Tea.CameraClearFlags[value];
		}
	}

	protected onUpdateBackground(value: string): void {
		console.log("onUpdateBackground", value);
		this.background = value;
		if (this._component) {
			this._component.backgroundColor.setCssColor(value);
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
				this.near = value;
				if (this._component) {
					this._component.nearClipPlane = value;
				}
				break;
			case "far":
				this.far = value;
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
}
