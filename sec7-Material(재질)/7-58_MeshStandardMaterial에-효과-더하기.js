import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// 무료 3d texture 다운로드 사이트 - https://3dtextures.me/

export default function example() {
  // ------------------------------------------------------------------------------------------- 학습 내용
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
  const baseColorTex = textureLoader.load('../images/textures/brick/Brick_Wall_019_basecolor.jpg');
  const ambientTex = textureLoader.load('../images/textures/brick/Brick_Wall_019_ambientOcclusion.jpg');
  const normalTex = textureLoader.load('../images/textures/brick/Brick_Wall_019_normal.jpg');
  const roughnessTex = textureLoader.load('../images/textures/brick/Brick_Wall_019_roughness.jpg');
  const heightTex = textureLoader.load('../images/textures/brick/Brick_Wall_019_height.png');

  // 원본 이미지 색상으로 설정
  baseColorTex.colorSpace = THREE.SRGBColorSpace;
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
  scene.background = new THREE.Color('white');

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
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshStandardMaterial({
    map: baseColorTex,
    roughness: 0.3, // 거칠기 조절
    metalness: 0.3, // 금속성 부여.
    normalMap: normalTex, // 입체감 생김
    roughnessMap: roughnessTex, // 빛의 영향을 더 디테일하게 받음. ex) 벽돌의 금 간 부분 또는 줄눈 등
    aoMap: ambientTex, // 그림자 부분을 어둑어둑하게 해줌 (쉐도우를 진하게 해줌.)
    aoMapIntensity: 10, // aoMap 강도 조절
    color: 'gold',
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
