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
  // OrbitControls의 상하 회전 범위는 최대 180deg, 좌우는 무제한

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // OrbitControls 옵션들
  controls.enableDamping = true; // 컨트롤 느낌을 더 부드럽게 해줌. 추가로 draw함수에서 controls.update()를 해줘야 됨,
  // controls.enableZoom = false; // zoom in/out 잠금
  controls.maxDistance = 10; // zoom in/out 최대 거리 제한
  controls.minDistance = 2; // zoom in/out 최소 거리 설정
  // controls.minPolarAngle = Math.PI / 4; // Math.PI === 3.14.. === 180deg / 4 = 45deg => 수직 각도 제한(상 -> 하)
  controls.minPolarAngle = THREE.MathUtils.degToRad(45); // Math.PI / 4와 동일
  controls.maxPolarAngle = THREE.MathUtils.degToRad(135); // Math.PI / 4와 동일 => 수직 각도 설정(상 -> 하)
  // controls.target.set(2, 2, 2); // 회전의 중심축 설정 -> x, y, z
  controls.autoRotate = true; // 카메라 자동 회전
  controls.autoRotateSpeed = 50; // 카메라 자동 회전 속도 조절

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
  // -------------------------------------------------------------------------------------------

  // Ani
  function draw() {
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(draw); // OrbitControls 작동 하려면 requestAnimationFrame 해줘야 함.
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
