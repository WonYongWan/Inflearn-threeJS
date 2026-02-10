import * as THREE from '../threeJs/three.module.min.js';

export default function example() {
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000,
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 4;

  scene.add(camera);

  const light = new THREE.DirectionalLight('#fff', 1);
  light.position.x = 1.5;
  light.position.z = 5;

  scene.add(light);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: '#049ef4',
  });
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // 사용자마다 사용하는 기기의 성능에 차이가 있음
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime(); // 타임스탬프를 밀리초 단위로 반환하는 메서드 - 실행시점으로부터 총 경과 시간
    mesh.rotation.x += THREE.MathUtils.degToRad(1);
    mesh.rotation.y = time; // 시간은 절대값이므로 어떤 기기에서도 동일한 속도의 결과를 도출 할 수 있음
    renderer.render(scene, camera);

    requestAnimationFrame(draw);
  }

  draw();
  
  function setSize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', setSize);
}