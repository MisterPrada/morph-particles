varying float vIndex;
varying vec3 vPosData;
void main()
{
//    if( vPosData == vec3(0.0)) {
//        discard;
//    }
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;

    //gl_FragColor = vec4(1.0, 1.0, 1.0, strength);

    // set FireFilies orange Color
    gl_FragColor = vec4(1.0, 0.5, 0.0, strength);
}
