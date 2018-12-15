import { DAEUtil } from "../../DAEUtil";
import { DAEAltitude } from "./DAEAltitude";

// parent: asset/coverage
export class DAEGeographicLocation {
	static readonly TagName: string = "geographic_location";
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
		value.longitude = this.clampLongitude(value.longitude);
		value.latitude = DAEUtil.floatContent(el, "latitude");
		value.latitude = this.clampLatitude(value.latitude);
		value.altitude = DAEAltitude.parse(
			DAEUtil.queryChildSelector(el, DAEAltitude.TagName)
		);
		return value;
	}

	static clampLongitude(value: number): number {
		if (value == null || isNaN(value)) {
			return value;
		}
		return Math.max(-180.0, Math.min(180.0, value));
	}

	static clampLatitude(value: number): number {
		if (value == null || isNaN(value)) {
			return value;
		}
		return Math.max(-90.0, Math.min(90.0, value));
	}

	toXML(): Element {
		var el = document.createElement(DAEGeographicLocation.TagName);
		var longitude = DAEGeographicLocation.clampLongitude(this.longitude);
		DAEUtil.addFloatContent(el, "longitude", longitude);
		var latitude = DAEGeographicLocation.clampLongitude(this.latitude);
		DAEUtil.addFloatContent(el, "latitude", latitude);
		DAEUtil.addXML(el, this.altitude);
		return el;
	}
}
