import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js';
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
  // 그림자 설정
  renderer.shadowMap.enabled = true; // 그림가 설정 될 수 있도록 셋팅해야 함. 셋팅 후 light, mesh등에도 설정해줘야 함.
  // renderer.shadowMap.type = THREE.PCFShadowMap; // type의 기본값은 PCFShadowMap
  // renderer.shadowMap.type = THREE.BasicShadowMap; // antialias이 사라지면서 그림자가 거칠어짐. 성능이 좋음. 픽셀아트에 쓰임. 극대화하려면 light.shadow.mapSize.width, height값을 극단적으로 줄이면 됨.
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 시각적으로 기본값과 별 차이 없어 보이지만 좀 더 부드러운 느낌을 줌.

  // Scene and Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5; // OrbitControls 때문에 카메라 y포지션이 정중앙에 위치한 것처럼 보임
  camera.position.z = 4;
  scene.add(camera);

  //Light
  // 보통 ambientLight을 기본적으로 깔아주고 시작함.
  const ambientLight = new THREE.AmbientLight('#fff', 0.5); // 전체적으로 은은하게 조명을 비춰주는 메서드
  scene.add(ambientLight);

  // ------------------------------------------------------------------------------------------- 학습 내용
  // RectAreaLight는 사각형 광원 판에서 뿜어져 나오는 불빛을 정의하는 메서드.
  const light = new THREE.RectAreaLight('orange', 10, 2, 2); // 색, 빛의 양, 사각형 영역의 크기(가로, 세로)
  light.position.y = 2;
  light.position.z = 4;
  scene.add(light);

  // RectAreaLight는 Helper가 따로 없음. 따로 import 해와야 함.
  const lightHelper = new RectAreaLightHelper(light); // 시각적으로 라이트의 위치를 알려줌.
  scene.add(lightHelper);
  // -------------------------------------------------------------------------------------------

  // 그림자 설정
  // RectAreaLight는 그림자가 없으므로 사용 못함.
  // light.castShadow = true; // 그림자를 만들 수 있는 light가 됨.
  // light.shadow.mapSize.width = 2048; // 기본값은 512. 크면 클수록 고품질이 됨. 대신에 값이 너무 크면 성능저하의 원인이 될 수 있음
  // light.shadow.mapSize.height = 2048; // 1024, 2048이 무난함.
  // light.shadow.radius = 15; // 그림자가 퍼지게 하는 블러 효과. PCFShadowMap만 적용됨.
  // light.shadow.camera.near = 1; // 그림자 범위를 조절해 줌.
  // light.shadow.camera.far = 10; // 그림자 범위를 조절해 줌.

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement); // OrbitControls은 기본적으로 lookAt이 적용되어 있음.

  // Geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  // Material
  const material1 = new THREE.MeshStandardMaterial({ color: 'white' });
  const material2 = new THREE.MeshStandardMaterial({ color: 'white' });
  const material3 = new THREE.MeshStandardMaterial({ color: 'white' });

  // Mesh
  const plane = new THREE.Mesh(planeGeometry, material1);
  const box = new THREE.Mesh(boxGeometry, material2);
  const sphere = new THREE.Mesh(sphereGeometry, material3);

  plane.rotation.x = -Math.PI / 2; // -90도 회전
  box.position.set(1, 1, 0);
  sphere.position.set(-1, 1, 0);

  // 그림자 설정
  // 내가 다른 물체에 영향을 주는 경우에는 castShadow = true
  // 다른 물체가 나에게 영향을 주는 경우에는 receiveShadow = true
  plane.receiveShadow = true;
  box.castShadow = true;
  box.receiveShadow = true;
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  scene.add(plane, box, sphere);

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // Dat GUI
  const gui = new dat.GUI();
  gui.add(light.position, 'x', -5, 5);
  gui.add(light.position, 'y', -5, 5);
  gui.add(light.position, 'z', -5, 5);

  // Ani
  function draw() {
    const time = performance.now() * 0.001;

    // light.position.x = Math.cos(time) * 5;
    // light.position.z = Math.sin(time) * 5;

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
