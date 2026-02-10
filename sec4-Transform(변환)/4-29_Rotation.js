// 아래 경로로 사용하려면 vite 설치해야 됨. readme.md 5번 참조
import * as THREE from 'three';
import dat from 'dat.gui';

// 회전 ------------------------------------------------
// 어떤 캐릭터의 목의 돌릴때 주의사항이 있으므로 영상 다시 볼 것. 3분55초 부터 -> 회전축을 독립 시키면 됨.
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

  // ------------------------------------------------------------------------------------------- 학습 내용
  mesh.rotation.reorder('YXZ'); // 회전축 독립 시키기 메서드
  mesh.rotation.y = THREE.MathUtils.degToRad(45);
  mesh.rotation.x = THREE.MathUtils.degToRad(20);
  // -------------------------------------------------------------------------------------------

  let oldTime = Date.now();
  // Ani
  function draw() {
    const nowTime = Date.now();
    const time = (nowTime - oldTime) * 0.001;
    oldTime = nowTime;

    // ------------------------------------------------------------------------------------------- 학습 내용
    // x, y, z 순으로 적용
    // 만약 45라는 값을 넣으면 이것은 45deg가 아니다. 라디안 단위라서 3.14 즉 파이가 180deg다 즉 45는 2,579.6deg가 나온다.
    // mesh.rotation.set(1, 2, 3);
    // mesh.rotation.x = 1;
    // mesh.rotation.y = 2;
    // mesh.rotation.z = 3;

    // 그러므로 단순한 값이 아닌 THREE.js에 내장된 MathUtils 객체 안에 degToRad 메서드를 사용해야 한다.
    // mesh.rotation.set(THREE.MathUtils.degToRad(45), THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(90));
    // mesh.rotation.x = THREE.MathUtils.degToRad(45);
    // mesh.rotation.y = THREE.MathUtils.degToRad(45);
    // mesh.rotation.z = THREE.MathUtils.degToRad(45);

    // 또는 JS 내장 객체인 Math.PI를 사용하는 방법이 있다. PI가 3.14 = 180deg이므로 PI / 2는 90deg, PI / 4는 45deg가 나온다.
    // mesh.rotation.x = Math.PI / 4;
    // mesh.rotation.y = Math.PI / 4;
    // mesh.rotation.z = Math.PI / 4;

    // mesh.rotation.x += time;
    // -------------------------------------------------------------------------------------------

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
