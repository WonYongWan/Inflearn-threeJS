import * as THREE from '/node_modules/three/src/Three.js';
import Stats from '/node_modules/stats.js/src/Stats.js';

// 초당 프레임 수 보기(Stats) ------------------------------------------------
// 패키지 설치 readme.md 3번 참조
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

  // Stats -> 초당 프레임 수 보기(Stats)
  const stats = new Stats();
  document.body.append(stats.domElement);

  let oldTime = Date.now();
  // Ani
  function draw() {
    const nowTime = Date.now();
    const time = (nowTime - oldTime) * 0.001;

    stats.update(); // stats.domElement가 작동하려면 애니메이션이 진행될때 실시간으로 업데이트 해줘야 함. -> 초당 프레임 수 보기(Stats)
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
