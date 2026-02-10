import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as CANNON from 'cannon-es'; // cannon-es 불러오기

// ----- 주제: cannon.js 기본 세팅
// cannon.js도 외부 라이브러리기 때문에 따로 설치해줘야 됨.

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

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

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight('white', 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('white', 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // ------------------------------------------------------------------------------------------- 학습 내용
  // Cannon
  const cannonWorld = new CANNON.World(); // Three.js의 Scene랑 비슷한 역할이라 생각하면 됨. 무대 생성
  cannonWorld.gravity.set(0, -10, 0); // 중력 설정. 축(x, y, z) 별로 세팅 할 수 있음. 음수로 값을 넣어야 떨어지는 방향이 아래로 됨. (지구 중력가속도 9.80665m / s2)

  // Mesh
  const floorMesh = new THREE.Mesh( // 지면 생성
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: 'slategray',
    })
  );
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: 'seagreen',
  });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  floorMesh.rotation.x = -Math.PI / 2; //Math.PI / 2; // Math.PI === 3.14.. === 180deg / 2 = 90deg => 수직 각도 제한(상 -> 하)
  boxMesh.position.y = 0.5; // 큐브 사이즈가 1일 경우 y를 0.5로 해줘야 0보다 위에 위치하게 됨.
  scene.add(floorMesh, boxMesh);
  // -------------------------------------------------------------------------------------------

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
