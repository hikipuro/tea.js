export * from "./collision/AABB";
export * from "./collision/Line";
export * from "./collision/LineSegment";
export * from "./collision/Plane";
export * from "./collision/Polygon";
export * from "./collision/Sphere";

export * from "./component/ParticleSystem";

export * from "./math/Mathf";
export * from "./math/Matrix4x4";
export * from "./math/Quaternion";
export * from "./math/Rect";
export * from "./math/Vector2";
export * from "./math/Vector3";
export * from "./math/Vector4";

export * from "./util/ArrayBufferUtil";
export * from "./util/ArrayUtil";
export * from "./util/CameraStereoMode";
export * from "./util/Color";
export * from "./util/Cursor";
export * from "./util/EventDispatcher";
export * from "./util/File";
export * from "./util/FilterMode";
export * from "./util/FontStyle";
export * from "./util/MatrixChecker";
export * from "./util/PrimitiveType";
export * from "./util/Screen";
export * from "./util/Space";
export * from "./util/Stats";
export * from "./util/TextAlignment";
export * from "./util/TextAnchor";
export * from "./util/TextureDimension";
export * from "./util/TextureWrapMode";
export * from "./util/Time";

export * from "./object/Bounds";
export * from "./object/Camera";
export * from "./object/Collider";
export * from "./object/Component";
export * from "./object/Light";
export * from "./object/LightCamera";
export * from "./object/Mesh";
export * from "./object/MeshFilter";
export * from "./object/Object3D";
export * from "./object/ParticleSystemRenderer";
export * from "./object/Ray";
export * from "./object/RaycastHit";
export * from "./object/Renderer";
export * from "./object/RenderTexture";
export * from "./object/LineRenderer";
export * from "./object/Material";
export * from "./object/MeshRenderer";
export * from "./object/TextMesh";
export * from "./object/Texture";
export * from "./object/Transform";

export * from "./shader/Shader";
export * from "./shader/ShaderBlend";
export * from "./shader/ShaderBlendEquation";
export * from "./shader/ShaderBlendFunc";
export * from "./shader/ShaderColorMask";
export * from "./shader/ShaderFace";
export * from "./shader/ShaderHint";
export * from "./shader/ShaderSettings";
export * from "./shader/ShaderStencil";
export * from "./shader/ShaderStencilMask";
export * from "./shader/ShaderStencilOp";
export * from "./shader/ShaderTestFunc";

export * from "./App";
export * from "./DaeReader";
export * from "./GLCapabilities";
export * from "./GLExtensions";
export * from "./GLParameters";
export * from "./Keyboard";
export * from "./Mouse";
export * from "./ObjReader";
export * from "./Primitives";
export * from "./Scene";
export * from "./Script";

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
