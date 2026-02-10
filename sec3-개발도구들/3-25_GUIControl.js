import * as THREE from '/node_modules/three/build/three.module.js';
import dat from '/node_modules/dat.gui/build/dat.gui.module.js';

// GUI 컨트롤 ------------------------------------------------
// 패키지 설치 readme.md 4번 참조
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
  scene.fog = new THREE.Fog('#000', 3, 7);

  // Camera
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.x = 0;
  camera.position.y = 0.7;
  camera.position.z = 3;
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

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 'red',
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 0;
  mesh.position.z = 0;
  scene.add(mesh);

  // Dat GUI -> GUI 컨트롤
  const gui = new dat.GUI(); // three.js 뿐만 아니라 js도 적용 됨
  // 오브젝트, 속성(문자열), 범위 최소값, 범위 최대값, 단계 + .name(레이블 네임)
  gui.add(mesh.position, 'x', -5, 5, 0.01).name('메쉬 포지션 x');
  gui.add(mesh.position, 'y', -5, 5, 0.01).name('메쉬 포지션 y');
  gui.add(mesh.position, 'z', -5, 5, 0.01).name('메쉬 포지션 z');
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

    mesh.rotation.y += time;

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
