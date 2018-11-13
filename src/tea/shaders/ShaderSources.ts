export module ShaderSources {
	export const defaultVS = `
		precision mediump int;

		struct TLight {
			vec4 color;
			vec4 position;
			vec4 direction;
			float range;
			float spotAngle;
		};

		const float Epsilon = 1.192093E-07;

		attribute vec4 vertex;
		attribute vec3 normal;
		attribute vec2 texcoord;
		attribute vec4 color;

		//uniform mat4 TEA_MATRIX_MVP;
		//uniform mat4 TEA_MATRIX_MV;
		uniform mat4 TEA_MATRIX_P;
		uniform mat4 TEA_MATRIX_V;
		uniform mat4 TEA_MATRIX_I_V;
		uniform mat4 TEA_OBJECT_TO_WORLD;
		//uniform mat4 TEA_WORLD_TO_OBJECT;
		uniform mat4 _LightCamera;
		//uniform mat4 tMatrix;
		uniform int lightCount;
		uniform TLight lights[4];
		uniform bool receiveShadows;

		varying vec3 vNormal;
		varying vec2 vTexCoord;
		varying vec4 vDepth;
		//varying vec4 vShadowTexCoord;
		varying vec4 vLightColor[4];
		varying vec3 vLightDirection[4];
		varying float vAttenuation[4];
		varying vec3 vViewDirection;

		vec3 getViewDirection(vec4 vertex) {
			return normalize(
				vec3(
					TEA_MATRIX_I_V * vec4(0.0, 0.0, 0.0, 1.0) -
					TEA_OBJECT_TO_WORLD * vertex
				)
			);
		}

		vec3 getNormal(vec3 normal) {
			return normalize((TEA_OBJECT_TO_WORLD * vec4(normal, 0.0)).xyz);
		}

		void main() {
			mat4 TEA_MATRIX_MVP = TEA_MATRIX_P * TEA_MATRIX_V * TEA_OBJECT_TO_WORLD;
			vec4 vert = TEA_OBJECT_TO_WORLD * vertex;
			vec3 norm = getNormal(normal);
			vec3 viewDirection = getViewDirection(vertex);
			
			/*
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
			*/
			//vColor = vec4(ambientColor, 1.0);
			//vLightSource = lights[0].position - vert;
			vTexCoord = texcoord;

			vec3 n = norm;
			vec3 t = normalize(cross(norm, vec3(Epsilon, 1.0, Epsilon)));
			vec3 b = cross(n, t);
			vViewDirection.x = dot(t, viewDirection);
			vViewDirection.y = dot(b, viewDirection);
			vViewDirection.z = dot(n, viewDirection);
			vViewDirection = normalize(vViewDirection);

			vec4 lightSource;
			float lightDistance;
			float lightType;
			vec3 d;

			if (lightCount >= 1) {
				lightSource = lights[0].position - vert;
				lightDistance = length(lightSource.xyz);
				lightType = lights[0].direction.w;
				if (lightType == 0.0) {
					d = lights[0].direction.xyz;
					vAttenuation[0] = 1.0;
				} else if (lightType == 1.0) {
					d = normalize(lightSource.xyz);
					vAttenuation[0] = min(1.0, (1.0 * lights[0].range) / lightDistance);
				} else {
					d = normalize(lightSource.xyz);
					float clampedCosine = max(0.0, dot(d, lights[0].direction.xyz));
					if (clampedCosine < cos(lights[0].spotAngle)) {
						vAttenuation[0] = 0.0;
					} else {
						float spotExponent = 20.0;
						vAttenuation[0] = min(1.0, (1.0 * lights[0].range) / lightDistance);
						vAttenuation[0] = vAttenuation[0] * pow(clampedCosine, spotExponent);
					}
				}
				vLightDirection[0].x = dot(t, d);
				vLightDirection[0].y = dot(b, d);
				vLightDirection[0].z = dot(n, d);
				vLightDirection[0] = normalize(vLightDirection[0]);
				vLightColor[0] = lights[0].color;
			}

			if (lightCount >= 2) {
				lightSource = lights[1].position - vert;
				lightDistance = length(lightSource.xyz);
				lightType = lights[1].direction.w;
				if (lightType == 0.0) {
					d = lights[1].direction.xyz;
					vAttenuation[1] = 1.0;
				} else if (lightType == 1.0) {
					d = normalize(lightSource.xyz);
					vAttenuation[1] = min(1.0, (1.0 * lights[1].range) / lightDistance);
				} else {
					d = normalize(lightSource.xyz);
					float clampedCosine = max(0.0, dot(d, lights[1].direction.xyz));
					if (clampedCosine < cos(lights[1].spotAngle)) {
						vAttenuation[1] = 0.0;
					} else {
						float spotExponent = 20.0;
						vAttenuation[1] = min(1.0, (1.0 * lights[1].range) / lightDistance);
						vAttenuation[1] = vAttenuation[1] * pow(clampedCosine, spotExponent);
					}
				}
				vLightDirection[1].x = dot(t, d);
				vLightDirection[1].y = dot(b, d);
				vLightDirection[1].z = dot(n, d);
				vLightDirection[1] = normalize(vLightDirection[1]);
				vLightColor[1] = lights[1].color;
			}

			if (lightCount >= 3) {
				lightSource = lights[2].position - vert;
				lightDistance = length(lightSource.xyz);
				lightType = lights[2].direction.w;
				if (lightType == 0.0) {
					d = lights[2].direction.xyz;
					vAttenuation[2] = 1.0;
				} else if (lightType == 1.0) {
					d = normalize(lightSource.xyz);
					vAttenuation[2] = min(1.0, (1.0 * lights[2].range) / lightDistance);
				} else {
					d = normalize(lightSource.xyz);
					float clampedCosine = max(0.0, dot(d, lights[2].direction.xyz));
					if (clampedCosine < cos(lights[2].spotAngle)) {
						vAttenuation[2] = 0.0;
					} else {
						float spotExponent = 20.0;
						vAttenuation[2] = min(1.0, (1.0 * lights[2].range) / lightDistance);
						vAttenuation[2] = vAttenuation[2] * pow(clampedCosine, spotExponent);
					}
				}
				vLightDirection[2].x = dot(t, d);
				vLightDirection[2].y = dot(b, d);
				vLightDirection[2].z = dot(n, d);
				vLightDirection[2] = normalize(vLightDirection[2]);
				vLightColor[2] = lights[2].color;
			}

			if (lightCount >= 4) {
				lightSource = lights[3].position - vert;
				lightDistance = length(lightSource.xyz);
				lightType = lights[3].direction.w;
				if (lightType == 0.0) {
					d = lights[3].direction.xyz;
					vAttenuation[3] = 1.0;
				} else if (lightType == 1.0) {
					d = normalize(lightSource.xyz);
					vAttenuation[3] = min(1.0, (1.0 * lights[3].range) / lightDistance);
				} else {
					d = normalize(lightSource.xyz);
					float clampedCosine = max(0.0, dot(d, lights[3].direction.xyz));
					if (clampedCosine < cos(lights[3].spotAngle)) {
						vAttenuation[3] = 0.0;
					} else {
						float spotExponent = 20.0;
						vAttenuation[3] = min(1.0, (1.0 * lights[3].range) / lightDistance);
						vAttenuation[3] = vAttenuation[3] * pow(clampedCosine, spotExponent);
					}
				}
				vLightDirection[3].x = dot(t, d);
				vLightDirection[3].y = dot(b, d);
				vLightDirection[3].z = dot(n, d);
				vLightDirection[3] = normalize(vLightDirection[3]);
				vLightColor[3] = lights[3].color;
			}

			if (receiveShadows) {
				const mat4 texUnitConverter = mat4(
					0.5, 0.0, 0.0, 0.0,
					0.0, 0.5, 0.0, 0.0,
					0.0, 0.0, 0.5, 0.0,
					0.5, 0.5, 0.5, 1.0);
				vDepth = texUnitConverter * _LightCamera * vert;
				//vShadowTexCoord = tMatrix * vertex;
				//vShadowTexCoord = tMatrix * vert;
			}
			gl_Position = TEA_MATRIX_MVP * vertex;
		}
	`;

	export const defaultFS = `
		precision mediump float;
		precision mediump int;

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
		uniform bool receiveShadows;
		uniform vec4 ambientColor;
		uniform int lightCount;

		varying vec3 vNormal;
		varying vec2 vTexCoord;
		varying vec4 vDepth;
		//varying vec4 vShadowTexCoord;
		varying vec4 vLightColor[4];
		varying vec3 vLightDirection[4];
		varying float vAttenuation[4];
		varying vec3 vViewDirection;

		float decodeFloat(vec4 color) {
			const vec4 bitShift = vec4(
				1.0 / (256.0 * 256.0 * 256.0),
				1.0 / (256.0 * 256.0),
				1.0 / 256.0,
				1.0
			);
			return dot(color, bitShift);
		}

		void checkStereoCamera() {
			if (TEA_CAMERA_STEREO == 0) {
				return;
			}
			float stereoMod = float(TEA_CAMERA_STEREO - 1);
			if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
				discard;
			}
		}

		void main() {
			checkStereoCamera();

			vec4 col;// = vec4(ambientColor, vColor.a);
			vec3 normal = (texture2D(_NormalTex, (uv_NormalTex + vTexCoord) / _NormalTex_ST)).rgb;
			//if (normal != vec3(1.0)) {
				normal = 2.0 * normal - 1.0;
				//normal.z *= 1.0 / 0.6;
				normal = normalize(normal);

				vec3 d = vLightDirection[0];
				float attenuation = vAttenuation[0];//1.0;
				float diffuse = attenuation * max(0.0, dot(normal, d));
				float shininess = 5.0;
				float specular = 0.0;
				if (diffuse > 0.0) {
					vec3 ref = reflect(-d, normal);
					specular = dot(ref, vViewDirection);
					specular = max(0.0, specular);
					specular = attenuation * pow(specular, shininess);
				}
				col = vec4(vLightColor[0].rgb * vec3(diffuse + specular), 0.0);

				if (lightCount >= 2) {
					d = vLightDirection[1];
					attenuation = vAttenuation[1];//1.0;
					diffuse = attenuation * max(0.0, dot(normal, d));
					shininess = 5.0;
					specular = 0.0;
					if (diffuse > 0.0) {
						vec3 ref = reflect(-d, normal);
						specular = dot(ref, vViewDirection);
						specular = max(0.0, specular);
						specular = attenuation * pow(specular, shininess);
					}
					col += vec4(vLightColor[1].rgb * vec3(diffuse + specular), 0.0);
				}

				if (lightCount >= 3) {
					d = vLightDirection[2];
					attenuation = vAttenuation[2];//1.0;
					diffuse = attenuation * max(0.0, dot(normal, d));
					shininess = 5.0;
					specular = 0.0;
					if (diffuse > 0.0) {
						vec3 ref = reflect(-d, normal);
						specular = dot(ref, vViewDirection);
						specular = max(0.0, specular);
						specular = attenuation * pow(specular, shininess);
					}
					col += vec4(vLightColor[2].rgb * vec3(diffuse + specular), 0.0);
				}

				if (lightCount >= 4) {
					d = vLightDirection[3];
					attenuation = vAttenuation[3];//1.0;
					diffuse = attenuation * max(0.0, dot(normal, d));
					shininess = 5.0;
					specular = 0.0;
					if (diffuse > 0.0) {
						vec3 ref = reflect(-d, normal);
						specular = dot(ref, vViewDirection);
						specular = max(0.0, specular);
						specular = attenuation * pow(specular, shininess);
					}
					col += vec4(vLightColor[3].rgb * vec3(diffuse + specular), 0.0);
				}

				col += vec4(ambientColor.rgb, 1.0);
			//}
			
			vec4 tex = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
			if (!receiveShadows) {
				gl_FragColor = tex * _Color * col;
				return;
			}

			/*
			vec3 fragmentDepth = vDepth.xyz;
			float shadowAcneRemover = 0.001;
			fragmentDepth.z -= shadowAcneRemover;
			float texelSize = 1.0;
			float amountInLight = 0.0;

			for (int x = -1; x <= 1; x++) {
				for (int y = -1; y <= 1; y++) {
					vec2 pos = fragmentDepth.xy + vec2(x, y) * texelSize;
					if (pos.x < 0.0 || pos.y < 0.0) {
						amountInLight += 1.0;
						continue;
					}
					float texelDepth = decodeFloat(texture2D(_ShadowTex, pos));
					//float texelDepth = decodeFloat(texture2DProj(_ShadowTex, vDepth));
					if (fragmentDepth.z < texelDepth) {
						amountInLight += 1.0;
					}
				}
			}
			amountInLight /= 9.0 * 2.0;
			amountInLight += 0.5;
			gl_FragColor = tex * _Color * col * amountInLight;
			*/

			//*
			float shadow = decodeFloat(texture2DProj(_ShadowTex, vDepth));
			vec4 depthColor = vec4(1.0);
			if (vDepth.z - 0.001 > shadow) {
				float color = 0.5;
				depthColor = vec4(color, color, color, 1.0);
			}
			gl_FragColor = tex * _Color * col * depthColor;
			//*/
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
		void main() {
			gl_Position = TEA_MATRIX_MVP * vertex;
		}
	`;

	export const depthFS = `
		precision mediump float;

		vec4 encodeFloat(float depth) {
			const vec4 bitShift = vec4(
				256 * 256 * 256,
				256 * 256,
				256,
				1.0
			);
			const vec4 bitMask = vec4(
				0,
				1.0 / 256.0,
				1.0 / 256.0,
				1.0 / 256.0
			);
			vec4 comp = fract(depth * bitShift);
			comp -= comp.xxyz * bitMask;
			return comp;
		}

		void main() {
			gl_FragColor = encodeFloat(gl_FragCoord.z);
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
		uniform vec4 _Color;
		uniform float _Cutoff;
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
			float a = color.a * _Color.a;
			if (a <= _Cutoff) {
				discard;
			}
			gl_FragColor = vec4(_Color.xyz, a);
		}
	`;

	export const statsVS = `
		attribute vec3 vertex;
		attribute vec2 texcoord;
		uniform mat4 TEA_MATRIX_MVP;
		varying vec2 vTexCoord;
		void main() {
			vTexCoord = texcoord;
			gl_Position = TEA_MATRIX_MVP * vec4(vertex, 1.0);
		}
	`;

	export const statsFS = `
		precision mediump float;
		uniform sampler2D _MainTex;
		uniform int TEA_CAMERA_STEREO;
		uniform float _Cutoff;
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
			if (color.a <= _Cutoff) {
				discard;
			}
			gl_FragColor = color;
		}
	`;

	export const sceneIconVS = `
		attribute vec3 vertex;
		attribute vec2 texcoord;
		//uniform mat4 TEA_MATRIX_MVP;
		uniform mat4 TEA_MATRIX_VP;
		uniform vec4 CameraRight;
		uniform vec4 CameraUp;
		uniform vec4 position;
		varying vec2 vTexCoord;
		void main() {
			vec3 v = vec3(CameraRight) * vertex.x + vec3(CameraUp) * vertex.y;
			gl_Position = TEA_MATRIX_VP * vec4(vec3(position) + v, 1.0);
			vTexCoord = texcoord;
		}
	`;

	export const sceneIconFS = `
		precision mediump float;
		uniform sampler2D _MainTex;
		uniform vec2 uv_MainTex;
		uniform vec2 _MainTex_ST;
		varying vec2 vTexCoord;
		void main() {
			vec4 color = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
			if (color.a <= 0.0) {
				discard;
			}
			gl_FragColor = color;
		}
	`;

	export const particleVS = `
		attribute vec3 vertex;
		attribute vec2 texcoord;
		uniform mat4 TEA_MATRIX_VP;
		uniform vec3 CameraRight;
		uniform vec3 CameraUp;
		uniform vec3 position;
		uniform float size;
		varying vec2 vTexCoord;
		void main() {
			vec3 v = CameraRight * vertex.x * size + CameraUp * vertex.y * size;
			gl_Position = TEA_MATRIX_VP * vec4(position + v, 1.0);
			vTexCoord = texcoord;
		}
	`;

	export const particleFS = `
		precision mediump float;
		uniform int TEA_CAMERA_STEREO;
		uniform sampler2D _MainTex;
		uniform vec2 uv_MainTex;
		uniform vec2 _MainTex_ST;
		uniform vec4 color;
		varying vec2 vTexCoord;
		void main() {
			if (TEA_CAMERA_STEREO != 0) {
				float stereoMod = float(TEA_CAMERA_STEREO - 1);
				if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
					discard;
				}
			}
			vec4 tex = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
			if (tex.a <= 0.0) {
				discard;
			}
			gl_FragColor = tex * color;
		}
	`;

	export const particleInstancingVS = `
		attribute vec3 vertex;
		attribute vec2 texcoord;
		attribute vec3 position;
		attribute vec4 color;
		attribute float size;
		uniform mat4 TEA_MATRIX_VP;
		uniform vec3 CameraRight;
		uniform vec3 CameraUp;
		varying vec2 vTexCoord;
		varying vec4 vColor;
		void main() {
			vec3 v = CameraRight * vertex.x * size + CameraUp * vertex.y * size;
			gl_Position = TEA_MATRIX_VP * vec4(position + v, 1.0);
			vTexCoord = texcoord;
			vColor = color;
		}
	`;

	export const particleInstancingFS = `
		precision mediump float;
		uniform int TEA_CAMERA_STEREO;
		uniform sampler2D _MainTex;
		uniform vec2 uv_MainTex;
		uniform vec2 _MainTex_ST;
		varying vec2 vTexCoord;
		varying vec4 vColor;
		void main() {
			if (TEA_CAMERA_STEREO != 0) {
				float stereoMod = float(TEA_CAMERA_STEREO - 1);
				if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
					discard;
				}
			}
			vec4 tex = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
			if (tex.a <= 0.0) {
				discard;
			}
			gl_FragColor = tex * vColor;
		}
	`;

	export const skyboxVS = `
		const float Front = 0.5;
		const float Back = 1.5;
		const float Left = 2.5;
		const float Right = 3.5;
		const float Up = 4.5;
		const float Down = 5.5;
		attribute vec4 vertex;
		attribute vec3 normal;
		attribute vec2 texcoord;
		attribute vec4 color;
		uniform mat4 TEA_MATRIX_MVP;
		varying vec2 vTexCoord;
		varying float direction;

		void main() {
			vec3 c = color.rgb;
			if (c == vec3(1.0, 0.0, 0.0)) {
				direction = Front;
			} else if (c == vec3(0.0, 1.0, 0.0)) {
				direction = Back;
			} else if (c == vec3(0.0, 0.0, 1.0)) {
				direction = Up;
			} else if (c == vec3(1.0, 1.0, 0.0)) {
				direction = Down;
			} else if (c == vec3(1.0, 0.0, 1.0)) {
				direction = Left;
			} else if (c == vec3(0.0, 1.0, 1.0)) {
				direction = Right;
			}
			vTexCoord = texcoord;
			gl_Position = TEA_MATRIX_MVP * vertex;
		}
	`;

	export const skyboxFS = `
		precision mediump float;

		const float Front = 0.0;
		const float Back = 1.0;
		const float Left = 2.0;
		const float Right = 3.0;
		const float Up = 4.0;
		const float Down = 5.0;
		uniform int TEA_CAMERA_STEREO;
		uniform sampler2D _Front;
		uniform sampler2D _Back;
		uniform sampler2D _Left;
		uniform sampler2D _Right;
		uniform sampler2D _Up;
		uniform sampler2D _Down;
		uniform vec4 ambientColor;
		varying vec2 vTexCoord;
		varying float direction;

		void checkStereoCamera() {
			if (TEA_CAMERA_STEREO == 0) {
				return;
			}
			float stereoMod = float(TEA_CAMERA_STEREO - 1);
			if (mod(floor(gl_FragCoord.y), 2.0) == stereoMod) {
				discard;
			}
		}

		void main() {
			checkStereoCamera();

			float d = floor(direction);
			vec4 tex = vec4(0.0);
			if (d == Front) {
				tex = texture2D(_Front, vTexCoord);
			} else if (d == Back) {
				tex = texture2D(_Back, vTexCoord);
			} else if (d == Up) {
				tex = texture2D(_Up, vTexCoord);
			} else if (d == Down) {
				tex = texture2D(_Down, vTexCoord);
			} else if (d == Left) {
				tex = texture2D(_Left, vTexCoord);
			} else if (d == Right) {
				tex = texture2D(_Right, vTexCoord);
			}
			//vec4 tex = texture2D(_SkyboxUp, vTexCoord);
			gl_FragColor = ambientColor + tex;
		}
	`;

	export const simplePostProcessingVS = `
		attribute vec4 vertex;
		attribute vec2 texcoord;
		varying vec2 vTexCoord;
		void main() {
			gl_Position = vertex;
			vTexCoord = texcoord;
		}
	`;

	export const simplePostProcessingFS = `
		precision mediump float;
		uniform sampler2D _MainTex;
		uniform vec2 uv_MainTex;
		uniform vec2 _MainTex_ST;
		varying vec2 vTexCoord;
		void main() {
			vec4 tex = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
			gl_FragColor = tex;
		}
	`;

	export const grayScalePostProcessingVS = `
		attribute vec4 vertex;
		attribute vec2 texcoord;
		varying vec2 vTexCoord;
		void main() {
			gl_Position = vertex;
			vTexCoord = texcoord;
		}
	`;

	export const grayScalePostProcessingFS = `
		precision mediump float;
		uniform sampler2D _MainTex;
		uniform vec2 uv_MainTex;
		uniform vec2 _MainTex_ST;
		varying vec2 vTexCoord;
		const vec3 grayScale = vec3(0.298912, 0.586611, 0.114478);
		void main() {
			vec4 tex = texture2D(_MainTex, (uv_MainTex + vTexCoord) / _MainTex_ST);
			float color = dot(tex.rgb, grayScale);
			gl_FragColor = vec4(color);
		}
	`;

	export const antialiasPostProcessingVS = `
		attribute vec4 vertex;
		attribute vec2 texcoord;
		varying vec2 vTexCoord;
		void main() {
			gl_Position = vertex;
			vTexCoord = texcoord;
		}
	`;

	export const antialiasPostProcessingFS = `
		precision highp float;
		uniform sampler2D _MainTex;
		uniform vec2 uv_MainTex;
		uniform vec2 _MainTex_ST;
		uniform float ScreenWidth;
		uniform float ScreenHeight;
		varying vec2 vTexCoord;
		const vec2 p0 = vec2(1.0 / 4.0, 3.0 / 4.0);
		const vec2 p1 = vec2(-3.0 / 4.0, 1.0 / 4.0);
		const vec2 p2 = vec2(3.0 / 4.0, 1.0 / 4.0);
		const vec2 p3 = vec2(-1.0 / 4.0, -3.0 / 4.0);
		vec2 pos(vec2 p1, vec2 p2, float x, float y) {
			return vec2(p1.x + p2.x * x, p1.y + p2.y * y);
		}
		void main() {
			float x = 1.0 / ScreenWidth;
			float y = 1.0 / ScreenHeight;
			vec2 p = (uv_MainTex + vTexCoord) / _MainTex_ST;
			vec4 t0 = texture2D(_MainTex, pos(p, p0, x, y));
			vec4 t1 = texture2D(_MainTex, pos(p, p1, x, y));
			vec4 t2 = texture2D(_MainTex, pos(p, p2, x, y));
			vec4 t3 = texture2D(_MainTex, pos(p, p3, x, y));
			vec4 color = (t0 + t1 + t2 + t3) / 4.0;
			gl_FragColor = color;
		}
	`;
}
