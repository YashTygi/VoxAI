"use client"

export const vertex = `
uniform float pointSize;
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_PointSize = pointSize;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragment = `
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec2 vUv;

void main() {
    float mixValue = mod((vUv.x * 95.0), 1.0);
    vec3 gradientColor = mix(color1, color2, mixValue);
    gradientColor = mix(gradientColor, color3, vUv.y);
    gl_FragColor = vec4(gradientColor, 1.0);
}
`;