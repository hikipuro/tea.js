import * as Tea from "../../Tea";

export class PSMainModule {
	//customSimulationSpace: Transform;
	duration: number;
	//emitterVelocityMode: Tea.ParticleSystemEmitterVelocityMode;
	flipRotation: number;
	gravityModifier: Tea.ParticleSystem.MinMaxCurve;
	gravityModifierMultiplier: number;
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
	startLifetimeMultiplier: number;
	startRotation: Tea.ParticleSystem.MinMaxCurve;
	//startRotation3D: boolean;
	startRotationMultiplier: number;
	//startRotationX: Tea.ParticleSystem.MinMaxCurve;
	//startRotationXMultiplier: number;
	//startRotationY: Tea.ParticleSystem.MinMaxCurve;
	//startRotationYMultiplier: number;
	//startRotationZ: Tea.ParticleSystem.MinMaxCurve;
	//startRotationZMultiplier: number;
	startSize: Tea.ParticleSystem.MinMaxCurve;
	//startSize3D: boolean;
	startSizeMultiplier: number;
	//startSizeX: Tea.ParticleSystem.MinMaxCurve;
	//startSizeXMultiplier: number;
	//startSizeY: Tea.ParticleSystem.MinMaxCurve;
	//startSizeYMultiplier: number;
	//startSizeZ: Tea.ParticleSystem.MinMaxCurve;
	//startSizeZMultiplier: number;
	startSpeed: Tea.ParticleSystem.MinMaxCurve;
	startSpeedMultiplier: number;
	//stopAction: Tea.ParticleSystemStopAction;
	//useUnscaledTime: boolean;

	constructor() {
		this.duration = 5.0;
		this.flipRotation = 0.0;
		this.gravityModifier = new Tea.ParticleSystem.MinMaxCurve(0.0);
		this.gravityModifierMultiplier = 1.0;
		this.loop = false;
		this.maxParticles = 1000;
		//this.playOnAwake = true;
		//this.prewarm = true;
		this.startColor = new Tea.ParticleSystem.MinMaxGradient(Tea.Color.white.clone());
		this.startLifetime = new Tea.ParticleSystem.MinMaxCurve(5.0);
		this.startLifetimeMultiplier = 1.0;
		this.startRotation = new Tea.ParticleSystem.MinMaxCurve(0.0);
		this.startRotationMultiplier = 1.0;
		this.startSize = new Tea.ParticleSystem.MinMaxCurve(1.0);
		this.startSizeMultiplier = 1.0;
		this.startSpeed = new Tea.ParticleSystem.MinMaxCurve(5.0);
		this.startSpeedMultiplier = 1.0;
	}
}
