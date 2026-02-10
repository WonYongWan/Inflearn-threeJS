// 아래 경로로 사용하려면 vite 설치해야 됨. readme.md 5번 참조
import * as THREE from 'three';
import dat from 'dat.gui';
// 여러 엘리먼트를 확인하기 위해 카메라 셋팅해야 됨
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// 여러가지 Geometry 살펴보기 ------------------------------------------------
// 카메라 컨트롤 추가 말고 딱히 내용 없음. three.js 공식 docs에서 여러가지 geometry 확인 할 것
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

  // Camera
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.x = 0;
  camera.position.y = 1.5;
  camera.position.z = 5;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight('#fff', 0.5); // 은은하게 전체적으로 조명을 비춰주는 메서드
  const directionalLight = new THREE.DirectionalLight('#fff', 1);
  directionalLight.position.x = 1;
  directionalLight.position.y = 3;
  directionalLight.position.z = 10;
  scene.add(ambientLight);
  scene.add(directionalLight);

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3); // 3은 축, 헬퍼 사이즈
  scene.add(axesHelper);

  // GridHelper
  const gridHelper = new THREE.GridHelper(5); // 5는 사이즈
  scene.add(gridHelper);

  // ------------------------------------------------------------------------------------------- 학습 내용
  // 카메라 컨트롤 추가 - 카메라 회전 가능
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 'hotpink',
    side: THREE.DoubleSide, // OrbitControls로 줌 인/아웃을 할때 물체의 내부도 확인 가능
  });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
  // -------------------------------------------------------------------------------------------

  // Dat GUI -> GUI 컨트롤
  const gui = new dat.GUI(); // three.js 뿐만 아니라 js도 적용 됨
  // 오브젝트, 속성(문자열), 범위 최소값, 범위 최대값, 단계 + .name(레이블 네임)
  gui.add(camera.position, 'x', -5, 5, 0.01).name('카메라 포지션 x');
  gui.add(camera.position, 'y', -5, 5, 0.01).name('카메라 포지션 y');
  gui.add(camera.position, 'z', -5, 5, 0.01).name('카메라 포지션 z');
  // 옵셔널 체이닝도 가능
  gui.add(directionalLight.position, 'y').min(0).max(10).step(0.01).name('라이트 포지션 y');

  // camera lookAt
  camera.lookAt(mesh.position);

  let oldTime = Date.now();
  // Ani
  function draw() {
    const nowTime = Date.now();
    const time = (nowTime - oldTime) * 0.001;
    oldTime = nowTime;

    camera.lookAt(mesh.position); // lookAt도 계속 업데이트 해줘야 함.
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
