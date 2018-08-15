import { Mathf } from "./math/Mathf";
import { Matrix4 } from "./math/Matrix4";
import { Matrix4x4 } from "./math/Matrix4x4";
import { Vector2 } from "./math/Vector2";
import { Vector3 } from "./math/Vector3";
import { Vector4 } from "./math/Vector4";
import { Rect } from "./math/Rect";

import { ArrayUtil } from "./util/ArrayUtil";
import { Color } from "./util/Color";
import { Cursor, CursorType } from "./util/Cursor";
import { File } from "./util/File";
import { MatrixChecker } from "./util/MatrixChecker";
import { Screen } from "./util/Screen";

import { Bounds } from "./object/Bounds";
import { Camera } from "./object/Camera";
import { Collider } from "./object/Collider";
import { Component } from "./object/Component";
import { Mesh } from "./object/Mesh";
import { Object3D } from "./object/Object3D";
import { Ray } from "./object/Ray";
import { RaycastHit } from "./object/RaycastHit";
import { Renderer } from "./object/Renderer";
import { LineRenderer } from "./object/LineRenderer";
import { MeshRenderer } from "./object/MeshRenderer";
import { Shader } from "./object/Shader";
import { Texture } from "./object/Texture";

import { App } from "./App";
import { DaeReader } from "./DaeReader";
import { GLCapabilities } from "./GLCapabilities";
import { GLExtensions } from "./GLExtensions";
import { GLParameters } from "./GLParameters";
import { Keyboard } from "./Keyboard";
import { Mouse } from "./Mouse";
import { ObjReader } from "./ObjReader";
import { Primitives } from "./Primitives";
import { Scene } from "./Scene";
import { Script } from "./Script";

export {
	Mathf,
	//Matrix4,
	Matrix4x4,
	Vector2,
	Vector3,
	Vector4,
	Rect,

	ArrayUtil,
	Color,
	Cursor,
	CursorType,
	File,
	MatrixChecker,
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
	Keyboard,
	Mouse,
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
}
export { now };

export function benchmark(func: Function, iteration: number = 1): number {
	const start = now();
	for (var i = 0; i < iteration; i++) {
		func();
	}
	return now() - start;
}
