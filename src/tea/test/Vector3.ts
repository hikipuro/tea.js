import * as mocha from "mocha";
import assert = require("assert");
import * as Tea from "../Tea";
import { Vector3 } from "../math/Vector3";

function rand(min: number = -10, max: number = 10): number {
	return min + Math.random() * (max - min);
}

describe("Vector3", () => {
	it("constructor", () => {
		var vector = new Vector3();
		assert(vector.x === 0);
		assert(vector.y === 0);
		assert(vector.z === 0);

		vector = new Vector3(1, 2, 3);
		assert(vector.x === 1 && vector[0] === 1);
		assert(vector.y === 2 && vector[1] === 2);
		assert(vector.z === 3 && vector[2] === 3);

		vector = new Vector3(1);
		assert(vector.x === 1 && vector[0] === 1);
		assert(vector.y === 0 && vector[1] === 0);
		assert(vector.z === 0 && vector[2] === 0);

		vector = new Vector3(NaN, null, undefined);
		assert(isNaN(vector.x));
		assert(vector.y === null);
		assert(typeof(vector.z) !== "undefined");
		assert(vector.z === 0);
	});

	it("indexer", () => {
		var vector = new Vector3(1, 2, 3);
		assert(vector[0] === 1 && vector[0] === 1);
		assert(vector[1] === 2 && vector[1] === 2);
		assert(vector[2] === 3 && vector[2] === 3);
		assert(vector[-1] === undefined);
		assert(vector[3] === undefined);
		assert(vector["x"] === 1);
		assert(vector["y"] === 2);
		assert(vector["z"] === 3);
	});

	it("length", () => {
		var vector = new Vector3();
		assert(vector.length === 3);
		assert(vector[3] === undefined);
		vector.push(1);
		assert(vector.length === 4);
	});

	it("static forward", () => {
		Vector3.forward.x = 1;
		var vector = Vector3.forward;
		assert(vector.x === 0);
		assert(vector.y === 0);
		assert(vector.z === 1);
		assert(vector[3] === undefined);
	});

	it("static back", () => {
		Vector3.back.x = 1;
		var vector = Vector3.back;
		assert(vector.x === 0);
		assert(vector.y === 0);
		assert(vector.z === -1);
		assert(vector[3] === undefined);
	});

	it("static up", () => {
		Vector3.up.x = 1;
		var vector = Vector3.up;
		assert(vector.x === 0);
		assert(vector.y === 1);
		assert(vector.z === 0);
		assert(vector[3] === undefined);
	});

	it("static down", () => {
		Vector3.down.x = 1;
		var vector = Vector3.down;
		assert(vector.x === 0);
		assert(vector.y === -1);
		assert(vector.z === 0);
		assert(vector[3] === undefined);
	});

	it("static left", () => {
		Vector3.left.y = 1;
		var vector = Vector3.left;
		assert(vector.x === -1);
		assert(vector.y === 0);
		assert(vector.z === 0);
		assert(vector[3] === undefined);
	});

	it("static right", () => {
		Vector3.right.y = 1;
		var vector = Vector3.right;
		assert(vector.x === 1);
		assert(vector.y === 0);
		assert(vector.z === 0);
		assert(vector[3] === undefined);
	});

	it("static zero", () => {
		Vector3.zero.x = 1;
		var vector = Vector3.zero;
		assert(vector.x === 0);
		assert(vector.y === 0);
		assert(vector.z === 0);
		assert(vector[3] === undefined);
	});

	it("static one", () => {
		Vector3.one.x = 0;
		var vector = Vector3.one;
		assert(vector.x === 1);
		assert(vector.y === 1);
		assert(vector.z === 1);
		assert(vector[3] === undefined);
	});

	it("static positiveInfinity", () => {
		Vector3.positiveInfinity.x = 0;
		var vector = Vector3.positiveInfinity;
		assert(vector.x === Number.POSITIVE_INFINITY);
		assert(vector.y === Number.POSITIVE_INFINITY);
		assert(vector.z === Number.POSITIVE_INFINITY);
		assert(vector[3] === undefined);
	});

	it("static negativeInfinity", () => {
		Vector3.negativeInfinity.x = 0;
		var vector = Vector3.negativeInfinity;
		assert(vector.x === Number.NEGATIVE_INFINITY);
		assert(vector.y === Number.NEGATIVE_INFINITY);
		assert(vector.z === Number.NEGATIVE_INFINITY);
		assert(vector[3] === undefined);
	});

	it("static max()", () => {
		var a = new Vector3(1, 2, 3);
		var b = new Vector3(4, 1, 2);
		var c = Vector3.max(a, b);
		assert(c.x === 4);
		assert(c.y === 2);
		assert(c.z === 3);
		assert(c[3] === undefined);
	});

	it("static min()", () => {
		var a = new Vector3(1, 2, 3);
		var b = new Vector3(4, 1, 2);
		var c = Vector3.min(a, b);
		assert(c.x === 1);
		assert(c.y === 1);
		assert(c.z === 2);
		assert(c[3] === undefined);
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

	it("static dot()", () => {
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(rand(), rand(), rand());
			var b = new Vector3(rand(), rand(), rand());
			var c = Vector3.dot(a, b);
			assert(c === (a.x * b.x) + (a.y * b.y) + (a.z * b.z));
		}
	});

	it("static cross()", () => {
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(rand(), rand(), rand());
			var b = new Vector3(rand(), rand(), rand());
			var c = Vector3.cross(a, b);
			assert(c.x === (a.y * b.z) - (a.z * b.y));
			assert(c.y === (a.z * b.x) - (a.x * b.z));
			assert(c.z === (a.x * b.y) - (a.y * b.x));
			assert(c[3] === undefined);
		}
	});

	it("static angle()", () => {
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(rand(), rand(), rand());
			var b = new Vector3(rand(), rand(), rand());
			var c = Vector3.angle(a, b);

			var ma = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
			var mb = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);
			var dot = (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
			var angle = Math.acos(dot / (ma * mb));
			try {
				assert(c === angle);
				assert(angle >= 0);
				assert(angle <= Math.PI);
			} catch (e) {
				/*
				console.error("a", a.toString());
				console.error("b", b.toString());
				console.error("c", c);
				console.error("dot", dot);
				//*/
				throw e;
			}
		}
		var a = new Vector3(1, 0, 0);
		var b = new Vector3(2, 2, 0);
		var c = Vector3.angle(a, b);
		assert(Tea.Mathf.approximately(c, Math.PI / 4));
		a = new Vector3(1, 0, 0);
		b = new Vector3(1, 0, 0);
		c = Vector3.angle(a, b);
		assert(Tea.Mathf.approximately(c, 0));
		a = new Vector3(1, 0, 0);
		b = new Vector3(0, 1, 0);
		c = Vector3.angle(a, b);
		assert(Tea.Mathf.approximately(c, Math.PI / 2));
		a = new Vector3(1, 0, 0);
		b = new Vector3(-1, 0, 0);
		c = Vector3.angle(a, b);
		assert(Tea.Mathf.approximately(c, Math.PI));
		a = new Vector3(1, 0, 0);
		b = new Vector3(0, -1, 0);
		c = Vector3.angle(a, b);
		assert(Tea.Mathf.approximately(c, Math.PI / 2));
		a = new Vector3(1, 0, 0);
		b = new Vector3(1, -Tea.Mathf.Epsilon, 0);
		c = Vector3.angle(a, b);
		assert(Math.floor(c) === 0);
	});

	it("static distance()", () => {
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(rand(), rand(), rand());
			var b = new Vector3(rand(), rand(), rand());
			var distance = Vector3.distance(a, b);
			var c = new Vector3();
			c.x = a.x - b.x;
			c.y = a.y - b.y;
			c.z = a.z - b.z;
			var m = Math.sqrt(c.x * c.x + c.y * c.y + c.z * c.z);
			assert(distance >= 0);
			assert(distance === m);
		}
	});

	it("static normalize()", () => {
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(rand(), rand(), rand());
			var n = Vector3.normalize(a);
			var m = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z);
			assert(Math.abs(n.x) <= 1);
			assert(Math.abs(n.y) <= 1);
			assert(Math.abs(n.z) <= 1);
			assert(n[3] === undefined);
			assert(Tea.Mathf.approximately(m, 1));
		}
		var a = new Vector3();
		var n = Vector3.normalize(a);
		assert(n.x === 0);
		assert(n.y === 0);
		assert(n.z === 0);
		assert(n[3] === undefined);
	});

	it("static scale()", () => {
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(rand(), rand(), rand());
			var b = new Vector3(rand(), rand(), rand());
			var c = Vector3.scale(a, b);
			var m = Math.sqrt(c.x * c.x + c.y * c.y + c.z * c.z);
			assert(c[0] === a[0] * b[0]);
			assert(c[1] === a[1] * b[1]);
			assert(c[2] === a[2] * b[2]);
		}
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
			var a = new Vector3(rand(), rand(), rand());
			var m = Math.sqrt(
				Math.pow(a.x, 2) +
				Math.pow(a.y, 2) +
				Math.pow(a.z, 2)
			);
			assert(a.magnitude === m);
			assert(a.magnitude >= 0);
		}
	});

	it("normalized", () => {
		for (var i = 0; i < 10; i++) {
			var a = new Vector3(rand(), rand(), rand());
			var n = a.normalized;
			var m = n.magnitude;
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
});
