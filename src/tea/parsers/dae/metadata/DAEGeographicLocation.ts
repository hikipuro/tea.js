import { DAEUtil } from "../DAEUtil";
import { DAEAltitude } from "./DAEAltitude";

// parent: asset/coverage
export class DAEGeographicLocation {
	longitude: number;
	latitude: number;
	altitude: DAEAltitude;

	constructor() {
		this.longitude = null;
		this.latitude = null;
		this.altitude = null;
	}

	static parse(el: Element): DAEGeographicLocation {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEGeographicLocation();
		value.longitude = DAEUtil.floatContent(el, "longitude");
		value.latitude = DAEUtil.floatContent(el, "latitude");
		value.altitude = DAEAltitude.parse(
			el.querySelector("altitude")
		);
		return value;
	}
}
