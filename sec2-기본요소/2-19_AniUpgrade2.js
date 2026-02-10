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
  let drawFlag = true;

  function draw() {
    // getElapsedTime은 증가하는 값, getDelta은 일정한 값, getElapsedTime와 getDelta를 같이 사용하면 안됨
    const delta = clock.getDelta(); // draw 함수 실행 간격 시간을 나타냄

    if(mesh.rotation.y > 3) {
      drawFlag = false;

    } else if(mesh.rotation.y < -3) {
      drawFlag = true;

    }

    if(drawFlag) {
      mesh.rotation.y += delta; 

    } else {
      mesh.rotation.y -= delta; 

    }

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