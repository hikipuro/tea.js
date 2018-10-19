import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { ShapeModule } from "./particles/ShapeModule";

@Component({
	template: `
		<div class="ParticleSystem">
			<InputNumber
				ref="duration"
				class="number"
				:value="duration"
				@update="onUpdateDuration">Duration</InputNumber>
			<CheckBox
				ref="looping"
				:value="looping"
				@update="onUpdateLooping">Looping</CheckBox>
			<InputNumber
				ref="startLifetime"
				class="number"
				:value="startLifetime"
				@update="onUpdateStartLifetime">Start Lifetime</InputNumber>
			<InputNumber
				ref="startSpeed"
				class="number"
				:value="startSpeed"
				@update="onUpdateStartSpeed">Start Speed</InputNumber>
			<ColorPicker
				ref="startColor"
				:value="startColor"
				@update="onUpdateStartColor">Start Color</ColorPicker>
			<InputNumber
				ref="gravityModifier"
				class="number"
				:value="gravityModifier"
				@update="onUpdateGravityModifier">Gravity Modifier</InputNumber>
			<InputNumber
				ref="maxParticles"
				class="number"
				:value="maxParticles"
				:step="1"
				:min="0"
				@update="onUpdateMaxParticles">Max Particles</InputNumber>
			<ShapeModule ref="shape"></ShapeModule>
		</div>
	`,
	data: () => {
		return {
			name: "ParticleSystem",
			enabled: false,
			duration: 0,
			looping: false,
			startLifetime: 0,
			startSpeed: 0,
			startColor: "",
			gravityModifier: 0,
			maxParticles: 0,
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as ParticleSystem;
			self._component.enabled = value;
		}
	},
	components: {
		ShapeModule: ShapeModule
	}
})
export class ParticleSystem extends Vue {
	_component: Tea.ParticleSystem;
	name: string;
	enabled: boolean;
	duration: number;
	looping: boolean;
	startLifetime: number;
	startSpeed: number;
	startColor: string;
	gravityModifier: number;
	maxParticles: number;

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.duration = component.main.duration;
		this.looping = component.main.loop;
		this.startLifetime = component.main.startLifetime.constant;
		this.startSpeed = component.main.startSpeed.constant;
		this.startColor = component.main.startColor.color.toCssColor();
		this.gravityModifier = component.main.gravityModifier.constant;
		this.maxParticles = component.main.maxParticles;
		(this.$refs.shape as ShapeModule)._module = component.shape;
		(this.$refs.shape as ShapeModule).update();
	}

	protected onUpdateDuration(value: number): void {
		this.duration = value;
		if (this._component) {
			this._component.main.duration = value;
		}
	}

	protected onUpdateLooping(value: boolean): void {
		this.looping = value;
		if (this._component) {
			this._component.main.loop = value;
		}
	}

	protected onUpdateStartLifetime(value: number): void {
		this.startLifetime = value;
		if (this._component) {
			this._component.main.startLifetime.constant = value;
		}
	}

	protected onUpdateStartSpeed(value: number): void {
		this.startSpeed = value;
		if (this._component) {
			this._component.main.startSpeed.constant = value;
		}
	}

	protected onUpdateStartColor(value: Tea.Color): void {
		this.startColor = value.toCssColor();
		if (this._component) {
			this._component.main.startColor.color.copy(value);
		}
	}

	protected onUpdateGravityModifier(value: number): void {
		this.gravityModifier = value;
		if (this._component) {
			this._component.main.gravityModifier.constant = value;
		}
	}

	protected onUpdateMaxParticles(value: number): void {
		this.maxParticles = value;
		if (this._component) {
			this._component.main.maxParticles = value;
		}
	}
}
