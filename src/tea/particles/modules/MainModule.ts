import * as Tea from "../../Tea";

export class PSMainModule {
	//customSimulationSpace: Transform;
	duration: number;
	//emitterVelocityMode: Tea.ParticleSystemEmitterVelocityMode;
	flipRotation: number;
	gravityModifier: Tea.ParticleSystem.MinMaxCurve;
	loop: boolean;
	maxParticles: number;
	//playOnAwake: boolean;
	//prewarm: boolean;
	//scalingMode: Tea.ParticleSystemScalingMode;
	//simulationSpace: Tea.ParticleSystemSimulationSpace;
	//simulationSpeed: number;
	startColor: Tea.ParticleSystem.MinMaxGradient;
	//startDelay: Tea.ParticleSystem.MinMaxCurve;
	//startDelayMultiplier: number;
	startLifetime: Tea.ParticleSystem.MinMaxCurve;
	startRotation: Tea.ParticleSystem.MinMaxCurve;
	//startRotation3D: boolean;
	//startRotationX: Tea.ParticleSystem.MinMaxCurve;
	//startRotationXMultiplier: number;
	//startRotationY: Tea.ParticleSystem.MinMaxCurve;
	//startRotationYMultiplier: number;
	//startRotationZ: Tea.ParticleSystem.MinMaxCurve;
	//startRotationZMultiplier: number;
	startSize: Tea.ParticleSystem.MinMaxCurve;
	//startSize3D: boolean;
	//startSizeX: Tea.ParticleSystem.MinMaxCurve;
	//startSizeXMultiplier: number;
	//startSizeY: Tea.ParticleSystem.MinMaxCurve;
	//startSizeYMultiplier: number;
	//startSizeZ: Tea.ParticleSystem.MinMaxCurve;
	//startSizeZMultiplier: number;
	startSpeed: Tea.ParticleSystem.MinMaxCurve;
	//stopAction: Tea.ParticleSystemStopAction;
	//useUnscaledTime: boolean;

	constructor() {
		this.duration = 5.0;
		this.flipRotation = 0.0;
		this.gravityModifier = new Tea.ParticleSystem.MinMaxCurve(0.0);
		this.loop = false;
		this.maxParticles = 1000;
		//this.playOnAwake = true;
		//this.prewarm = true;
		this.startColor = new Tea.ParticleSystem.MinMaxGradient(Tea.Color.white.clone());
		this.startLifetime = new Tea.ParticleSystem.MinMaxCurve(5.0);
		this.startRotation = new Tea.ParticleSystem.MinMaxCurve(0.0);
		this.startSize = new Tea.ParticleSystem.MinMaxCurve(1.0);
		this.startSpeed = new Tea.ParticleSystem.MinMaxCurve(5.0);
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
}
