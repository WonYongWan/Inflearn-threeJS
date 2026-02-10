import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default function example() {
  const canvas = document.querySelector('#three-canvas');
  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene and Camera
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5; // OrbitControls 때문에 카메라 y포지션이 정중앙에 위치한 것처럼 보임
  camera.position.z = 4;
  scene.add(camera);

  //Light
  // MeshBasicMaterial은 Light가 필요없음. MeshBasicMaterial외에는 모두 조명이 필요함.
  // const ambientLight = new THREE.AmbientLight('#fff', 1); // 은은하게 전체적으로 조명을 비춰주는 메서드
  // scene.add(ambientLight);

  // const directionalLight = new THREE.DirectionalLight('#fff', 1);
  // directionalLight.position.x = 1;
  // directionalLight.position.z = 2;
  // scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement); // OrbitControls은 기본적으로 lookAt이 적용되어 있음.

  // ------------------------------------------------------------------------------------------- 학습 내용
  // CanvasTexture
  const texCanvas = document.createElement('canvas');
  texCanvas.width = 500;
  texCanvas.height = 500;
  const texContext = texCanvas.getContext('2d'); // 그림을 그리는 붓과 같은 개념
  const canvasTexture = new THREE.CanvasTexture(texCanvas);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // MeshBasicMaterial은 빛이나 그림자의 영향을 받지 않아 입체감이 없음. 대신에 성능이 가장 좋음
  const material = new THREE.MeshBasicMaterial({
    map: canvasTexture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Ani
  function draw() {
    let time = performance.now() * 0.001;

    material.map.needsUpdate = true; // 캔버스 요소에 애니메이션 효과를 넣으려면 needsUpdate를 true로 해줘야 함.

    texContext.fillStyle = 'green'; // texContext 색깔
    texContext.fillRect(0, 0, 500, 500); // x좌표, y좌표, 가로 사이즈, 세로 사이즈
    texContext.fillStyle = 'white'; // texContext 색깔
    texContext.fillRect(time * 50, 100, 50, 50); // x좌표, y좌표, 가로 사이즈, 세로 사이즈
    texContext.font = 'bold 50px sans-serif'; // 폰트 및 사이즈 설정
    texContext.fillText('1분코딩', 200, 200); // 텍스트 설정. text, x좌표, y좌표

    renderer.render(scene, camera);
    requestAnimationFrame(draw); // OrbitControls 작동 하려면 requestAnimationFrame 해줘야 함.
  }
  draw();
  // -------------------------------------------------------------------------------------------

  // Resize
  function setSize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', setSize);
}
