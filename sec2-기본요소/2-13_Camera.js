import * as THREE from '../threeJs/three.module.min.js';

export default function example() {
  const canvas = document.querySelector('#three-canvas');

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  // Camera(카메라) 생성 ->  OrthographicCamera(올쏘그래픽 카메라 === 직교 카메라)
  const camera = new THREE.OrthographicCamera(
    -(window.innerWidth / window.innerHeight), // left
    window.innerWidth / window.innerHeight, // right
    1, // top
    -1 // bottom
  );

  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;
  camera.lookAt(0, 0, 0); // 카메라가 Mesh를 바라보게 하는 메서드 (x, y, z)
  camera.zoom = 0.5; // 카메라 zoom 설정. 기본값 1
  camera.updateProjectionMatrix(); // 카메라 render 속성을 변경하면 업데이트 해줘야 함

  scene.add(camera);

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.MeshBasicMaterial({
    color: '#049ef4',
    wireframe: true,
  });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  renderer.render(scene, camera);
}