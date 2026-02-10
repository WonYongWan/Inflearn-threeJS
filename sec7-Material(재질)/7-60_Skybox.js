import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// 무료 3d texture 다운로드 사이트 - https://3dtextures.me/, https://polyhaven.com/
// hdr to cubemap을 해 줘야함. 사이트 - https://matheowis.github.io/HDRI-to-CubeMap/

// 배경에서 이미지를 보여줌.
export default function example() {
  // ------------------------------------------------------------------------------------------- 학습 내용
  const cubeTextureLoader = new THREE.CubeTextureLoader(); // cube 텍스쳐 6면을 세트로 로딩 해주는 메서드
  const cubeTexture = cubeTextureLoader.setPath('../images/textures/cubemap/').load([
    // +(Positive), -(Negativ) 순서
    // x, y, z 순서
    'px.png',
    'nx.png',
    'py.png',
    'ny.png',
    'pz.png',
    'nz.png',
  ]);

  // Renderer
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene and Camera
  const scene = new THREE.Scene();
  scene.background = cubeTexture;
  // -------------------------------------------------------------------------------------------

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5; // OrbitControls 때문에 카메라 y포지션이 정중앙에 위치한 것처럼 보임
  camera.position.z = 4;
  scene.add(camera);

  //Light
  const ambientLight = new THREE.AmbientLight('#fff', 0.5); // 은은하게 전체적으로 조명을 비춰주는 메서드
  const directionalLight = new THREE.DirectionalLight('#fff', 3);
  directionalLight.position.set(1, 1, 2);
  scene.add(ambientLight, directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement); // OrbitControls은 기본적으로 lookAt이 적용되어 있음.

  // ------------------------------------------------------------------------------------------- 학습 내용
  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    envMap: cubeTexture,
  });
  // -------------------------------------------------------------------------------------------

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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
