// 모듈 해결 안됨. 찾아볼 것
import * as THREE from '../node_modules/three/build/three.module.js';
import { gsap } from '../node_modules/gsap/gsap-core.js';

// GSAP 사용하기 ------------------------------------------------
export default function example() {
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Fog
  scene.fog = new THREE.Fog('#000', 3, 7);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000,
  );
  camera.position.y = 0;
  camera.position.z = 5;

  scene.add(camera);

  // Light
  const light = new THREE.DirectionalLight('#fff', 1);
  light.position.x = 1;
  light.position.y = 3;
  light.position.z = 10;

  scene.add(light);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 'red',
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Ani
  function draw() {
    // gsap
    gsap.to(
      mesh.rotation,
      {
        duration: 1,
        y: 2,
        x: 3,
      }
    );

    renderer.render(scene, camera);
    requestAnimationFrame(draw);
  }

  draw();

  // ReSize
  function setSize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', setSize);
}