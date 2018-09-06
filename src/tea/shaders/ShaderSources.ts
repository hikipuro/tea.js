export module ShaderSources {
	export const defaultVS = `
		attribute vec4 vertex;
		attribute vec3 normal;
		attribute vec2 texcoord;
		attribute vec4 color;

		uniform mat4 TEA_MATRIX_MVP;
		uniform mat4 TEA_MATRIX_MV;
		uniform mat4 TEA_MATRIX_P;
		uniform mat4 TEA_MATRIX_V;
		uniform mat4 TEA_MATRIX_I_V;
		uniform mat4 TEA_OBJECT_TO_WORLD;
		uniform mat4 TEA_WORLD_TO_OBJECT;
		uniform mat4 _LightCamera;
		uniform mat4 tMatrix;
		//uniform mat4 invMatrix;
		uniform vec3 lightDirection;
		uniform vec3 eyeDirection;
		uniform vec3 ambientColor;
		uniform bool receiveShadows;

		varying vec3 vNormal;
		varying vec2 vTexCoord;
		varying vec4 vColor;
		varying vec4 vDepth;
		varying vec4 vShadowTexCoord;
		varying vec3 vLightDirection;
		varying vec3 vViewDirection;
		varying vec3 vAmbientColor;

		void main() {
			vec3 norm = normalize((TEA_OBJECT_TO_WORLD * vec4(normal, 0.0)).xyz);
			/*vec3 viewDirection = normalize(
				vec3(
					TEA_MATRIX_I_V * vec4(0.0, 0.0, 0.0, 1.0) -
					TEA_OBJECT_TO_WORLD * vertex
				)
			);*/
			vec3 viewDirection = eyeDirection;
			float diffuse = max(0.0, dot(norm, lightDirection));
			float attenuation = 1.0;
			float shininess = 5.0;
			float specular = 0.0;

			if (diffuse >= 0.0) {
				vec3 ref = reflect(-lightDirection, norm);
				specular = dot(ref, viewDirection);
				specular = max(0.0, specular);
				specular = attenuation * pow(specular, shininess);
			}
			vColor = vec4(ambientColor + vec3(diffuse + specular), 1.0);
			vTexCoord = texcoord;

			vec3 n = norm;
			vec3 t = normalize(cross(norm, vec3(0.0, 1.0, 0.0)));
			vec3 b = cross(n, t);
			vViewDirection.x = dot(t, viewDirection);
			vViewDirection.y = dot(b, viewDirection);
			vViewDirection.z = dot(n, viewDirection);
			vViewDirection = normalize(vViewDirection);
			vLightDirection.x = dot(t, lightDirection);
			vLightDirection.y = dot(b, lightDirection);
			vLightDirection.z = dot(n, lightDirection);
			vLightDirection = normalize(vLightDirection);
			vAmbientColor = ambientColor;

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
		uniform sampler2D _NormalTex;
		uniform int TEA_CAMERA_STEREO;
		uniform vec2 uv_MainTex;
		uniform vec2 _MainTex_ST;
		uniform vec2 uv_ShadowTex;
		uniform vec2 _ShadowTex_ST;
		uniform vec2 uv_NormalTex;
		uniform vec2 _NormalTex_ST;
		uniform bool useColor;
		uniform bool receiveShadows;

		varying vec3 vNormal;
		varying vec2 vTexCoord;
		varying vec4 vColor;
		varying vec4 vDepth;
		varying vec4 vShadowTexCoord;
		varying vec3 vLightDirection;
		varying vec3 vViewDirection;
		varying vec3 vAmbientColor;

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

			vec4 col = vColor;
			
			vec3 normal = (texture2D(_NormalTex, (uv_NormalTex + vTexCoord) / _NormalTex_ST)).rgb;
			if (normal != vec3(1.0)) {
				normal = 2.0 * normal - 1.0;
				normal.z *= 1.0 / 0.8;
				normal = normalize(normal);
				float diffuse = max(0.0, dot(normal, vLightDirection));
				float attenuation = 1.0;
				float shininess = 5.0;
				float specular = 0.0;
				if (diffuse >= 0.0) {
					vec3 ref = reflect(-vLightDirection, normal);
					specular = dot(ref, vViewDirection);
					specular = max(0.0, specular);
					specular = attenuation * pow(specular, shininess);
				}
				col = vec4(vAmbientColor + vec3(diffuse + specular), 1.0);
			}
			
			vec4 tex = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
			if (!receiveShadows) {
				if (useColor) {
					gl_FragColor = tex * _Color * col;
				} else {
					gl_FragColor = tex * col;
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
			if (useColor) {
				gl_FragColor = tex * _Color * col * depthColor;
			} else {
				gl_FragColor = tex * col * depthColor;
			}
			//gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		}
	`;

	export const flatVS = `
		attribute vec4 vertex;
		attribute vec3 normal;
		attribute vec2 texcoord;
		attribute vec4 color;

		uniform mat4 TEA_MATRIX_MVP;
		uniform vec3 ambientColor;

		varying vec3 vPosition;
		varying vec2 vTexCoord;
		varying vec4 vColor;

		void main() {
			vColor = vec4(ambientColor, 1.0);
			vTexCoord = texcoord;
			vec4 v = TEA_MATRIX_MVP * vertex;
			vPosition = v.xyz;
			gl_Position = v;
		}
	`;

	export const flatFS = `
		#extension GL_OES_standard_derivatives : enable
		precision mediump float;

		uniform int TEA_CAMERA_STEREO;
		uniform sampler2D _MainTex;
		uniform vec2 uv_MainTex;
		uniform vec2 _MainTex_ST;
		uniform vec3 lightDirection;

		varying vec3 vPosition;
		varying vec2 vTexCoord;
		varying vec4 vColor;

		void main() {
			if (TEA_CAMERA_STEREO != 0) {
				float stereoMod = float(TEA_CAMERA_STEREO - 1);
				if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
					discard;
				}
			}

			vec3 dx = dFdx(vPosition);
			vec3 dy = dFdy(vPosition);
			vec3 n = normalize(cross(dx, dy));
			float diffuse = max(0.0, dot(n, -lightDirection));

			vec4 tex = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
			vec4 color = vec4(vColor.xyz + vec3(diffuse), 1.0);
			gl_FragColor = tex * color;
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
