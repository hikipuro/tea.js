import { Matrix4 } from "./math/Matrix4";
import { Vector2 } from "./math/Vector2";
import { Vector3 } from "./math/Vector3";
import { Vector4 } from "./math/Vector4";

import { Color } from "./util/Color";
import { File } from "./util/File";
import { Screen } from "./util/Screen";

import { App } from "./App";
import { Bounds } from "./object/Bounds";
import { Camera } from "./object/Camera";
import { DaeReader } from "./DaeReader";
import { GLCapabilities } from "./GLCapabilities";
import { GLParameters } from "./GLParameters";
import { Mesh } from "./object/Mesh";
import { Object3D } from "./object/Object3D";
import { ObjReader } from "./ObjReader";
import { Primitives } from "./Primitives";
import { Renderer } from "./object/Renderer";
import { Scene } from "./Scene";
import { Script } from "./Script";
import { Shader } from "./object/Shader";
import { Texture } from "./object/Texture";

export {
	Matrix4,
	Vector2,
	Vector3,
	Vector4,

	Color,
	File,
	Screen,

	App,
	Bounds,
	Camera,
	DaeReader,
	GLCapabilities,
	GLParameters,
	Mesh,
	Object3D,
	ObjReader,
	Primitives,
	Renderer,
	Scene,
	Script,
	Shader,
	Texture
}

/**
 * degrees to radians.
 * @export
 * @param {number} degrees
 * @returns {number} degrees * Math.PI / 180
 */
export function radians(degrees: number): number {
	return degrees * Math.PI / 180;
}

/**
 * radians to degrees.
 * @export
 * @param {number} radians 
 * @returns {number} degrees * Math.PI / 180
 */
export function degrees(radians: number): number {
	return radians * 180 / Math.PI;
}

/**
 * clamps given value between min and max.
 * @export
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value: number, min: number, max: number): number {
	value = Math.max(value, min);
	return Math.min(value, max);
}

/**
 * get text content from the HTML element.
 * @export
 * @param {string} id element id without "#" prefix.
 * @returns {string} element.textContent.
 */
export function getElementText(id: string): string {
	var element = document.getElementById(id);
	if (!element) {
		return "";
	}
	return element.textContent;
}

/**
 * Date.now()
 * @export
 */
let now = function (): number {
	return Date.now();
}
if (performance != null) {
	const navigationStart = performance.timing.navigationStart;
	now = function (): number {
		return navigationStart + performance.now();
	}
} else {
}
export { now };
