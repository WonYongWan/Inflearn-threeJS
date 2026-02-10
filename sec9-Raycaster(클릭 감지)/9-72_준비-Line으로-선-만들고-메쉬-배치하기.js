import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default function example() {
  const canvas = document.querySelector('#three-canvas');
  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 5;
  camera.position.y = 1.5; // OrbitControls 때문에 카메라 y포지션이 정중앙에 위치한 것처럼 보임
  camera.position.z = 4;
  scene.add(camera);

  //Light
  const ambientLight = new THREE.AmbientLight('#fff', 1); // 은은하게 전체적으로 조명을 비춰주는 메서드
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('#fff', 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement); // OrbitControls은 기본적으로 lookAt이 적용되어 있음.

  // ------------------------------------------------------------------------------------------- 학습 내용
  // Geometry
  const points = [];
  points.push(new THREE.Vector3(0, 0, 100)); // x, y, z -> z가 100이므로 카메라 방향으로 옴
  points.push(new THREE.Vector3(0, 0, -100)); // z가 -100이므로 카메라 반대 방향으로 감
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points); // BufferGeometry는 임의로 포인트를 설정하고 그 포인트들을 이어가면서 Geometry를 만들어가는 Geometry
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100); // 반지름, 두깨, 세그먼트

  // Material
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 'yellow',
  });
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: 'plum',
  });
  const torusMaterial = new THREE.MeshStandardMaterial({
    color: 'lime',
  });

  // Mesh
  const guide = new THREE.Line(lineGeometry, lineMaterial);
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  scene.add(guide, boxMesh, torusMesh);

  const meshes = [boxMesh, torusMesh];

  // -------------------------------------------------------------------------------------------

  // Ani
  function draw() {
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
  }
  draw();

  // Resize
  function setSize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', setSize);
}
