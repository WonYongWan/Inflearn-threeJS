import * as THREE from '../threeJs/three.module.min.js';

// 주제. 배경의 색, 투명도 설정하기 ----------------------------------
export default function example() {
  const canvas = document.querySelector('#three-canvas');
  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    // alpha: true // canvas 배경을 투명하게 설정. 투명도 0으로 설정됨.
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1)
  // renderer.setClearColor('red'); // canvas 배경의 색을 설정해 줌.
  // renderer.setClearAlpha(0.5); // canvas 배경의 불투명도를 설정해 줌. 0 ~ 1까지 설정 가능 **배경색을 먼저 설정해야 됨.

  // Scene and Camera
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('red'); // scene에도 배경색을 지정할 수 있음. renderer보다 scene가 우선순위에 있기 때문에 scene에 배경색을 설정하면 renderer에 설정한 배경색은 묻힘. 다만 투명도는 renderer에서만 설정 가능.
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  scene.add(camera);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: '#049ef4',
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  renderer.render(scene, camera);

  // Resize
  function setSize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', setSize);
}