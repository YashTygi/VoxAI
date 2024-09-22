"use client"
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { vertex, fragment } from './shaders/shaders';
import { useAmplitudeStore } from '@/store/store';
import styles from './model.module.css';

/**
 * Renders a 3D scene using Three.js library. The scene consists of a sphere with
 * points that expand and contract based on the amplitude value from the amplitude
 * store. The sphere is rendered within a container div.
 *
 * @return {ThreeScene} The rendered 3D scene.
 */

const ThreeScene: React.FC = () => {

  const { tenthAmplitudeValue } = useAmplitudeStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const ampRef = useRef<number>(0);

  useEffect(() => {
    ampRef.current = tenthAmplitudeValue/10;
  }, [tenthAmplitudeValue]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(0x000000, 0);
      const controls = new OrbitControls(camera, renderer.domElement);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.dispose();

      containerRef.current?.appendChild(renderer.domElement);
      camera.position.y = 5;
      camera.position.z = 5;
      controls.update();

      const geometry = new THREE.SphereGeometry(2, 30, 20, 3, Math.PI / 0.5);
      const pointsMaterial = new THREE.ShaderMaterial({
        uniforms: {
          pointSize: { value: 3 },
          color1: { value: new THREE.Color("#4158D0") },
          color2: { value: new THREE.Color("#C850C0") },
          color3: { value: new THREE.Color("#FFCC70") },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
      });

      const points = new THREE.Points(geometry, pointsMaterial);
      scene.add(points);
      const count: number = geometry.attributes.position.count;
      const position_clone = JSON.parse(
        JSON.stringify(geometry.attributes.position.array)
      ) as Float32Array;

      const renderScene = () => {
        let now: number = Date.now() / 1000;
        const maxExpansion  = 0.05;
        const minExpansion = 0;
        for (let i = 0; i < count; i++) {

          const ix = i * 3;
          const iy = i * 3 + 1;
          const iz = i * 3 + 2;

          const originalX = position_clone[ix];
          const originalY = position_clone[iy];
          const originalZ = position_clone[iz];

          const distance = Math.sqrt(originalX ** 2 + originalY ** 2 + originalZ ** 2);

          const angle = now + distance * 2;

          const expansionFactor = ((Math.sin(angle) + 1) / 2) * maxExpansion + minExpansion;

          const scaleFactor = 1 + (expansionFactor * ampRef.current);

          const newX = originalX * scaleFactor;
          const newY = originalY * scaleFactor;
          const newZ = originalZ * scaleFactor;

          geometry.attributes.position.setXYZ(i, newX, newY, newZ);
        }

        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;

        points.rotation.x += 0.001;
        points.rotation.y += 0.001;
        renderer.render(scene, camera);
        controls.update();
        animationFrameRef.current = requestAnimationFrame(renderScene) ?? 0;
      };

      renderScene();
      
    }
  }, []);

  return <div className={styles.container} ref={containerRef} />;
};

export default ThreeScene;
