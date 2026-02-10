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
  let oldTime = Date.now(); // javascript 내장 객체를 사용하기 -> 본인은 이게 더 편함

  function draw() {
    const nowTime = Date.now();
    const time = (nowTime - oldTime) * 0.001;
    oldTime = nowTime;

    mesh.rotation.y += time; 
  
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