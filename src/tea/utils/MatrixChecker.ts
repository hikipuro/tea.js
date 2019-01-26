
export class MatrixChecker extends Array<any> {
	constructor() {
		super(16);
		this.fill(0);
	}

	static get identity(): MatrixChecker {
		var m = new MatrixChecker();
		m[0] = m[5] = m[10] = m[15] = 1;
		return m;
	}

	static translate(): MatrixChecker {
		var m = MatrixChecker.identity;
		m[12] = "translate(x)";
		m[13] = "translate(y)";
		m[14] = "translate(z)";
		return m;
	}

	static scale(): MatrixChecker {
		var m = MatrixChecker.identity;
		m[0]  = "scale(x)";
		m[5]  = "scale(y)";
		m[10] = "scale(z)";
		return m;
	}

	static shear(): MatrixChecker {
		var m = MatrixChecker.identity;
		m[1] = m[2] = "shear(x)";
		m[4] = m[6] = "shear(y)";
		m[8] = m[9] = "shear(z)";
		return m;
	}

	static rotateX(name: string = "x"): MatrixChecker {
		var m = MatrixChecker.identity;
		m[5] = `cos(${name})`;
		m[6] = `sin(${name})`;
		m[9] = `-sin(${name})`;
		m[10] = `cos(${name})`;
		return m;
	}

	static rotateY(name: string = "y"): MatrixChecker {
		var m = MatrixChecker.identity;
		m[0] = `cos(${name})`;
		m[2] = `-sin(${name})`;
		m[8] = `sin(${name})`;
		m[10] = `cos(${name})`;
		return m;
	}

	static rotateZ(name: string = "z"): MatrixChecker {
		var m = MatrixChecker.identity;
		m[0] = `cos(${name})`;
		m[1] = `sin(${name})`;
		m[4] = `-sin(${name})`;
		m[5] = `cos(${name})`;
		return m;
	}

	static rotateQuaternion(name: string = "z"): MatrixChecker {
		var m = MatrixChecker.identity;
		m[0] = `qx1(${name})`;
		m[1] = `qx2(${name})`;
		m[2] = `qx3(${name})`;
		m[4] = `qy1(${name})`;
		m[5] = `qy2(${name})`;
		m[6] = `qy3(${name})`;
		m[8] = `qz1(${name})`;
		m[9] = `qz2(${name})`;
		m[10] = `qz3(${name})`;
		return m;
	}

	mul(value: MatrixChecker): MatrixChecker {
		var m = new MatrixChecker();
		var l00 = this[0],   l10 = this[1],   l20 = this[2],   l30 = this[3];
		var l01 = this[4],   l11 = this[5],   l21 = this[6],   l31 = this[7];
		var l02 = this[8],   l12 = this[9],   l22 = this[10],  l32 = this[11];
		var l03 = this[12],  l13 = this[13],  l23 = this[14],  l33 = this[15];
		
		var r00 = value[0],  r10 = value[1],  r20 = value[2],  r30 = value[3];
		var r01 = value[4],  r11 = value[5],  r21 = value[6],  r31 = value[7];
		var r02 = value[8],  r12 = value[9],  r22 = value[10], r32 = value[11];
		var r03 = value[12], r13 = value[13], r23 = value[14], r33 = value[15];

		m[0]  = this.ma(this.mv(l00, r00), this.mv(l01, r10), this.mv(l02, r20), this.mv(l03, r30));
		m[1]  = this.ma(this.mv(l10, r00), this.mv(l11, r10), this.mv(l12, r20), this.mv(l13, r30));
		m[2]  = this.ma(this.mv(l20, r00), this.mv(l21, r10), this.mv(l22, r20), this.mv(l23, r30));
		m[3]  = this.ma(this.mv(l30, r00), this.mv(l31, r10), this.mv(l32, r20), this.mv(l33, r30));

		m[4]  = this.ma(this.mv(l00, r01), this.mv(l01, r11), this.mv(l02, r21), this.mv(l03, r31));
		m[5]  = this.ma(this.mv(l10, r01), this.mv(l11, r11), this.mv(l12, r21), this.mv(l13, r31));
		m[6]  = this.ma(this.mv(l20, r01), this.mv(l21, r11), this.mv(l22, r21), this.mv(l23, r31));
		m[7]  = this.ma(this.mv(l30, r01), this.mv(l31, r11), this.mv(l32, r21), this.mv(l33, r31));

		m[8]  = this.ma(this.mv(l00, r02), this.mv(l01, r12), this.mv(l02, r22), this.mv(l03, r32));
		m[9]  = this.ma(this.mv(l10, r02), this.mv(l11, r12), this.mv(l12, r22), this.mv(l13, r32));
		m[10] = this.ma(this.mv(l20, r02), this.mv(l21, r12), this.mv(l22, r22), this.mv(l23, r32));
		m[11] = this.ma(this.mv(l30, r02), this.mv(l31, r12), this.mv(l32, r22), this.mv(l33, r32));

		m[12] = this.ma(this.mv(l00, r03), this.mv(l01, r13), this.mv(l02, r23), this.mv(l03, r33));
		m[13] = this.ma(this.mv(l10, r03), this.mv(l11, r13), this.mv(l12, r23), this.mv(l13, r33));
		m[14] = this.ma(this.mv(l20, r03), this.mv(l21, r13), this.mv(l22, r23), this.mv(l23, r33));
		m[15] = this.ma(this.mv(l30, r03), this.mv(l31, r13), this.mv(l32, r23), this.mv(l33, r33));
		return m;
	}

	protected ma(...a: any[]): any {
		var result: any = 0;
		for (var i = 0; i < a.length; i++) {
			var item = a[i];
			if (typeof(item) === "number") {
				if (item === 0) {
					continue;
				}
				if (typeof(result) === "number") {
					result += item;
					continue;
				}
				result += ` + ${item}`;
				continue;
			}
			if (result === 0) {
				result = item;
				continue;
			}
			result += ` + ${item}`;
			continue;
		}
		return result;
	}

	protected mv(a: any, b: any): any {
		var typeA = typeof(a);
		var typeB = typeof(b);
		if (typeA === "number") {
			if (typeB === "number" ) {
				return a * b;
			}
			if (a === 0) {
				return 0;
			}
			if (a === 1) {
				return b;
			}
			return `${a} * ${b}`;
		}
		if (typeB === "number" ) {
			if (b === 0) {
				return 0;
			}
			if (b === 1) {
				return a;
			}
			return `${a} * ${b}`;
		}
		return `${a} * ${b}`;
	}

	toString(): string {
		var t = new Array(16);
		for (var i = 0; i < 16; i++) {
			if (typeof(this[i]) === "number") {
				t[i] = this[i].toFixed(5);
			} else {
				t[i] = this[i];
			}
		}
		return (
			"[\n" +
			"\t" + t[0] + ", " + t[4] + ", " + t[8] + ", " + t[12] + ",\n" +
			"\t" + t[1] + ", " + t[5] + ", " + t[9] + ", " + t[13] + ",\n" +
			"\t" + t[2] + ", " + t[6] + ", " + t[10] + ", " + t[14] + ",\n" +
			"\t" + t[3] + ", " + t[7] + ", " + t[11] + ", " + t[15] + "\n" +
			"]"
		);
	}
}
