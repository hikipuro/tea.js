import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";
import { MinMaxGradient } from "../MinMaxGradient";

export class MainModule {
	static readonly className: string = "MainModule";
	//customSimulationSpace: Transform;
	duration: number;
	//emitterVelocityMode: Tea.ParticleSystemEmitterVelocityMode;
	flipRotation: number;
	gravityModifier: MinMaxCurve;
	loop: boolean;
	maxParticles: number;
	playOnAwake: boolean;
	//prewarm: boolean;
	//scalingMode: Tea.ParticleSystemScalingMode;
	//simulationSpace: Tea.ParticleSystemSimulationSpace;
	//simulationSpeed: number;
	startColor: MinMaxGradient;
	//startDelay: MinMaxCurve;
	//startDelayMultiplier: number;
	startLifetime: MinMaxCurve;
	startRotation: MinMaxCurve;
	//startRotation3D: boolean;
	//startRotationX: MinMaxCurve;
	//startRotationXMultiplier: number;
	//startRotationY: MinMaxCurve;
	//startRotationYMultiplier: number;
	//startRotationZ: MinMaxCurve;
	//startRotationZMultiplier: number;
	startSize: MinMaxCurve;
	//startSize3D: boolean;
	//startSizeX: MinMaxCurve;
	//startSizeXMultiplier: number;
	//startSizeY: MinMaxCurve;
	//startSizeYMultiplier: number;
	//startSizeZ: MinMaxCurve;
	//startSizeZMultiplier: number;
	startSpeed: MinMaxCurve;
	//stopAction: Tea.ParticleSystemStopAction;
	//useUnscaledTime: boolean;

	constructor() {
		this.duration = 5.0;
		this.flipRotation = 0.0;
		this.gravityModifier = new MinMaxCurve(0.0);
		this.loop = false;
		this.maxParticles = 1000;
		this.playOnAwake = true;
		//this.prewarm = true;
		this.startColor = new MinMaxGradient(Tea.Color.white.clone());
		this.startLifetime = new MinMaxCurve(5.0);
		this.startRotation = new MinMaxCurve(0.0);
		this.startSize = new MinMaxCurve(1.0);
		this.startSpeed = new MinMaxCurve(5.0);
	}

	get gravityModifierMultiplier(): number {
		return this.gravityModifier.curveMultiplier;
	}
	set gravityModifierMultiplier(value: number) {
		this.gravityModifier.curveMultiplier = value;
	}

	get startLifetimeMultiplier(): number {
		return this.startLifetime.curveMultiplier;
	}
	set startLifetimeMultiplier(value: number) {
		this.startLifetime.curveMultiplier = value;
	}

	get startRotationMultiplier(): number {
		return this.startRotation.curveMultiplier;
	}
	set startRotationMultiplier(value: number) {
		this.startRotation.curveMultiplier = value;
	}

	get startSizeMultiplier(): number {
		return this.startSize.curveMultiplier;
	}
	set startSizeMultiplier(value: number) {
		this.startSize.curveMultiplier = value;
	}

	get startSpeedMultiplier(): number {
		return this.startSpeed.curveMultiplier;
	}
	set startSpeedMultiplier(value: number) {
		this.startSpeed.curveMultiplier = value;
	}

	static fromJSON(app: Tea.App, json: any): MainModule {
		if (Tea.JSONUtil.isValidSceneJSON(json, MainModule.className) === false) {
			return null;
		}
		var module = new MainModule();
		module.duration = json.duration;
		module.flipRotation = json.flipRotation;
		module.gravityModifier = MinMaxCurve.fromJSON(app, json.gravityModifier);
		module.loop = json.loop;
		module.maxParticles = json.maxParticles;
		module.startColor = MinMaxGradient.fromJSON(app, json.startColor);
		module.startLifetime = MinMaxCurve.fromJSON(app, json.startLifetime);
		module.startRotation = MinMaxCurve.fromJSON(app, json.startRotation);
		module.startSize = MinMaxCurve.fromJSON(app, json.startSize);
		module.startSpeed = MinMaxCurve.fromJSON(app, json.startSpeed);
		return module;
	}

	toJSON(): Object {
		var json = Tea.JSONUtil.createSceneJSON(MainModule.className);
		json.duration = this.duration;
		json.flipRotation = this.flipRotation;
		json.gravityModifier = this.gravityModifier.toJSON();
		json.loop = this.loop;
		json.maxParticles = this.maxParticles;
		json.startColor = this.startColor.toJSON();
		json.startLifetime = this.startLifetime.toJSON();
		json.startRotation = this.startRotation.toJSON();
		json.startSize = this.startSize.toJSON();
		json.startSpeed = this.startSpeed.toJSON();
		return json;
	}
}
