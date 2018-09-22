import * as Tea from "../Tea";

export enum UniformType {
	Int,
	Float,
	Vector2,
	Vector4,
	Matrix,
	Color,
	FloatArray,
	Vector4Array,
	MatrixArray,
	ColorArray
}

type UniformValue = (
	number |
	Tea.Vector2 |
	Tea.Vector4 |
	Tea.Matrix4x4 |
	Tea.Color |
	Array<number> |
	Array<Tea.Vector4> |
	Array<Tea.Matrix4x4> |
	Array<Tea.Color>
);

class UniformItem {
	type: UniformType;
	value: UniformValue;

	constructor(type?: UniformType, value?: UniformValue) {
		this.type = type;
		this.value = value;
	}

	toJSON(): Object {
		var json = {
			type: this.getTypeString(),
			value: this.value
		};
		return json;
	}

	protected getTypeString(): string {
		switch (this.type) {
			case UniformType.Int:
				return "Int";
			case UniformType.Float:
				return "Float";
			case UniformType.Vector2:
				return "Vector2";
			case UniformType.Vector4:
				return "Vector4";
			case UniformType.Matrix:
				return "Matrix";
			case UniformType.Color:
				return "Color";
			case UniformType.FloatArray:
				return "FloatArray";
			case UniformType.Vector4Array:
				return "Vector4Array";
			case UniformType.MatrixArray:
				return "MatrixArray";
			case UniformType.ColorArray:
				return "ColorArray";
		}
		return "";
	}
}

export class Material {
	shader: Tea.Shader;
	renderQueue: number;
	protected _uniforms: {[key: string]: UniformItem};
	protected _textures: {[key: string]: Tea.Texture};

	constructor(app: Tea.App) {
		this.renderQueue = 2000;
		this._uniforms = {};
		this._textures = {};
		this.color = Tea.Color.white.clone();
		this.mainTexture = Tea.Texture.getEmpty(app);
		this.mainTextureOffset = new Tea.Vector2();
		this.mainTextureScale = new Tea.Vector2(1.0, 1.0);
		this.setTexture("_ShadowTex", Tea.Texture.getEmpty(app));
		this.setTextureOffset("_ShadowTex", new Tea.Vector2());
		this.setTextureScale("_ShadowTex", new Tea.Vector2(1.0, 1.0));
		var normalTex = Tea.Texture.getEmpty(app, 0.5, 0.5, 1.0, 1.0);
		this.setTexture("_NormalTex", normalTex);
		//this.setTexture("_NormalTex", Tea.Texture.getEmpty(app));
		this.setTextureOffset("_NormalTex", new Tea.Vector2());
		this.setTextureScale("_NormalTex", new Tea.Vector2(1.0, 1.0));
	}

	static getDefault(app: Tea.App): Material {
		var material = new Material(app);
		return material;
	}

	get color(): Tea.Color {
		return this.getColor("_Color");
	}
	set color(value: Tea.Color) {
		this.setColor("_Color", value);
	}

	get mainTexture(): Tea.Texture {
		return this.getTexture("_MainTex");
	}
	set mainTexture(value: Tea.Texture) {
		this.setTexture("_MainTex", value);
	}

	get mainTextureOffset(): Tea.Vector2 {
		return this.getTextureOffset("_MainTex");
	}
	set mainTextureOffset(value: Tea.Vector2) {
		this.setTextureOffset("_MainTex", value);
	}

	get mainTextureScale(): Tea.Vector2 {
		return this.getTextureScale("_MainTex");
	}
	set mainTextureScale(value: Tea.Vector2) {
		this.setTextureScale("_MainTex", value);
	}

	get textureKeys(): Array<string> {
		return Object.keys(this._textures);
	}

	/*
	get shaderKeywords(): Array<string> {
		return [];
	}

	isKeywordEnabled(keyword: string): boolean {
		return false;
	}

	disableKeyword(keyword: string): void {

	}

	enableKeyword(keyword: string): void {

	}
	*/

	hasProperty(name: string): boolean {
		return this._uniforms.hasOwnProperty(name);
	}

	destroy(): void {
		if (this.shader != null) {
			this.shader.destroy();
			this.shader = undefined;
		}
		this.renderQueue = undefined;
		this._uniforms = undefined;
		var keys = Object.keys(this._textures);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			// TODO: delete texture
			//this._textures[key].destroy();
			delete this._textures[key];
		}
		this._textures = undefined;
	}

	getColor(name: string): Tea.Color {
		var type = UniformType.Color;
		var value = this.getValue(name, type);
		return value as Tea.Color;
	}

	setColor(name: string, value: Tea.Color): void {
		var type = UniformType.Color;
		this.setValue(name, type, value);
	}

	getColorArray(name: string): Array<Tea.Color> {
		var type = UniformType.ColorArray;
		var value = this.getValue(name, type);
		return value as Array<Tea.Color>;
	}

	setColorArray(name: string, value: Array<Tea.Color>): void {
		var type = UniformType.ColorArray;
		this.setValue(name, type, value);
	}

	getFloat(name: string): number | null {
		var type = UniformType.Float;
		var value = this.getValue(name, type);
		return value as number;
	}

	setFloat(name: string, value: number): void {
		var type = UniformType.Float;
		this.setValue(name, type, value);
	}

	getFloatArray(name: string): Array<number> {
		var type = UniformType.FloatArray;
		var value = this.getValue(name, type);
		return value as Array<number>;
	}

	setFloatArray(name: string, value: Array<number>): void {
		var type = UniformType.FloatArray;
		this.setValue(name, type, value);
	}

	getInt(name: string): number | null {
		var type = UniformType.Int;
		var value = this.getValue(name, type);
		return value as number;
	}

	setInt(name: string, value: number): void {
		var type = UniformType.Int;
		this.setValue(name, type, value);
	}

	getMatrix(name: string): Tea.Matrix4x4 {
		var type = UniformType.Matrix;
		var value = this.getValue(name, type);
		return value as Tea.Matrix4x4;
	}

	setMatrix(name: string, value: Tea.Matrix4x4): void {
		var type = UniformType.Matrix;
		this.setValue(name, type, value);
	}

	getMatrixArray(name: string): Array<Tea.Matrix4x4> {
		var type = UniformType.MatrixArray;
		var value = this.getValue(name, type);
		return value as Array<Tea.Matrix4x4>;
	}

	setMatrixArray(name: string, value: Array<Tea.Matrix4x4>): void {
		var type = UniformType.MatrixArray;
		this.setValue(name, type, value);
	}

	getTexture(name: string): Tea.Texture {
		return this._textures[name];
	}

	setTexture(name: string, value: Tea.Texture): void {
		this._textures[name] = value;
	}

	getTextureOffset(name: string): Tea.Vector2 {
		name = this.textureOffsetName(name);
		var type = UniformType.Vector2;
		var value = this.getValue(name, type);
		return value as Tea.Vector2;
	}

	setTextureOffset(name: string, value: Tea.Vector2): void {
		name = this.textureOffsetName(name);
		var type = UniformType.Vector2;
		this.setValue(name, type, value);
	}

	getTextureScale(name: string): Tea.Vector2 {
		name = this.textureScaleName(name);
		var type = UniformType.Vector2;
		var value = this.getValue(name, type);
		return value as Tea.Vector2;
	}

	setTextureScale(name: string, value: Tea.Vector2): void {
		name = this.textureScaleName(name);
		var type = UniformType.Vector2;
		this.setValue(name, type, value);
	}

	getVector(name: string): Tea.Vector4 {
		var type = UniformType.Vector4;
		var value = this.getValue(name, type);
		return value as Tea.Vector4;
	}

	setVector(name: string, value: Tea.Vector4): void {
		var type = UniformType.Vector4;
		this.setValue(name, type, value);
	}

	getVectorArray(name: string): Array<Tea.Vector4> {
		var type = UniformType.Vector4Array;
		var value = this.getValue(name, type);
		return value as Array<Tea.Vector4>;
	}

	setVectorArray(name: string, value: Array<Tea.Vector4>): void {
		var type = UniformType.Vector4Array;
		this.setValue(name, type, value);
	}

	eachProperty(callback: (name: string, item: UniformItem) => void): void {
		var uniforms = this._uniforms;
		var keys = Object.keys(uniforms);
		for (var key of keys) {
			var item = uniforms[key];
			if (key == null || key === "" || item == null) {
				continue;
			}
			callback(key, item);
		}
	}

	toJSON(): Object {
		var json = {
			_type: "Material",
			renderQueue: this.renderQueue,
			//color: this.color,
			//mainTexture: this.mainTexture.toJSON(),
			//mainTextureOffset: this.mainTextureOffset,
			//mainTextureScale: this.mainTextureScale,
			uniforms: [],
			textures: [],
			shader: this.shader.toJSON()
		};
		var keys = Object.keys(this._uniforms);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			json.uniforms.push({
				key: key,
				value: this._uniforms[key]
			});
		}
		keys = Object.keys(this._textures);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			json.textures.push({
				key: key,
				value: this._textures[key]
			});
		}
		return json;
	}

	protected getValue(name: string, type: UniformType): UniformValue {
		if (name == null || name === "") {
			return null;
		}
		if (this.isValidType(name, type) === false) {
			return null;
		}
		var item = this._uniforms[name];
		return item.value;
	}

	protected setValue(name: string, type: UniformType, value: UniformValue): void {
		if (name == null || name === "") {
			return;
		}
		var item = new UniformItem(type, value);
		this._uniforms[name] = item;
	}

	protected isValidType(name: string, type: UniformType): boolean {
		var item = this._uniforms[name];
		if (item == null) {
			return false;
		}
		return item.type === type;
	}

	protected textureOffsetName(name: string): string {
		if (name == null || name === "") {
			return "";
		}
		return "uv" + name;
	}

	protected textureScaleName(name: string): string {
		if (name == null || name === "") {
			return "";
		}
		return name + "_ST";
	}
}
