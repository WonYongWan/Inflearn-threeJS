import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import dat from 'dat.gui';

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
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5; // OrbitControls 때문에 카메라 y포지션이 정중앙에 위치한 것처럼 보임
  camera.position.z = 4;
  scene.add(camera);

  // ------------------------------------------------------------------------------------------- 학습 내용
  //Light
  // 보통 ambientLight을 기본적으로 깔아주고 시작함.
  const ambientLight = new THREE.AmbientLight('#fff', 0.5); // 전체적으로 은은하게 조명을 비춰주는 메서드
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight('white', 3); // 태양광처럼 생각하면 됨. 전체적으로 뿌려지는 후광처럼.
  light.position.y = 3;
  scene.add(light);

  const lightHelper = new THREE.DirectionalLightHelper(light); // 시각적으로 라이트의 위치를 알려줌.
  scene.add(lightHelper);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement); // OrbitControls은 기본적으로 lookAt이 적용되어 있음.

  // Geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  // Material
  const material1 = new THREE.MeshStandardMaterial({ color: 'white' });
  const material2 = new THREE.MeshStandardMaterial({ color: 'royalblue' });
  const material3 = new THREE.MeshStandardMaterial({ color: 'gold' });

  // Mesh
  const plane = new THREE.Mesh(planeGeometry, material1);
  const box = new THREE.Mesh(boxGeometry, material2);
  const sphere = new THREE.Mesh(sphereGeometry, material3);

  plane.rotation.x = -Math.PI / 2; // -90도 회전
  box.position.set(1, 1, 0);
  sphere.position.set(-1, 1, 0);

  scene.add(plane, box, sphere);

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // Dat GUI
  const gui = new dat.GUI();
  gui.add(light.position, 'x', -5, 5);
  gui.add(light.position, 'y', -5, 5);
  gui.add(light.position, 'z', -5, 5);
  // -------------------------------------------------------------------------------------------

  // Ani
  function draw() {
    renderer.render(scene, camera);
    requestAnimationFrame(draw); // OrbitControls 작동 하려면 requestAnimationFrame 해줘야 함.
  }
  draw();

  // Resize
  function setSize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', setSize);
}
