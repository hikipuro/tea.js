export { AABB } from "./collision/AABB";
export { Line } from "./collision/Line";
export { LineSegment } from "./collision/LineSegment";
export { Plane } from "./collision/Plane";
export { Polygon } from "./collision/Polygon";
export { Sphere } from "./collision/Sphere";

export { ParticleSystem } from "./component/ParticleSystem";

export { Mathf } from "./math/Mathf";
export { Matrix4x4 } from "./math/Matrix4x4";
export { Quaternion } from "./math/Quaternion";
export { Rect } from "./math/Rect";
export { Vector2 } from "./math/Vector2";
export { Vector3 } from "./math/Vector3";
export { Vector4 } from "./math/Vector4";

export { ArrayBufferUtil } from "./util/ArrayBufferUtil";
export { ArrayUtil } from "./util/ArrayUtil";
export { CameraStereoMode } from "./util/CameraStereoMode";
export { Color } from "./util/Color";
export { Cursor, CursorType } from "./util/Cursor";
export { EventDispatcher } from "./util/EventDispatcher";
export { File } from "./util/File";
export { FilterMode } from "./util/FilterMode";
export { FontStyle } from "./util/FontStyle";
export { MatrixChecker } from "./util/MatrixChecker";
export { PrimitiveType } from "./util/PrimitiveType";
export { Screen } from "./util/Screen";
export { Space } from "./util/Space";
export { Stats } from "./util/Stats";
export { TextAlignment } from "./util/TextAlignment";
export { TextAnchor } from "./util/TextAnchor";
export { TextureDimension } from "./util/TextureDimension";
export { TextureWrapMode } from "./util/TextureWrapMode";
export { Time } from "./util/Time";

export { Bounds } from "./object/Bounds";
export { Camera } from "./object/Camera";
export { Collider } from "./object/Collider";
export { Component } from "./object/Component";
export { Mesh } from "./object/Mesh";
export { MeshFilter } from "./object/MeshFilter";
export { Object3D } from "./object/Object3D";
export { ParticleSystemRenderer } from "./object/ParticleSystemRenderer";
export { Ray } from "./object/Ray";
export { RaycastHit } from "./object/RaycastHit";
export { Renderer } from "./object/Renderer";
export { LineRenderer } from "./object/LineRenderer";
export { Material, UniformType } from "./object/Material";
export { MeshRenderer } from "./object/MeshRenderer";
export { TextMesh } from "./object/TextMesh";
export { Texture } from "./object/Texture";
export { Transform } from "./object/Transform";

export { Shader } from "./shader/Shader";
export { ShaderBlend } from "./shader/ShaderBlend";
export { ShaderBlendEquation } from "./shader/ShaderBlendEquation";
export { ShaderBlendFunc } from "./shader/ShaderBlendFunc";
export { ShaderColorMask } from "./shader/ShaderColorMask";
export { ShaderFace } from "./shader/ShaderFace";
export { ShaderHint } from "./shader/ShaderHint";
export { ShaderSettings } from "./shader/ShaderSettings";
export { ShaderStencil } from "./shader/ShaderStencil";
export { ShaderStencilMask } from "./shader/ShaderStencilMask";
export { ShaderStencilOp } from "./shader/ShaderStencilOp";
export { ShaderTestFunc } from "./shader/ShaderTestFunc";

export { App } from "./App";
export { DaeReader } from "./DaeReader";
export { GLCapabilities } from "./GLCapabilities";
export { GLExtensions } from "./GLExtensions";
export { GLParameters } from "./GLParameters";
export { Keyboard } from "./Keyboard";
export { Mouse } from "./Mouse";
export { ObjReader } from "./ObjReader";
export { Primitives } from "./Primitives";
export { Scene } from "./Scene";
export { Script } from "./Script";

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
