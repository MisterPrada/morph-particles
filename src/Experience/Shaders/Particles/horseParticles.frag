varying vec3 vPos;
uniform float uTime;
uniform float uScroll;
void main()
{
//  if ( vPos == vec3(0.0) )
//  {
//    discard;
//  }

  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / distanceToCenter - 0.1;
  float opacity = 0.0;

  if (uScroll < uRange) {
    opacity = 0.0;
  } else if (uScroll < uRange * 2.0) {
    opacity = 0.0;
  } else if (uScroll < uRange * 3.0) {
    opacity = mix(0.0, 1.0, (uScroll - uRange * 2.0) * uTotalModels );
  } else {
    opacity = mix(1.0, 0.0, (uScroll - uRange * 3.0) * uTotalModels );
  }

  // set FireFilies orange Color
  gl_FragColor = vec4(1.0, 0.5, 0.0, strength * length(vPos) * opacity);
}
