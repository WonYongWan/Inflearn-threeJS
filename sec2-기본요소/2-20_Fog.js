import * as THREE from '../threeJs/three.module.min.js';

// Fog 안개 ------------------------------------------------
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
  // Fog -> 더 입체감 있게 보이게 할 수 있음
  scene.fog = new THREE.Fog('#000', 3, 7); // color, near, far

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000,
  );
  camera.position.y = 0;
  camera.position.z = 5;

  scene.add(camera);

  // Light
  const light = new THREE.DirectionalLight('#fff', 1);
  light.position.x = 1;
  light.position.y = 3;
  light.position.z = 10;

  scene.add(light);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 'red',
  });

  // 안개 효과를 확인하기 위해 mesh 10개 만들기
  const meshes = [];
  let mesh;

  for(let i = 1; i <= 10; i++) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 5 - 2.5;
    mesh.position.y = Math.random() * 5 - 2.5;
    mesh.position.z = Math.random() * 5 - 2.5;
    scene.add(mesh);
    meshes.push(mesh);
  }

  let oldTime = Date.now();

  // Ani
  function draw() {
    const nowTime = Date.now();
    const time = (nowTime - oldTime) * 0.001;
    oldTime = nowTime;

    meshes.forEach(mesh => {
      mesh.rotation.x += time; 
      mesh.rotation.y += time; 
    });
  
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