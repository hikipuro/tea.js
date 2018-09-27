import * as Tea from "../Tea";

export class PSMainModule {
	duration: number;
	//playOnAwake: boolean;
	loop: boolean;
	maxParticles: number;
	gravityModifier: number;
	startColor: Tea.Color;
	startSize: number;
	startRotation: number;
	startSpeed: number;
	startLifetime: number;

	constructor() {
		this.duration = 5.0;
		this.loop = false;
		this.maxParticles = 1000;
		this.gravityModifier = 1.0;
		this.startColor = Tea.Color.white.clone();
		this.startSize = 1.0;
		this.startRotation = 0.0;
		this.startSpeed = 1.0;
		this.startLifetime = 1.0;
	}
}
