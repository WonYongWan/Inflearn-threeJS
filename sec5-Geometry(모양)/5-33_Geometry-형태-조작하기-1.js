// 아래 경로로 사용하려면 vite 설치해야 됨. readme.md 5번 참조
import * as THREE from 'three';
import dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// Geometry 형태 조작하기 1 - 정점(Vertex) position 이용하기 ------------------------------------------------
// Geometry 형태 조작하기 2에 이어서 진행됨.
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
  camera.position.y = 6;
  camera.position.z = 10;
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

  const controls = new OrbitControls(camera, renderer.domElement); // 카메라 컨트롤 추가 - 카메라 회전 가능

  // ------------------------------------------------------------------------------------------- 학습 내용
  // Mesh
  const geometry = new THREE.SphereGeometry(4, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: 'orangered',
    // wireframe: true,
    side: THREE.DoubleSide,
    flatShading: true, // 표면이 부드럽지 않고 각지게 해 줌.
  });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // attributes 속성의 position값을 이용함. (정점(Vertex)의 위치를 담고 있는 배열) Float32Array(12675)은 특정한 타입의 값만 넣을 수 있는 배열이고 성능이 빠름
  // [-0, 4, 0, ...]의 형태로 되어 있는데 3개씩 끊고 각 x, y, z값이다.
  console.log(geometry.attributes.position.array);
  // -------------------------------------------------------------------------------------------

  // Dat GUI -> GUI 컨트롤
  const gui = new dat.GUI(); // three.js 뿐만 아니라 js도 적용 됨
  // 오브젝트, 속성(문자열), 범위 최소값, 범위 최대값, 단계 + .name(레이블 네임)
  gui.add(camera.position, 'x', -5, 10, 0.01).name('카메라 포지션 x');
  gui.add(camera.position, 'y', -5, 10, 0.01).name('카메라 포지션 y');
  gui.add(camera.position, 'z', -5, 10, 0.01).name('카메라 포지션 z');
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
