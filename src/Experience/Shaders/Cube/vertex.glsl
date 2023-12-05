precision highp float;
precision highp int;
precision highp sampler2D;

uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uTorTexture;
attribute float aScale;
attribute float aIndex;

varying vec3 vPosData;
varying float vIndex;

void main()
{
    float idx = float(aIndex);
    vIndex = idx;
    ivec2 texSize = textureSize(uTexture, 0);
    float texWidth = float(texSize.x);
    float texHeight = float(texSize.y);
    highp int colIdx = int(floor(idx / texWidth));
    highp int rowIdx = int(mod(idx, texHeight));
    vec3 posData = texelFetch(uTexture, ivec2(colIdx, rowIdx), 0).rgb;
    vPosData = posData.xyz;

    ivec2 texSize2 = textureSize(uTorTexture, 0);
    float texWidth2 = float(texSize2.x);
    float texHeight2 = float(texSize2.y);
    highp int colIdx2 = int(floor(idx / texWidth2));
    highp int rowIdx2 = int(mod(idx, texHeight2));
    vec3 posData2 = texelFetch(uTorTexture, ivec2(colIdx2, rowIdx2), 0).rgb;


    //vec3 texture = texture2D(uTexture, uv).rgb;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float time = uTime * 0.9;

    float m = min(smoothstep(0.1, 3.3, time), 1.0);
    float m2 = min(smoothstep(0.1, 3.3, time - 5.), 1.0);


    //if( posData2 != vec3(0.0)) {
        if ( m < 1.0 ) {
            modelPosition.xyz = mix(modelPosition.xyz, posData, m);
        }else{
            modelPosition.xyz = mix(posData, posData2, m2);
        }
    //}

    // modelPosition.xyz = posData;
    // modelPosition.yz = vec2(0.0);
    // modelPosition.x = idx / 20.;




//    modelPosition.y += sin(uTime + modelPosition.x * 100.0) * 1.0 * 0.07;
//    modelPosition.x += sin(uTime + modelPosition.y * 100.0) * 1.0 * 0.001;
//    modelPosition.z += sin(uTime + modelPosition.x * 100.0) * 1.0 * 0.03;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uSize * uPixelRatio;
    //gl_PointSize = 200.;
    gl_PointSize *= (1.0 / - viewPosition.z);
}
