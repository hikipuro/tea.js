import * as mocha from "mocha";
import assert = require("assert");
import { Vector3 } from "../math/Vector3";

describe("Vector3", () => {
	it("constructor", () => {
		let vector = new Vector3();
		assert(vector.x === 0);
		assert(vector.y === 0);
		assert(vector.z === 0);
	});
	it("zero", () => {
		let vector = Vector3.zero;
		assert(vector.x === 0);
		assert(vector.y === 0);
		assert(vector.z === 0);
	});
});
