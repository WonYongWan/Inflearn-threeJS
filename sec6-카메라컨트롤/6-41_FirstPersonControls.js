import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/Addons.js';

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
  // FirstPersonControls는 FlyControls의 대체 구현이다.

  // Controls
  const controls = new FirstPersonControls(camera, renderer.domElement);

  // FirstPersonControls 옵션들
  controls.movementSpeed = 10; // 움직이는 속도 조절(앞, 뒤, 좌, 우). 기본값은 1
  // controls.activeLook = false; // 주위를 둘러 볼 수 없게 함.
  controls.lookSpeed = 0.1; // 회전 속도 조절.
  // controls.autoForward = true; // 자동으로 앞으로 나아감.

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
  let oldTime = Date.now(); // javascript 내장 객체를 사용하기 -> 본인은 이게 더 편함
  function draw() {
    const nowTime = Date.now();
    const time = (nowTime - oldTime) * 0.001;
    oldTime = nowTime;

    controls.update(time); // FirstPersonControls는 기본적으로 update에 time값을 전달해줘야 함.

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
