import { AABB } from "./collision/AABB";
import { Line } from "./collision/Line";
import { LineSegment } from "./collision/LineSegment";
import { Plane } from "./collision/Plane";
import { Polygon } from "./collision/Polygon";
import { Sphere } from "./collision/Sphere";

import { ParticleSystem } from "./component/ParticleSystem";

import { Mathf } from "./math/Mathf";
import { Matrix4x4 } from "./math/Matrix4x4";
import { Quaternion } from "./math/Quaternion";
import { Rect } from "./math/Rect";
import { Vector2 } from "./math/Vector2";
import { Vector3 } from "./math/Vector3";
import { Vector4 } from "./math/Vector4";

import { ArrayBufferUtil } from "./util/ArrayBufferUtil";
import { ArrayUtil } from "./util/ArrayUtil";
import { CameraStereoMode } from "./util/CameraStereoMode";
import { Color } from "./util/Color";
import { Cursor, CursorType } from "./util/Cursor";
import { EventDispatcher } from "./util/EventDispatcher";
import { File } from "./util/File";
import { FilterMode } from "./util/FilterMode";
import { FontStyle } from "./util/FontStyle";
import { MatrixChecker } from "./util/MatrixChecker";
import { PrimitiveType } from "./util/PrimitiveType";
import { Screen } from "./util/Screen";
import { Space } from "./util/Space";
import { Stats } from "./util/Stats";
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
import { MeshFilter } from "./object/MeshFilter";
import { Object3D } from "./object/Object3D";
import { ParticleSystemRenderer } from "./object/ParticleSystemRenderer";
import { Ray } from "./object/Ray";
import { RaycastHit } from "./object/RaycastHit";
import { Renderer } from "./object/Renderer";
import { LineRenderer } from "./object/LineRenderer";
import { Material, UniformType } from "./object/Material";
import { MeshRenderer } from "./object/MeshRenderer";
import { TextMesh } from "./object/TextMesh";
import { Texture } from "./object/Texture";
import { Transform } from "./object/Transform";

import { Shader } from "./shader/Shader";
import { ShaderBlend } from "./shader/ShaderBlend";
import { ShaderBlendEquation } from "./shader/ShaderBlendEquation";
import { ShaderBlendFunc } from "./shader/ShaderBlendFunc";
import { ShaderColorMask } from "./shader/ShaderColorMask";
import { ShaderFace } from "./shader/ShaderFace";
import { ShaderHint } from "./shader/ShaderHint";
import { ShaderSettings } from "./shader/ShaderSettings";
import { ShaderStencil } from "./shader/ShaderStencil";
import { ShaderStencilMask } from "./shader/ShaderStencilMask";
import { ShaderStencilOp } from "./shader/ShaderStencilOp";
import { ShaderTestFunc } from "./shader/ShaderTestFunc";

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
	AABB,
	Line,
	LineSegment,
	Plane,
	Polygon,
	Sphere,

	ParticleSystem,

	Mathf,
	Matrix4x4,
	Quaternion,
	Rect,
	Vector2,
	Vector3,
	Vector4,

	ArrayBufferUtil,
	ArrayUtil,
	CameraStereoMode,
	Color,
	Cursor,
	CursorType,
	EventDispatcher,
	File,
	FilterMode,
	FontStyle,
	MatrixChecker,
	PrimitiveType,
	Screen,
	Space,
	Stats,
	TextAlignment,
	TextAnchor,
	TextureDimension,
	TextureWrapMode,
	Time,

	Bounds,
	Camera,
	Collider,
	Component,
	Mesh,
	MeshFilter,
	Object3D,
	ParticleSystemRenderer,
	Ray,
	RaycastHit,
	Renderer,
	LineRenderer,
	Material,
	UniformType,
	MeshRenderer,
	TextMesh,
	Texture,
	Transform,

	Shader,
	ShaderBlend,
	ShaderBlendEquation,
	ShaderBlendFunc,
	ShaderColorMask,
	ShaderFace,
	ShaderHint,
	ShaderSettings,
	ShaderStencil,
	ShaderStencilMask,
	ShaderStencilOp,
	ShaderTestFunc,

	App,
	DaeReader,
	GLCapabilities,
	GLExtensions,
	GLParameters,
	Keyboard,
	Mouse,
	ObjReader,
	Primitives,
	Scene,
	Script,
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

export function openDownloadDialog(data: ArrayBuffer, type: string, filename: string): void {
	if (type == null || type === "" || filename == null || filename === "") {
		return;
	}
	var blob = new Blob([data], {type: type});
	var url = URL.createObjectURL(blob);
	var link = document.createElement("a");
	document.body.appendChild(link);
	link.href = url;
	link.download = filename;
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
