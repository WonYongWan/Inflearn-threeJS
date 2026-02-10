import * as THREE from 'three';

// ----- 주제: 스크롤에 따라 움직이는 3D 페이지
export default function example() {
  // Renderer
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight('white', 0.5);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight('white', 0.7); // 색, 강도
  spotLight.position.set(0, 150, 100);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024; // 그림자 퀄리티 조정, 기본값 512
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 1; // near과 far 사이에서 그림자가 만들어짐
  spotLight.shadow.camera.far = 200;
  scene.add(spotLight);

  // Mesh
  const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 'white' }));
  floorMesh.rotation.x = -Math.PI / 2; // -90도로 각도 조정
  scene.add(floorMesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener('resize', setSize);

  draw();
}
