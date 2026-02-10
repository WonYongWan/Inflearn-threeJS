// 아래 경로로 사용하려면 vite 설치해야 됨. readme.md 5번 참조
import * as THREE from 'three';
import dat from 'dat.gui';

// 그룹 만들기(Scene Graph) ------------------------------------------------
// mesh를 그룹으로 묶으면 위치 변경할때 같이 이동함.
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
  camera.position.y = 1;
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
    color: 'hotpink',
  });
  // ------------------------------------------------------------------------------------------- 학습 내용
  // 태양
  const group1 = new THREE.Group();
  const box1 = new THREE.Mesh(geometry, material); // geometry, material는 재사용 가능

  // 지구
  const group2 = new THREE.Group();
  const box2 = box1.clone(); // clone 메서드를 사용 할 수도 있음.
  box2.scale.set(0.3, 0.3, 0.3);
  group2.position.x = 2;

  // 달
  const group3 = new THREE.Object3D(); // Group() == Object3D()
  const box3 = box2.clone();
  box3.scale.set(0.15, 0.15, 0.15);
  group3.position.x = 0.5;

  group3.add(box3);
  group2.add(box2, group3);
  group1.add(box1, group2);
  scene.add(group1);
  // -------------------------------------------------------------------------------------------

  // Dat GUI -> GUI 컨트롤
  const gui = new dat.GUI(); // three.js 뿐만 아니라 js도 적용 됨
  // 오브젝트, 속성(문자열), 범위 최소값, 범위 최대값, 단계 + .name(레이블 네임)
  gui.add(group1.position, 'x', -5, 5, 0.01).name('메쉬 포지션 x');
  gui.add(group1.position, 'y', -5, 5, 0.01).name('메쉬 포지션 y');
  gui.add(group1.position, 'z', -5, 5, 0.01).name('메쉬 포지션 z');
  gui.add(camera.position, 'x', -5, 5, 0.01).name('카메라 포지션 x');
  gui.add(camera.position, 'y', -5, 5, 0.01).name('카메라 포지션 y');
  gui.add(camera.position, 'z', -5, 5, 0.01).name('카메라 포지션 z');
  // 옵셔널 체이닝도 가능
  gui.add(directionalLight.position, 'y').min(0).max(10).step(0.01).name('라이트 포지션 y');

  // camera lookAt
  camera.lookAt(group1.position);

  let oldTime = Date.now();
  // Ani
  function draw() {
    const nowTime = Date.now();
    const time = (nowTime - oldTime) * 0.001;
    oldTime = nowTime;

    // ------------------------------------------------------------------------------------------- 학습 내용
    group1.rotation.y += time;
    group2.rotation.y += time;
    group3.rotation.y += time;
    // -------------------------------------------------------------------------------------------

    camera.lookAt(group1.position); // lookAt도 계속 업데이트 해줘야 함.
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
