import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";

@Component({
	template: `
		<div
			class="Camera">
			<div class="name">{{ name }}</div>
			<InputNumber
				ref="fieldOfView"
				:value="fieldOfView"
				@update="onUpdateFov">Field of View</InputNumber>
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
			fieldOfView: 0,
			orthographic: false,
			rect: [0, 0, 0, 0]
		}
	}
})
export class Camera extends Vue {
	_component: Tea.Camera;
	fieldOfView: number;
	orthographic: boolean;
	rect: Array<number>;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.fieldOfView = component.fieldOfView;
		this.orthographic = component.orthographic;
		this.rect = component.rect.clone();
	}

	protected destroyed(): void {
		this._component = undefined;
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
