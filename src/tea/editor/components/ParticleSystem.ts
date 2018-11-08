import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";
import { EmissionModule } from "./particles/EmissionModule";
import { ShapeModule } from "./particles/ShapeModule";
import { ColorOverLifetimeModule } from "./particles/ColorOverLifetimeModule";
import { VelocityOverLifetimeModule } from "./particles/VelocityOverLifetimeModule";

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
			<EmissionModule ref="emission"></EmissionModule>
			<ShapeModule ref="shape"></ShapeModule>
			<ColorOverLifetimeModule ref="colorOverLifetime"></ColorOverLifetimeModule>
			<VelocityOverLifetimeModule ref="velocityOverLifetime"></VelocityOverLifetimeModule>
		</div>
	`,
	data: () => {
		return {
			translator: {},
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
		EmissionModule: EmissionModule,
		ShapeModule: ShapeModule,
		ColorOverLifetimeModule: ColorOverLifetimeModule,
		VelocityOverLifetimeModule: VelocityOverLifetimeModule

	}
})
export class ParticleSystem extends Vue {
	_component: Tea.ParticleSystem;
	translator: any;
	name: string;
	enabled: boolean;
	duration: number;
	looping: boolean;
	startLifetime: number;
	startSpeed: number;
	startColor: string;
	gravityModifier: number;
	maxParticles: number;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/ParticleSystem";
		this.name = translator.getText("Title");
	}

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

		var shape = this.$refs.shape as ShapeModule;
		shape._module = component.shape;
		shape.update();

		var emission = this.$refs.emission as EmissionModule;
		emission._module = component.emission;
		emission.update();

		var colorOverLifetime = this.$refs.colorOverLifetime as ColorOverLifetimeModule;
		colorOverLifetime._module = component.colorOverLifetime;
		colorOverLifetime.update();

		var velocityOverLifetime = this.$refs.velocityOverLifetime as VelocityOverLifetimeModule;
		velocityOverLifetime._module = component.velocityOverLifetime;
		velocityOverLifetime.update();
	}

	protected onUpdateDuration(value: number): void {
		this.duration = value;
		if (this._component) {
			this._component.main.duration = value;
		}
		this.$emit("update", "duration");
	}

	protected onUpdateLooping(value: boolean): void {
		this.looping = value;
		if (this._component) {
			this._component.main.loop = value;
		}
		this.$emit("update", "looping");
	}

	protected onUpdateStartLifetime(value: number): void {
		this.startLifetime = value;
		if (this._component) {
			this._component.main.startLifetime.constant = value;
		}
		this.$emit("update", "startLifetime");
	}

	protected onUpdateStartSpeed(value: number): void {
		this.startSpeed = value;
		if (this._component) {
			this._component.main.startSpeed.constant = value;
		}
		this.$emit("update", "startSpeed");
	}

	protected onUpdateStartColor(value: Tea.Color): void {
		this.startColor = value.toCssColor();
		if (this._component) {
			this._component.main.startColor.color.copy(value);
		}
		this.$emit("update", "startColor");
	}

	protected onUpdateGravityModifier(value: number): void {
		this.gravityModifier = value;
		if (this._component) {
			this._component.main.gravityModifier.constant = value;
		}
		this.$emit("update", "gravityModifier");
	}

	protected onUpdateMaxParticles(value: number): void {
		this.maxParticles = value;
		if (this._component) {
			this._component.main.maxParticles = value;
		}
		this.$emit("update", "maxParticles");
	}
}
