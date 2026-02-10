import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';

export default function example() {
  const canvas = document.querySelector('#three-canvas');
  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene and Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 5;
  scene.add(camera);

  //Light
  const ambientLight = new THREE.AmbientLight('#fff', 1); // 은은하게 전체적으로 조명을 비춰주는 메서드
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('#fff', 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // ------------------------------------------------------------------------------------------- 학습 내용
  // pointer lock api 참조

  // Controls
  const controls = new PointerLockControls(camera, renderer.domElement);

  // PointerLockControls은 동작하려면 이벤트리스터 안에서 lock메서드를 호출해야 함.
  controls.domElement.addEventListener('click', () => {
    controls.lock();
  });

  // controls 자체에 lock, unlock 이벤트가 내장되어 있음
  controls.addEventListener('lock', () => {
    console.log('lock!');
  });

  controls.addEventListener('unlock', () => {
    console.log('unlock!');
  });

  // -------------------------------------------------------------------------------------------

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh;
  let material;

  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      // 배경이 검은색이므로 최소 50부터 시작
      color: `rgb(
        ${50 + Math.floor(Math.random() * 205)}, 
        ${50 + Math.floor(Math.random() * 205)}, 
        ${50 + Math.floor(Math.random() * 205)}
      )`,
      side: THREE.DoubleSide,
    });

    mesh = new THREE.Mesh(geometry, material);
    // -0.5 ~ 0.5 범위가 됨
    // -2.5 ~ 2.5 범위로 설정 할 것이므로 * 5를 해주면 됨
    mesh.position.x = `${(Math.random() - 0.5) * 5}`;
    mesh.position.y = `${(Math.random() - 0.5) * 5}`;
    mesh.position.z = `${(Math.random() - 0.5) * 5}`;
    scene.add(mesh);
  }

  // Ani
  function draw() {
    renderer.render(scene, camera);
    requestAnimationFrame(draw); // 카메라 컨트롤 작동 하려면 requestAnimationFrame 해줘야 함.
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
