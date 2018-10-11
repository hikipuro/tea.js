export * from "./editor/Editor";

export * from "./collisions/AABB";
export * from "./collisions/Line";
export * from "./collisions/LineSegment";
export * from "./collisions/Plane";
export * from "./collisions/Polygon";
export * from "./collisions/Sphere";

export * from "./components/BoxCollider";
export * from "./components/Camera";
export * from "./components/Collider";
export * from "./components/Component";
export * from "./components/Light";
export * from "./components/LineRenderer";
export * from "./components/MeshFilter";
export * from "./components/MeshRenderer";
export * from "./components/ParticleSystem";
export * from "./components/ParticleSystemRenderer";
export * from "./components/Renderer";
export * from "./components/Rigidbody";
export * from "./components/Script";
export * from "./components/ShadowMapCamera";
//export * from "./components/Transform";

export * from "./enums/CameraClearFlags";
export * from "./enums/CameraStereoMode";
export * from "./enums/FilterMode";
export * from "./enums/FontStyle";
export * from "./enums/ForceMode";
export * from "./enums/GradientMode";
export * from "./enums/LightType";
export * from "./enums/PrimitiveType";
export * from "./enums/RigidbodyConstraints";
export * from "./enums/ScreenOrientation";
export * from "./enums/Space";
export * from "./enums/TextAlignment";
export * from "./enums/TextAnchor";
export * from "./enums/TextureDimension";
export * from "./enums/TextureWrapMode";
export * from "./enums/WeightedMode";
export * from "./enums/WrapMode";

export * from "./math/Bounds";
export * from "./math/Mathf";
export * from "./math/Matrix4x4";
export * from "./math/Quaternion";
export * from "./math/Range";
export * from "./math/Rect";
export * from "./math/Vector2";
export * from "./math/Vector3";
export * from "./math/Vector4";

export * from "./sounds/AppAudio";
export * from "./sounds/AudioClip";
export * from "./sounds/AudioSource";

export * from "./utils/AnimationCurve";
export * from "./utils/ArrayBufferUtil";
export * from "./utils/ArrayUtil";
export * from "./utils/Color";
export * from "./utils/Cursor";
export * from "./utils/Directory";
export * from "./utils/EventDispatcher";
export * from "./utils/File";
export * from "./utils/GeometryUtil";
export * from "./utils/Gradient";
export * from "./utils/GradientAlphaKey";
export * from "./utils/GradientColorKey";
export * from "./utils/Keyframe";
export * from "./utils/MatrixChecker";
export * from "./utils/Random";
export * from "./utils/Screen";
export * from "./utils/Stats";
export * from "./utils/StringUtil";
export * from "./utils/Time";

export * from "./objects/LayerMask";
export * from "./objects/Mesh";
export * from "./objects/Object3D";
export * from "./objects/Physics";
export * from "./objects/PostProcessingRenderer";
export * from "./objects/Primitives";
export * from "./objects/Ray";
export * from "./objects/RaycastHit";
export * from "./objects/RenderSettings";
export * from "./objects/RenderTexture";
export * from "./objects/Material";
export * from "./objects/Scene";
export * from "./objects/Skybox";
export * from "./objects/TextMesh";
export * from "./objects/Texture";

export * from "./parsers/DaeReader";
export * from "./parsers/ObjReader";

export * from "./particles/Particle";
export * from "./particles/enums/ParticleSystemCurveMode";
export * from "./particles/enums/ParticleSystemCustomData";
export * from "./particles/enums/ParticleSystemEmitterVelocityMode";
export * from "./particles/enums/ParticleSystemGradientMode";
export * from "./particles/enums/ParticleSystemInheritVelocityMode";
export * from "./particles/enums/ParticleSystemMeshShapeType";
export * from "./particles/enums/ParticleSystemOverlapAction";
export * from "./particles/enums/ParticleSystemScalingMode";
export * from "./particles/enums/ParticleSystemShapeMultiModeValue";
export * from "./particles/enums/ParticleSystemShapeTextureChannel";
export * from "./particles/enums/ParticleSystemShapeType";
export * from "./particles/enums/ParticleSystemSimulationSpace";
export * from "./particles/enums/ParticleSystemStopAction";

export * from "./shaders/Shader";
export * from "./shaders/ShaderBlend";
export * from "./shaders/ShaderBlendEquation";
export * from "./shaders/ShaderBlendFunc";
export * from "./shaders/ShaderColorMask";
export * from "./shaders/ShaderFace";
export * from "./shaders/ShaderHint";
export * from "./shaders/ShaderSettings";
export * from "./shaders/ShaderSources";
export * from "./shaders/ShaderStencil";
export * from "./shaders/ShaderStencilMask";
export * from "./shaders/ShaderStencilOp";
export * from "./shaders/ShaderTestFunc";

export * from "./App";
export * from "./GLCapabilities";
export * from "./GLExtensions";
export * from "./GLParameters";
export * from "./Keyboard";
export * from "./Mouse";

/**
 * degrees to radians.
 * @export
 * @param {number} degrees
 * @returns {number} degrees * Math.PI / 180
 */
export function radians(degrees: number): number {
	return degrees * Math.PI / 180.0;
}

/**
 * radians to degrees.
 * @export
 * @param {number} radians 
 * @returns {number} degrees * Math.PI / 180
 */
export function degrees(radians: number): number {
	return radians * 180.0 / Math.PI;
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
var now = function (): number {
	return Date.now();
}
if (window.performance != null && window.performance.timing != null) {
	var navigationStart = performance.timing.navigationStart;
	now = function (): number {
		return navigationStart + performance.now();
	}
}
export { now };

export function benchmark(func: Function, iteration: number = 1): number {
	var start = now();
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


import { Vector2 } from "./math/Vector2";
import { Vector3 } from "./math/Vector3";
import { Vector4 } from "./math/Vector4";
import { Quaternion } from "./math/Quaternion";
import { Matrix4x4 } from "./math/Matrix4x4";

export function vec2(x: number = 0, y: number = 0): Vector2 {
	return new Vector2(x, y);
}
export function vec3(x: number = 0, y: number = 0, z: number = 0): Vector3 {
	return new Vector3(x, y, z);
}
export function vec4(x: number = 0, y: number = 0, z: number = 0, w: number = 0): Vector4 {
	return new Vector4(x, y, z, w);
}
export function rot(x: number = 0, y: number = 0, z: number = 0): Quaternion {
	return Quaternion.euler(x, y, z);
}
export function mat4(array: Array<number> = null): Matrix4x4 {
	if (array == null) {
		return new Matrix4x4();
	}
	return Matrix4x4.fromArray(array);
}
export function imat4(): Matrix4x4 {
	return Matrix4x4.identity;
}
