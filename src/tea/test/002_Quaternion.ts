import * as mocha from "mocha";
var assert = require("assert");
import * as Tea from "../Tea";
import { Quaternion } from "../math/Quaternion";
import { isString } from "util";

function rand(min: number = -10, max: number = 10): number {
	return min + Math.random() * (max - min);
}

describe("Quaternion", () => {
	it("constructor", () => {
		var a = new Quaternion();
		assert(a.x === 0 && a[0] === 0);
		assert(a.y === 0 && a[1] === 0);
		assert(a.z === 0 && a[2] === 0);
		assert(a.w === 0 && a[3] === 0);

		a = new Quaternion(1, 2, 3, 4);
		assert(a.x === 1 && a[0] === 1);
		assert(a.y === 2 && a[1] === 2);
		assert(a.z === 3 && a[2] === 3);
		assert(a.w === 4 && a[3] === 4);

		a = new Quaternion(1);
		assert(a.x === 1 && a[0] === 1);
		assert(a.y === 0 && a[1] === 0);
		assert(a.z === 0 && a[2] === 0);
		assert(a.w === 0 && a[3] === 0);

		a = new Quaternion(1, 2);
		assert(a.x === 1 && a[0] === 1);
		assert(a.y === 2 && a[1] === 2);
		assert(a.z === 0 && a[2] === 0);
		assert(a.w === 0 && a[3] === 0);

		a = new Quaternion(1, 2, 3);
		assert(a.x === 1 && a[0] === 1);
		assert(a.y === 2 && a[1] === 2);
		assert(a.z === 3 && a[2] === 3);
		assert(a.w === 0 && a[3] === 0);

		a = new Quaternion(NaN, null, undefined);
		assert(isNaN(a.x));
		assert(a.y === null);
		assert(typeof(a.z) !== "undefined");
		assert(a.z === 0);
	});

	it("indexer", () => {
		var a = new Quaternion(1, 2, 3, 4);
		assert(a[0] === 1);
		assert(a[1] === 2);
		assert(a[2] === 3);
		assert(a[3] === 4);
		assert(a[-1] === undefined);
		assert(a[4] === undefined);
		assert(a["x"] === 1);
		assert(a["y"] === 2);
		assert(a["z"] === 3);
		assert(a["w"] === 4);
	});

	it("length", () => {
		var a = new Quaternion();
		assert(a.length === 4);
		assert(a[4] === undefined);
		a.push(1);
		assert(a.length === 5);
	});

	it("static identity", () => {
		var a = Quaternion.identity;
		assert(a.x === 0);
		assert(a.y === 0);
		assert(a.z === 0);
		assert(a.w === 1);
		assert(a[4] === undefined);
		assert(Object.isFrozen(a));
		var c = false;
		try {
			a.x = 1;
		} catch (err) {
			c = true;
		}
		assert(c);
	});
});
