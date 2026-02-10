import * as THREE from '../threeJs/three.module.min.js';

// 축, 그리드 헬퍼(AxesHelper, GridHelper) ------------------------------------------------
// 패키지 설치 readme.md 2번 참조
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
  camera.position.x = 1;
  camera.position.y = 3;
  camera.position.z = 0;
  scene.add(camera);

  // Light
  // Light 한 개 추가
  const ambientLight = new THREE.AmbientLight('#fff', 0.5); // 은은하게 전체적으로 조명을 비춰주는 메서드
  const directionalLight = new THREE.DirectionalLight('#fff', 1);
  directionalLight.position.x = 1;
  directionalLight.position.y = 3;
  directionalLight.position.z = 10;
  scene.add(ambientLight);
  scene.add(directionalLight);

  // AxesHelper
  // 0, 0, 0 원점을 기준으로 물체가 어디에 위치해 있는지 확인 할 수 있음
  const axesHelper = new THREE.AxesHelper(3); // 3은 축, 헬퍼 사이즈
  scene.add(axesHelper);

  // GridHelper
  const gridHelper = new THREE.GridHelper(5); // 5은  사이즈
  scene.add(gridHelper);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 'red',
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 2;
  mesh.position.z = 2;
  scene.add(mesh);

  // camera position setting
  camera.lookAt(mesh.position); // 인수로 어떤 물체의 포지션 값을 넣어주면 그 포지션을 바라본다.

  let oldTime = Date.now();
  // Ani
  function draw() {
    const nowTime = Date.now();
    const time = (nowTime - oldTime) * 0.001;
    oldTime = nowTime;

    mesh.rotation.y += time;

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
