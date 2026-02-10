import * as THREE from '../threeJs/three.module.min.js';

export default function example() {
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000,
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 4;

  scene.add(camera);

  const light = new THREE.DirectionalLight('#fff', 1);
  light.position.x = 1.5;
  light.position.z = 5;

  scene.add(light);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: '#049ef4',
  });
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // 그리기
  function draw() {
    // 각도는 Radian을 사용
    // 360도는 2파이
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.05;
    mesh.rotation.x += THREE.MathUtils.degToRad(1); // 일반적으로 알고 있는 360도 각도로 적용됨
    mesh.rotation.y += THREE.MathUtils.degToRad(1); // 일반적으로 알고 있는 360도 각도로 적용됨
    renderer.render(scene, camera);

    requestAnimationFrame(draw);
  }

  draw();
  
  function setSize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', setSize);
}