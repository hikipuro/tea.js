import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

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
			<InputRange
				ref="fieldOfView"
				:min="1"
				:max="179"
				:value="fieldOfView"
				@update="onUpdateFov">Field of View</InputRange>
			<CheckBox
				ref="orthographic"
				:value="orthographic"
				@update="onUpdateOrthographic">Orthographic</CheckBox>
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
			fieldOfView: 0,
			orthographic: false,
			rect: [0, 0, 0, 0]
		}
	}
})
export class Camera extends Vue {
	_component: Tea.Camera;
	enabled: boolean;
	fieldOfView: number;
	clearFlags: string;
	orthographic: boolean;
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
		this.fieldOfView = component.fieldOfView;
		this.orthographic = component.orthographic;
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

	protected onUpdateFov(value: number): void {
		this.fieldOfView = value;
		if (this._component) {
			this._component.fieldOfView = value;
		}
	}

	protected onUpdateOrthographic(value: boolean): void {
		this.orthographic = value;
		if (this._component) {
			this._component.orthographic = value;
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
