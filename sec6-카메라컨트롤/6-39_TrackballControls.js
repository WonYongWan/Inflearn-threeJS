import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/Addons.js';

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
  // TrackballControls는 OrbitControls와 비슷하지만 상하 회전 범위가 무제한임. 또한 기본적으로 enableDamping이 적용되어 있음.

  // Controls
  const controls = new TrackballControls(camera, renderer.domElement);

  // TrackballControls 옵션들
  controls.maxDistance = 20;
  controls.minDistance = 5;
  // controls.target.set(3, 3, 3);

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
    controls.update(); // OrbitControls와 다르게 update안 해주면 작동 안함.

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
