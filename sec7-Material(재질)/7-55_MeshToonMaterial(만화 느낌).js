import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// 무료 3d texture 다운로드 사이트 - https://3dtextures.me/

export default function example() {
  // ------------------------------------------------------------------------------------------- 학습 내용
  // Texture
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log('로드 시작');
  };
  loadingManager.onProgress = (img) => {
    console.log(img + '로드');
  };
  loadingManager.onLoad = () => {
    console.log('로드 완료');
  };
  loadingManager.onError = () => {
    console.log('로드 에러');
  };

  const textureLoader = new THREE.TextureLoader(loadingManager);
  const gradientTexture = textureLoader.load('../images/textures/gradient.jpg');
  gradientTexture.magFilter = THREE.NearestFilter;
  // -------------------------------------------------------------------------------------------

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
  // scene.background = new THREE.Color('white');

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5; // OrbitControls 때문에 카메라 y포지션이 정중앙에 위치한 것처럼 보임
  camera.position.z = 4;
  scene.add(camera);

  //Light
  const ambientLight = new THREE.AmbientLight('#fff', 0.5); // 은은하게 전체적으로 조명을 비춰주는 메서드
  const directionalLight = new THREE.DirectionalLight('#fff', 1);
  directionalLight.position.set(1, 1, 2);
  scene.add(ambientLight, directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement); // OrbitControls은 기본적으로 lookAt이 적용되어 있음.

  // ------------------------------------------------------------------------------------------- 학습 내용
  // Mesh
  const geometry = new THREE.ConeGeometry(1, 2, 128); // 반지름, 높이, 세그먼트
  const material = new THREE.MeshToonMaterial({
    color: 'plum',
    gradientMap: gradientTexture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
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
