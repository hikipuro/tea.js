import { Line } from "./math/Line";
import { LineSegment } from "./math/LineSegment";
import { Mathf } from "./math/Mathf";
import { Matrix4 } from "./math/Matrix4";
import { Matrix4x4 } from "./math/Matrix4x4";
import { Plane } from "./math/Plane";
import { Polygon } from "./math/Polygon";
import { Quaternion } from "./math/Quaternion";
import { Rect } from "./math/Rect";
import { Vector2 } from "./math/Vector2";
import { Vector3 } from "./math/Vector3";
import { Vector4 } from "./math/Vector4";

import { ArrayUtil } from "./util/ArrayUtil";
import { Color } from "./util/Color";
import { Cursor, CursorType } from "./util/Cursor";
import { EventDispatcher } from "./util/EventDispatcher";
import { File } from "./util/File";
import { FilterMode } from "./util/FilterMode";
import { FontStyle } from "./util/FontStyle";
import { MatrixChecker } from "./util/MatrixChecker";
import { Screen } from "./util/Screen";
import { Space } from "./util/Space";
import { TextAlignment } from "./util/TextAlignment";
import { TextAnchor } from "./util/TextAnchor";
import { TextureDimension } from "./util/TextureDimension";
import { TextureWrapMode } from "./util/TextureWrapMode";
import { Time } from "./util/Time";

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
import { Material, UniformType } from "./object/Material";
import { MeshRenderer } from "./object/MeshRenderer";
import { Shader } from "./object/Shader";
import { TextMesh } from "./object/TextMesh";
import { Texture } from "./object/Texture";
import { Transform } from "./object/Transform";

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
	Line,
	LineSegment,
	Mathf,
	//Matrix4,
	Matrix4x4,
	Plane,
	Polygon,
	Quaternion,
	Rect,
	Vector2,
	Vector3,
	Vector4,

	ArrayUtil,
	Color,
	Cursor,
	CursorType,
	EventDispatcher,
	File,
	FilterMode,
	FontStyle,
	MatrixChecker,
	Screen,
	Space,
	TextAlignment,
	TextAnchor,
	TextureDimension,
	TextureWrapMode,
	Time,

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
	Material,
	UniformType,
	MeshRenderer,
	Scene,
	Script,
	Shader,
	TextMesh,
	Texture,
	Transform
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
if (window.performance != null && window.performance.timing != null) {
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
