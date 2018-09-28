export class PSNoiseModule {
	enabled: boolean;
	damping: boolean;
	frequency: number;
	octaveCount: number;
	octaveMultiplier: number;
	octaveScale: number;

	constructor() {
		this.enabled = false;
	}
}
