import * as mocha from "mocha";
import assert = require("assert");
import * as Tea from "../Tea";
import { Mathf } from "../math/Mathf";
import { isString } from "util";

//function rand(min: number = -10, max: number = 10): number {
//	return min + Math.random() * (max - min);
//}

describe("Mathf", () => {
	it("correlatedColorTemperatureToRGB", () => {
		var a = Mathf.correlatedColorTemperatureToRGB(1000);
		assert(a.r === 1.0);
		//assert(a.g.toFixed(3) === "0.042");
		//assert(a.b.toFixed(3) === "0.003");
		//assert(a.a === 1.0);
		a = Mathf.correlatedColorTemperatureToRGB(1500);
		assert(a.toCssColor() === "#FF6C00");
	});

	it("deltaAngle", () => {
		var a = Mathf.deltaAngle(1080, 90);
		assert(a === 90);
		a = Mathf.deltaAngle(-1081, 90 + 350);
		assert(a === 81);
		a = Mathf.deltaAngle(90 + 350, -1081);
		assert(a === -81);
		a = Mathf.deltaAngle(-1, 10);
		assert(a === 11);
	});

	it("gammaToLinearSpace", () => {
		var a = Mathf.gammaToLinearSpace(0);
		assert(a === 0);
		a = Mathf.gammaToLinearSpace(1);
		assert(a === 1);
		a = Mathf.gammaToLinearSpace(0.5);
		assert(a.toFixed(2) === "0.22");
		a = Mathf.gammaToLinearSpace(2.6);
		assert(a.toFixed(2) === "8.18");
	});

	it("linearToGammaSpace", () => {
		var a = Mathf.linearToGammaSpace(0);
		assert(a === 0);
		a = Mathf.linearToGammaSpace(1);
		assert(a === 1);
		a = Mathf.linearToGammaSpace(100);
		assert(a.toFixed(2) === "8.11");
		a = Mathf.linearToGammaSpace(200);
		assert(a.toFixed(2) === "11.12");
	});

	it("repeat", () => {
		var a = Mathf.repeat(3, 2.5);
		assert(a === 0.5);
		a = Mathf.repeat(5, 2.5);
		assert(a === 0);
		a = Mathf.repeat(-3, 2.5);
		assert(a === 2);
		a = Mathf.repeat(-1, 2.5);
		assert(a === 1.5);
		a = Mathf.repeat(-5, 2.5);
		assert(a === 0);
		a = Mathf.repeat(-3, -2.5);
		assert(a === 0);
	});
});
