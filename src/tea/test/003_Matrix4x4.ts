import * as mocha from "mocha";
var assert = require("assert");
import * as Tea from "../Tea";
import { Matrix4x4 } from "../math/Matrix4x4";

describe("Matrix4x4", () => {
	function checkRange(m: Matrix4x4): void {
		for (var i = 0; i < 16; i++) {
			assert(m[i] != null);
			assert(isNaN(m[i]) === false);
		}
		assert(m.length === 16);
		assert(m[-1] == null);
		assert(m[16] == null);
	}

	it("constructor", () => {
		var matrix = new Matrix4x4();
		for (var i = 0; i < 16; i++) {
			assert(matrix[i] === 0);
			var row = i % 4;
			var column = Math.floor(i / 4);
			assert(matrix.getValue(row, column) === 0);
		}
		checkRange(matrix);
	});

	it("static zero", () => {
		var matrix = Matrix4x4.zero;
		for (var i = 0; i < 16; i++) {
			assert(matrix[i] === 0);
			var row = i % 4;
			var column = Math.floor(i / 4);
			assert(matrix.getValue(row, column) === 0);
		}
		checkRange(matrix);
	});

	it("static identity", () => {
		var matrix = Matrix4x4.identity;
		for (var i = 0; i < 16; i++) {
			var row = i % 4;
			var column = Math.floor(i / 4);
			switch (i) {
				case 0:
				case 5:
				case 10:
				case 15:
					assert(matrix[i] === 1);
					assert(matrix.getValue(row, column) === 1);
					continue;
			}
			assert(matrix[i] === 0);
			assert(matrix.getValue(row, column) === 0);
		}
		checkRange(matrix);
	});

	it("static fromArray", () => {
		var matrix = Matrix4x4.fromArray(
			[1, 2, 3, 4]
		);
		for (var i = 0; i < 4; i++) {
			assert(matrix[i] === (i + 1));
		}
		for (var i = 4; i < 16; i++) {
			assert(matrix[i] === 0);
		}
		checkRange(matrix);

		var matrix = Matrix4x4.fromArray(null);
		for (var i = 0; i < 16; i++) {
			assert(matrix[i] === 0);
		}
		checkRange(matrix);

		// compile error
		//var matrix = Matrix4x4.fromArray(["a"]);
	});
});
