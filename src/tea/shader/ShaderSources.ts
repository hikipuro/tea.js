export module ShaderSources {
	export const defaultVS = `
		attribute vec4 vertex;
		attribute vec3 normal;
		attribute vec2 texcoord;
		attribute vec4 color;

		uniform mat4 TEA_MATRIX_MVP;
		uniform mat4 TEA_OBJECT_TO_WORLD;
		uniform mat4 _LightCamera;
		uniform mat4 tMatrix;
		//uniform mat4 invMatrix;
		uniform vec3 lightDirection;
		uniform vec3 eyeDirection;
		uniform vec3 ambientColor;
		uniform bool receiveShadows;

		varying vec2 vTexCoord;
		varying vec4 vColor;
		varying vec4 vDepth;
		varying vec4 vShadowTexCoord;

		void main() {
			vec3 mvpNormal = normalize(TEA_MATRIX_MVP * vec4(normal, 0.0)).xyz;
			vec3 diffuse = vec3(max(0.0, dot(mvpNormal, lightDirection)));
			vec3 halfLE = normalize(eyeDirection + lightDirection);
			vec3 specular = vec3(5.0 * pow(max(0.0, dot(reflect(lightDirection, mvpNormal), eyeDirection)), 5.5));
			vec4 light = vec4(ambientColor + diffuse + specular, 1.0);
			//vec4 light = vec4(ambientColor + specular, 1.0);
			vColor = light;
			vTexCoord = texcoord;
			if (receiveShadows) {
				vDepth = _LightCamera * vertex;
				//vShadowTexCoord = tMatrix * vertex;
				vShadowTexCoord = tMatrix * (TEA_OBJECT_TO_WORLD * vertex);
			}
			gl_Position = TEA_MATRIX_MVP * vertex;
		}
	`;

	export const defaultFS = `
		precision mediump float;

		uniform vec4 _Color;
		uniform sampler2D _MainTex;
		uniform sampler2D _ShadowTex;
		uniform int TEA_CAMERA_STEREO;
		uniform vec2 uv_MainTex;
		uniform vec2 _MainTex_ST;
		uniform vec2 uv_ShadowTex;
		uniform vec2 _ShadowTex_ST;
		uniform bool useColor;
		uniform bool receiveShadows;

		varying vec2 vTexCoord;
		varying vec4 vColor;
		varying vec4 vDepth;
		varying vec4 vShadowTexCoord;

		float restDepth(vec4 RGBA) {
			const float rMask = 1.0;
			const float gMask = 1.0 / 255.0;
			const float bMask = 1.0 / (255.0 * 255.0);
			const float aMask = 1.0 / (255.0 * 255.0 * 255.0);
			float depth = dot(RGBA, vec4(rMask, gMask, bMask, aMask));
			return depth;
		}

		void main() {
			if (TEA_CAMERA_STEREO != 0) {
				float stereoMod = float(TEA_CAMERA_STEREO - 1);
				if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
					discard;
				}
			}

			if (!receiveShadows) {
				vec4 tex = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
				if (useColor) {
					gl_FragColor = tex * _Color * vColor;
				} else {
					gl_FragColor = tex * vColor;
				}
				return;
			}

			vec4 depth = vDepth;
			float shadow = restDepth(texture2DProj(_ShadowTex, vShadowTexCoord));
			vec4 depthColor = vec4(1.0);
			if (depth.w > 0.0) {
				vec4 lightCoord = depth / depth.w;
				if (lightCoord.z - 0.0001 > shadow) {
					depthColor = vec4(0.5, 0.5, 0.5, 1.0);
				}
			}
			vec4 tex = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
			if (useColor) {
				gl_FragColor = tex * _Color * vColor * depthColor;
			} else {
				gl_FragColor = tex * vColor * depthColor;
			}
			//gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		}
	`;

	export const depthVS = `
		attribute vec4 vertex;
		uniform mat4 TEA_MATRIX_MVP;
		varying vec4 vPosition;

		void main() {
			vPosition = TEA_MATRIX_MVP * vertex;
			gl_Position = vPosition;
		}
	`;

	export const depthFS = `
		precision mediump float;
		varying vec4 vPosition;

		vec4 convRGBA(float depth) {
			float r = depth;
			float g = fract(r * 255.0);
			float b = fract(g * 255.0);
			float a = fract(b * 255.0);
			float coef = 1.0 / 255.0;
			r -= g * coef;
			g -= b * coef;
			b -= a * coef;
			return vec4(r, g, b, a);
		}

		void main() {
			gl_FragColor = convRGBA(gl_FragCoord.z);
			//gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 1.0);
		}
	`;

	export const lineVS = `
		attribute vec4 vertex;
		uniform mat4 TEA_MATRIX_MVP;
		void main() {
			gl_Position = TEA_MATRIX_MVP * vertex;
		}
	`;

	export const lineFS = `
		precision mediump float;
		uniform int TEA_CAMERA_STEREO;
		uniform vec4 _Color;
		void main() {
			if (TEA_CAMERA_STEREO != 0) {
				float stereoMod = float(TEA_CAMERA_STEREO - 1);
				if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
					discard;
				}
			}
			gl_FragColor = _Color;
		}
	`;

	export const textVS = `
		attribute vec3 vertex;
		attribute vec2 texcoord;
		uniform mat4 TEA_MATRIX_MVP;
		varying vec2 vTexCoord;
		void main() {
			vTexCoord = texcoord;
			gl_Position = TEA_MATRIX_MVP * vec4(vertex, 1.0);
		}
	`;

	export const textFS = `
		precision mediump float;
		uniform sampler2D _MainTex;
		uniform int TEA_CAMERA_STEREO;
		uniform vec2 uv_MainTex;
		uniform vec2 _MainTex_ST;
		varying vec2 vTexCoord;
		void main() {
			if (TEA_CAMERA_STEREO != 0) {
				float stereoMod = float(TEA_CAMERA_STEREO - 1);
				if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
					discard;
				}
			}
			vec4 color = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
			if (color.a < 0.1) {
				discard;
			}
			gl_FragColor = color;
		}
	`;

	export const particleVS = `
		attribute vec3 vertex;
		attribute vec4 color;
		attribute float size;
		uniform mat4 TEA_MATRIX_MVP;
		//uniform float pointSize;
		varying vec4 vColor;
		void main() {
			vColor = color;
			gl_Position = TEA_MATRIX_MVP * vec4(vertex, 1.0);
			gl_PointSize = size;
		}
	`;

	export const particleFS = `
		precision mediump float;
		uniform int TEA_CAMERA_STEREO;
		varying vec4 vColor;
		void main() {
			if (TEA_CAMERA_STEREO != 0) {
				float stereoMod = float(TEA_CAMERA_STEREO - 1);
				if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
					discard;
				}
			}
			gl_FragColor = vColor;
		}
	`;
}
