import * as mocha from "mocha";
import assert = require("assert");
import * as Tea from "../Tea";
import { Vector3 } from "../math/Vector3";
import { isString } from "util";

function rand(min: number = -10, max: number = 10): number {
	return min + Math.random() * (max - min);
}

describe("Vector3", () => {
	it("constructor", () => {
		var a = new Vector3();
		assert(a.x === 0);
		assert(a.y === 0);
		assert(a.z === 0);

		a = new Vector3(1, 2, 3);
		assert(a.x === 1 && a[0] === 1);
		assert(a.y === 2 && a[1] === 2);
		assert(a.z === 3 && a[2] === 3);

		a = new Vector3(1);
		assert(a.x === 1 && a[0] === 1);
		assert(a.y === 0 && a[1] === 0);
		assert(a.z === 0 && a[2] === 0);

		a = new Vector3(1, 2);
		assert(a.x === 1 && a[0] === 1);
		assert(a.y === 2 && a[1] === 2);
		assert(a.z === 0 && a[2] === 0);

		a = new Vector3(NaN, null, undefined);
		assert(isNaN(a.x));
		assert(a.y === null);
		assert(typeof(a.z) !== "undefined");
		assert(a.z === 0);
	});

	it("indexer", () => {
		var a = new Vector3(1, 2, 3);
		assert(a[0] === 1 && a[0] === 1);
		assert(a[1] === 2 && a[1] === 2);
		assert(a[2] === 3 && a[2] === 3);
		assert(a[-1] === undefined);
		assert(a[3] === undefined);
		assert(a["x"] === 1);
		assert(a["y"] === 2);
		assert(a["z"] === 3);
	});

	it("length", () => {
		var a = new Vector3();
		assert(a.length === 3);
		assert(a[3] === undefined);
		a.push(1);
		assert(a.length === 4);
	});

	it("static forward", () => {
		//Vector3.forward.x = 1;
		var a = Vector3.forward;
		assert(a.x === 0);
		assert(a.y === 0);
		assert(a.z === 1);
		assert(a[3] === undefined);
		assert(Object.isFrozen(a));
		var c = false;
		try {
			a.x = 1;
		} catch (err) {
			c = true;
		}
		assert(c);
	});

	it("static back", () => {
		//Vector3.back.x = 1;
		var a = Vector3.back;
		assert(a.x === 0);
		assert(a.y === 0);
		assert(a.z === -1);
		assert(a[3] === undefined);
		assert(Object.isFrozen(a));
	});

	it("static up", () => {
		//Vector3.up.x = 1;
		var a = Vector3.up;
		assert(a.x === 0);
		assert(a.y === 1);
		assert(a.z === 0);
		assert(a[3] === undefined);
		assert(Object.isFrozen(a));
	});

	it("static down", () => {
		//Vector3.down.x = 1;
		var a = Vector3.down;
		assert(a.x === 0);
		assert(a.y === -1);
		assert(a.z === 0);
		assert(a[3] === undefined);
		assert(Object.isFrozen(a));
	});

	it("static left", () => {
		//Vector3.left.y = 1;
		var a = Vector3.left;
		assert(a.x === -1);
		assert(a.y === 0);
		assert(a.z === 0);
		assert(a[3] === undefined);
		assert(Object.isFrozen(a));
	});

	it("static right", () => {
		//Vector3.right.y = 1;
		var a = Vector3.right;
		assert(a.x === 1);
		assert(a.y === 0);
		assert(a.z === 0);
		assert(a[3] === undefined);
		assert(Object.isFrozen(a));
	});

	it("static zero", () => {
		//Vector3.zero.x = 1;
		var a = Vector3.zero;
		assert(a.x === 0);
		assert(a.y === 0);
		assert(a.z === 0);
		assert(a[3] === undefined);
		assert(Object.isFrozen(a));
	});

	it("static one", () => {
		//Vector3.one.x = 0;
		var a = Vector3.one;
		assert(a.x === 1);
		assert(a.y === 1);
		assert(a.z === 1);
		assert(a[3] === undefined);
		assert(Object.isFrozen(a));
	});

	it("static positiveInfinity", () => {
		//Vector3.positiveInfinity.x = 0;
		var a = Vector3.positiveInfinity;
		assert(a.x === Number.POSITIVE_INFINITY);
		assert(a.y === Number.POSITIVE_INFINITY);
		assert(a.z === Number.POSITIVE_INFINITY);
		assert(a[3] === undefined);
		assert(Object.isFrozen(a));
	});

	it("static negativeInfinity", () => {
		//Vector3.negativeInfinity.x = 0;
		var a = Vector3.negativeInfinity;
		assert(a.x === Number.NEGATIVE_INFINITY);
		assert(a.y === Number.NEGATIVE_INFINITY);
		assert(a.z === Number.NEGATIVE_INFINITY);
		assert(a[3] === undefined);
		assert(Object.isFrozen(a));
	});

	it("static max()", () => {
		var a = new Vector3(1, 2, 3);
		var b = new Vector3(4, 1, 2);
		var c = Vector3.max(a, b);
		assert(c.x === 4);
		assert(c.y === 2);
		assert(c.z === 3);
		assert(c[3] === undefined);

		a = new Vector3(0, 0, 0);
		b = new Vector3(0, 0, 0);
		c = Vector3.max(a, b);
		assert(c.x === 0);
		assert(c.y === 0);
		assert(c.z === 0);
	});

	it("static min()", () => {
		var a = new Vector3(1, 2, 3);
		var b = new Vector3(4, 1, 2);
		var c = Vector3.min(a, b);
		assert(c.x === 1);
		assert(c.y === 1);
		assert(c.z === 2);
		assert(c[3] === undefined);

		a = new Vector3(0, 0, 0);
		b = new Vector3(0, 0, 0);
		c = Vector3.min(a, b);
		assert(c.x === 0);
		assert(c.y === 0);
		assert(c.z === 0);
	});

	it("static moveTowards()", () => {
		var current = new Vector3(1, 2, 3);
		var target = new Vector3(4, 5, 6);
		var vector = Vector3.moveTowards(current, target, 10);
		assert(vector.x === 4);
		assert(vector.y === 5);
		assert(vector.z === 6);
		assert(vector[3] === undefined);
		vector = Vector3.moveTowards(current, target, 0);
		assert(vector.x === 1);
		assert(vector.y === 2);
		assert(vector.z === 3);
	});

	it("x, y, z", () => {
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(rand(), rand(), rand());
			assert(a[0] === a.x);
			assert(a[1] === a.y);
			assert(a[2] === a.z);
		}
	});

	it("magnitude", () => {
		for (var i = 0; i < 10; i++) {
			var x = rand() * 2 - 1;
			var y = rand() * 2 - 1;
			var z = rand() * 2 - 1;
			var a = new Vector3(x, y, z);
			var m = Math.sqrt(
				Math.pow(a.x, 2) +
				Math.pow(a.y, 2) +
				Math.pow(a.z, 2)
			);
			assert(a.magnitude === m);
			assert(a.magnitude >= 0);
		}
	});

	it("sqrMagnitude", () => {
		for (var i = 0; i < 10; i++) {
			var x = rand() * 2 - 1;
			var y = rand() * 2 - 1;
			var z = rand() * 2 - 1;
			var a = new Vector3(x, y, z);
			var m = Math.pow(a.x, 2) +
				Math.pow(a.y, 2) +
				Math.pow(a.z, 2);
			assert(a.sqrMagnitude === m);
			assert(a.sqrMagnitude >= 0);
		}
	});

	it("normalized", () => {
		var a = new Vector3(0, 0, 0);
		var n = a.normalized;
		var m = n.magnitude;
		assert(Tea.Mathf.approximately(m, 0));
		assert(n.x === 0);
		assert(n.y === 0);
		assert(n.z === 0);
		for (var i = 0; i < 10; i++) {
			a = new Vector3(rand(), rand(), rand());
			n = a.normalized;
			m = n.magnitude;
			assert(Tea.Mathf.approximately(m, 1));
			assert(Math.abs(n.x) <= 1);
			assert(Math.abs(n.y) <= 1);
			assert(Math.abs(n.z) <= 1);
		}
	});

	it("clone", () => {
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(rand(), rand(), rand());
			var b = a.clone();
			assert(a !== b);
			assert(a.x === b.x);
			assert(a.y === b.y);
			assert(a.z === b.z);
			assert(b[3] == null);
			a.x = -a.x;
			assert(a.x === -b.x);
			a.y = -a.y;
			assert(a.y === -b.y);
			a.z = -a.z;
			assert(a.z === -b.z);
		}
	});

	it("set", () => {
		var a = new Vector3(rand(), rand(), rand());
		a.set(1, 2, 3);
		assert(a.x === 1);
		assert(a.y === 2);
		assert(a.z === 3);
		assert(a[3] == null);
	});

	it("copy", () => {
		var a = new Vector3();
		var b = new Vector3();
		a.set(1, 2, 3);
		b.copy(a);
		assert(a !== b);
		assert(b.x === 1);
		assert(b.y === 2);
		assert(b.z === 3);
		assert(b[3] == null);
	});

	it("equals", () => {
		var a = new Vector3(rand(), rand(), rand());
		var b = a.clone();
		assert(a !== b);
		assert(a.equals(a));
		assert(a.equals(b));
		assert(a.equals(null) === false);
		a.x = 1;
		assert(a.equals(Vector3.zero) === false);
	});

	it("approxEquals", () => {
		var a = new Vector3(rand(), rand(), rand());
		var b = a.clone();
		assert(a.equals(b));
		b.x += Tea.Mathf.Epsilon * 0.9;
		b.y += Tea.Mathf.Epsilon * 0.9;
		b.z += Tea.Mathf.Epsilon * 0.9;
		assert(a.equals(b) === false);
		assert(a.approxEquals(b));
		b = a.clone();
		b.x -= Tea.Mathf.Epsilon * 0.9;
		b.y -= Tea.Mathf.Epsilon * 0.9;
		b.z -= Tea.Mathf.Epsilon * 0.9;
		assert(a.equals(b) === false);
		assert(a.approxEquals(b));
	});

	it("toString", () => {
		var a = new Vector3(rand(), rand(), rand());
		var str = a.toString();
		assert(str != null);
		assert(isString(str));
		assert(str.length >= 1);
	});

	it("isParallel", () => {
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(rand() * 2 - 1, 0, 0);
			var b = new Vector3(rand() * 2 - 1, 0, 0);
			assert(a.isParallel(b));
		}
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(0, rand() * 2 - 1, 0);
			var b = new Vector3(0, rand() * 2 - 1, 0);
			assert(a.isParallel(b));
		}
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(0, 0, rand() * 2 - 1);
			var b = new Vector3(0, 0, rand() * 2 - 1);
			assert(a.isParallel(b));
		}
	});

	it("angle", () => {
		var a = new Vector3(0, 0, 0);
		var b = new Vector3(0, 0, 0);
		assert(a.angle(b) === 0);
		b = null;
		var c = false;
		try {
			a.angle(b);
		} catch (err) {
			c = true;
		}
		assert(c);
		a = new Vector3(1, 0, 0);
		b = new Vector3(1, 1, 0);
		assert(Tea.Mathf.approximately(a.angle(b), Math.PI / 4));
		a = new Vector3(0, 1, 0);
		b = new Vector3(1, 1, 0);
		assert(Tea.Mathf.approximately(a.angle(b), Math.PI / 4));
		a = new Vector3(0, 0, 1);
		b = new Vector3(0, 1, 1);
		assert(Tea.Mathf.approximately(a.angle(b), Math.PI / 4));
		a = new Vector3(1, 0, 0);
		b = new Vector3(1, 0, 0);
		assert(Tea.Mathf.approximately(a.angle(b), 0));
		a = new Vector3(0, 1, 0);
		b = new Vector3(1, 0, 0);
		assert(Tea.Mathf.approximately(a.angle(b), Math.PI / 2));
		a = new Vector3(1, 0, 0);
		b = new Vector3(0, 1, 0);
		assert(Tea.Mathf.approximately(a.angle(b), Math.PI / 2));
		a = new Vector3(1, 0, 0);
		b = new Vector3(-1, 0, 0);
		assert(Tea.Mathf.approximately(a.angle(b), Tea.radians(180)));
		a = new Vector3(1, 0, 0);
		b = new Vector3(-1, -1, 0);
		assert(Tea.Mathf.approximately(a.angle(b), Tea.radians(135)));
		a = new Vector3(1, 0, 0);
		b = new Vector3(0, -1, 0);
		assert(Tea.Mathf.approximately(a.angle(b), Tea.radians(90)));
	});

	it("distance", () => {
		var a = new Vector3(0, 0, 0);
		var b = new Vector3(0, 0, 0);
		assert(a.distance(b) === 0);
		a = new Vector3(1, 0, 0);
		b = new Vector3(0, 1, 0);
		assert(a.distance(b) === Math.sqrt(2));
		a = new Vector3(-1, 0, 0);
		b = new Vector3(0, -1, 0);
		assert(a.distance(b) === Math.sqrt(2));
	});

	it("clampMagnitude", () => {
		for (var i = 0; i < 10; i++) {
			var x = rand(), y = rand(), z = rand();
			var a = new Vector3(x, y, z);
			var m = a.clampMagnitude(2);
			assert(m != null);
			assert(m.magnitude <= 2 + Tea.Mathf.Epsilon);
			m = a.clampMagnitude(0);
			assert(m != null);
			assert(m.magnitude === 0);
		}

		a = new Vector3(0, 0, 0);
		m = a.clampMagnitude(0);
		assert(m != null);
		assert(m.magnitude === 0);

		m = a.clampMagnitude(1);
		assert(m != null);
		assert(m.magnitude === 0);
	});

	it("lerp", () => {
		var a = new Vector3(0, 0, 0);
		var b = new Vector3(0, 0, 0);
		var c = a.lerp(b, 0);
		assert(c != null);
		assert(c.magnitude === 0);
		c = a.lerp(b, 10);
		assert(c != null);
		assert(c.magnitude === 0);
		a = new Vector3(1, 0, -10);
		b = new Vector3(11, 10, 20);
		c = a.lerp(b, 0.5);
		assert(c != null);
		assert(c.x === 6);
		assert(c.y === 5);
		assert(c.z === 5);
		c = a.lerp(b, 2);
		assert(c.x === 11);
		assert(c.y === 10);
		assert(c.z === 20);
	});

	it("lerpUnclamped", () => {
		var a = new Vector3(0, 0, 0);
		var b = new Vector3(0, 0, 0);
		var c = a.lerpUnclamped(b, 0);
		assert(c != null);
		assert(c.magnitude === 0);
		c = a.lerpUnclamped(b, 10);
		assert(c != null);
		assert(c.magnitude === 0);
		a = new Vector3(1, 0, -10);
		b = new Vector3(11, 10, 20);
		c = a.lerpUnclamped(b, 0.5);
		assert(c != null);
		assert(c.x === 6);
		assert(c.y === 5);
		assert(c.z === 5);
		c = a.lerpUnclamped(b, 2);
		assert(c.x === 21);
		assert(c.y === 20);
		assert(c.z === 50);
	});

	it("project", () => {
		var a = new Vector3(0, 0, 0);
		var b = new Vector3(0, 0, 0);
		var c = a.project(b);
		assert(c.magnitude === 0);
		a = new Vector3(2, 2, 2);
		b = new Vector3(1.5, 0, 0);
		c = a.project(b);
		assert(c.x === 2);
		assert(c.y === 0);
		assert(c.z === 0);
		a = new Vector3(2, 2, 2);
		b = new Vector3(0, 1.5, 0);
		c = a.project(b);
		assert(c.x === 0);
		assert(c.y === 2);
		assert(c.z === 0);
		a = new Vector3(2, 2, 2);
		b = new Vector3(0, 0, 1.5);
		c = a.project(b);
		assert(c.x === 0);
		assert(c.y === 0);
		assert(c.z === 2);
	});

	it("projectOnPlane", () => {
		var a = new Vector3(0, 0, 0);
		var b = new Vector3(0, 0, 0);
		var c = a.projectOnPlane(b);
		assert(c.magnitude === 0);
		a = new Vector3(2, 2, 2);
		b = new Vector3(2, 0, 0);
		c = a.projectOnPlane(b);
		assert(c.x === 0);
		assert(c.y === 2);
		assert(c.z === 2);
		a = new Vector3(2, 2, 2);
		b = new Vector3(0, 2, 0);
		c = a.projectOnPlane(b);
		assert(c.x === 2);
		assert(c.y === 0);
		assert(c.z === 2);
		a = new Vector3(2, 2, 2);
		b = new Vector3(0, 0, 2);
		c = a.projectOnPlane(b);
		assert(c.x === 2);
		assert(c.y === 2);
		assert(c.z === 0);
	});

	it("reflect", () => {
		var a = new Vector3(0, 0, 0);
		var b = new Vector3(0, 0, 0);
		var c = a.reflect(b);
		assert(c.magnitude === 0);
		a = new Vector3(2, 2, 2);
		b = new Vector3(1, 0, 0);
		c = a.reflect(b);
		assert(c.x === -2);
		assert(c.y === 2);
		assert(c.z === 2);
		b = new Vector3(0, 1, 0);
		c = a.reflect(b);
		assert(c.x === 2);
		assert(c.y === -2);
		assert(c.z === 2);
		b = new Vector3(0, 0, 1);
		c = a.reflect(b);
		assert(c.x === 2);
		assert(c.y === 2);
		assert(c.z === -2);
	});

	it("rotateTowards", () => {
		var a = new Vector3(0, 0, 0);
		var b = new Vector3(0, 0, 0);
		var c = a.rotateTowards(b, 0, 0);
		assert(c.magnitude === 0);
		a = new Vector3(1, 1, 1);
		b = new Vector3(1, 0, 0);
		c = a.rotateTowards(b, 1, 0);
		assert(Tea.Mathf.approximately(c.magnitude, a.magnitude));
		assert(Tea.Mathf.approximately(c.x, a.magnitude));
		assert(Tea.Mathf.approximately(c.y, 0));
		assert(Tea.Mathf.approximately(c.z, 0));
		c = a.rotateTowards(b, 1, 1);
		assert(Tea.Mathf.approximately(c.magnitude, b.magnitude));
		assert(Tea.Mathf.approximately(c.x, b.magnitude));
		assert(Tea.Mathf.approximately(c.y, 0));
		assert(Tea.Mathf.approximately(c.z, 0));
		c = a.rotateTowards(b, 0, 0);
		assert(Tea.Mathf.approximately(c.magnitude, a.magnitude));
		assert(Tea.Mathf.approximately(c.x, a.x));
		assert(Tea.Mathf.approximately(c.y, a.y));
		assert(Tea.Mathf.approximately(c.z, a.z));
		c = a.rotateTowards(b, 0, 1);
		assert(Tea.Mathf.approximately(c.magnitude, b.magnitude));
		var m = b.magnitude / a.magnitude;
		assert(Tea.Mathf.approximately(c.x, m));
		assert(Tea.Mathf.approximately(c.y, m));
		assert(Tea.Mathf.approximately(c.z, m));
		//c = a.rotateTowards(b, 0.1, 0);
		//assert(Tea.Mathf.approximately(c.magnitude, b.magnitude));
	});

	it("signedAngle", () => {
		var a = new Vector3(0, 0, 0);
		var b = new Vector3(0, 0, 0);
		var c = a.signedAngle(b, Vector3.forward);
		assert(c === 0);
		a = new Vector3(2, 0, 0);
		b = new Vector3(-2, 2, 0);
		c = a.signedAngle(b, Vector3.forward);
		assert(c === Tea.radians(135));
		a = new Vector3(2, 0, 0);
		b = new Vector3(-2, -2, 0);
		c = a.signedAngle(b, Vector3.forward);
		assert(c === Tea.radians(-135));
		c = a.signedAngle(b, Vector3.back);
		assert(c === Tea.radians(135));
	});

	it("slerp", () => {
		var a = new Vector3(0, 0, 0);
		var b = new Vector3(0, 0, 0);
		var c = a.slerp(b, 0);
		assert(c.x === 0);
		assert(c.y === 0);
		assert(c.z === 0);
		a = new Vector3(2, 0, 2);
		b = new Vector3(-2, -2, 0);
		c = a.slerp(b, 0);
		assert(c.x === 2);
		assert(c.y === 0);
		assert(c.z === 2);
		c = a.slerp(b, 1);
		assert(Tea.Mathf.approximately(c.x, -2));
		assert(Tea.Mathf.approximately(c.y, -2));
		assert(Tea.Mathf.approximately(c.z, 0));
		c = a.slerp(b, 2);
		assert(Tea.Mathf.approximately(c.x, -2));
		assert(Tea.Mathf.approximately(c.y, -2));
		assert(Tea.Mathf.approximately(c.z, 0));
		c = a.slerp(b, 0.4);
		assert(c.x.toFixed(7) === "0.4801515");
		assert(c.y.toFixed(7) === "-1.7162195");
		assert(c.z.toFixed(7) === "2.1963709");
	});

	it("slerpUnclamped", () => {
		var a = new Vector3(0, 0, 0);
		var b = new Vector3(0, 0, 0);
		var c = a.slerpUnclamped(b, 0);
		assert(c.x === 0);
		assert(c.y === 0);
		assert(c.z === 0);
		a = new Vector3(2, 0, 2);
		b = new Vector3(-2, -2, 0);
		c = a.slerpUnclamped(b, 0);
		assert(c.x === 2);
		assert(c.y === 0);
		assert(c.z === 2);
		c = a.slerpUnclamped(b, 1);
		assert(Tea.Mathf.approximately(c.x, -2));
		assert(Tea.Mathf.approximately(c.y, -2));
		assert(Tea.Mathf.approximately(c.z, 0));
		c = a.slerpUnclamped(b, 2);
		assert(Tea.Mathf.approximately(c.x, 0));
		assert(Tea.Mathf.approximately(c.y, 2));
		assert(Tea.Mathf.approximately(c.z, -2));
		c = a.slerpUnclamped(b, 0.4);
		assert(c.x.toFixed(7) === "0.4801515");
		assert(c.y.toFixed(7) === "-1.7162195");
		assert(c.z.toFixed(7) === "2.1963709");
	});
});
