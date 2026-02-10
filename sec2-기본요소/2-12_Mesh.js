import * as THREE from '../threeJs/three.module.min.js';

export default function example() {
  const canvas = document.querySelector('#three-canvas');

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, // Mesh의 계단현상을 개선해 줌(Mesh를 확대 했을때 선들의 픽셀이 어긋나 일직선으로 보이지 않고 계단식으로 보이는 현상)
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 5;

  scene.add(camera);

  // Mesh 만들기 --------------------------------------

  // Geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1); // 직육면체 Geometry (너비, 높이, 깊이)
  // Material
  const material = new THREE.MeshBasicMaterial({
    color: '#049ef4',
    wireframe: true,
  });
  // Geometry + Material = Mesh
  const mesh = new THREE.Mesh(geometry, material);

  // Scene에 생성한 Mesh 넣기
  scene.add(mesh);

  // 그리기 (renderer가 최종적으로 render를 해줘야 그려짐)
  renderer.render(scene, camera);
}