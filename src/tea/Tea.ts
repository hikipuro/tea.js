import { Matrix4 } from "./math/Matrix4";
import { Vector2 } from "./math/Vector2";
import { Vector3 } from "./math/Vector3";
import { Vector4 } from "./math/Vector4";
import { Rect } from "./math/Rect";

import { ArrayUtil } from "./util/ArrayUtil";
import { Color } from "./util/Color";
import { Cursor, CursorType } from "./util/Cursor";
import { File } from "./util/File";
import { Screen } from "./util/Screen";

import { App } from "./App";
import { Bounds } from "./object/Bounds";
import { Camera } from "./object/Camera";
import { Collider } from "./object/Collider";
import { Component } from "./object/Component";
import { DaeReader } from "./DaeReader";
import { GLCapabilities } from "./GLCapabilities";
import { GLExtensions } from "./GLExtensions";
import { GLParameters } from "./GLParameters";
import { Mesh } from "./object/Mesh";
import { Object3D } from "./object/Object3D";
import { Ray } from "./object/Ray";
import { RaycastHit } from "./object/RaycastHit";
import { ObjReader } from "./ObjReader";
import { Primitives } from "./Primitives";
import { Renderer } from "./object/Renderer";
import { LineRenderer } from "./object/LineRenderer";
import { MeshRenderer } from "./object/MeshRenderer";
import { Scene } from "./Scene";
import { Script } from "./Script";
import { Shader } from "./object/Shader";
import { Texture } from "./object/Texture";

export {
	Matrix4,
	Vector2,
	Vector3,
	Vector4,
	Rect,

	ArrayUtil,
	Color,
	Cursor,
	CursorType,
	File,
	Screen,

	App,
	Bounds,
	Camera,
	Collider,
	Component,
	DaeReader,
	GLCapabilities,
	GLExtensions,
	GLParameters,
	Mesh,
	Object3D,
	Ray,
	RaycastHit,
	ObjReader,
	Primitives,
	Renderer,
	LineRenderer,
	MeshRenderer,
	Scene,
	Script,
	Shader,
	Texture
}

export const Epsilon = 1.192093E-07;
export const Deg2Rad = Math.PI / 180;
export const Rad2Deg = 180 / Math.PI;

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

export function clamp01(value: number): number {
	value = Math.max(value, 0);
	return Math.min(value, 1);
}

export function lerp(a: number, b: number, t: number): number {
	t = clamp01(t);
	return a + (b - a) * t;
}

export function lerpUnclamped(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

export function inverseLerp(a: number, b: number, value: number): number {
	return (value - a) / (b - a);
}

export function pingPong(t: number, length: number): number {
	const d = Math.floor(t / length) % 2;
	return length * d + (t % length) * (-d * 2 + 1);
}

export function smoothStep(from: number, to: number, t: number): number {
	t = from + (to - from) * t;
	const x = clamp01((t - from) / (to - from));
	return x * x * (3 - 2 * x) * (to - from) + from;
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
