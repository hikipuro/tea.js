import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class CollisionModule {
	enabled: boolean;
	bounce: MinMaxCurve;
	colliderForce: number;

	constructor() {
		this.enabled = false;
	}

	get bounceMultiplier(): number {
		return this.bounce.curveMultiplier;
	}
}
