import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class CollisionModule {
	enabled: boolean;
	bounce: MinMaxCurve;
	bounceMultiplier: number;
	colliderForce: number;

	constructor() {
		this.enabled = false;
	}
}
