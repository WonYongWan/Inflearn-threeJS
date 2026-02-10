import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// 다른 곳에서도 사용하기 위해 모듈화 진행
export default function example() {
  const canvas = document.querySelector('#three-canvas');
  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 5;
  camera.position.y = 1.5; // OrbitControls 때문에 카메라 y포지션이 정중앙에 위치한 것처럼 보임
  camera.position.z = 4;
  scene.add(camera);

  //Light
  const ambientLight = new THREE.AmbientLight('#fff', 1); // 은은하게 전체적으로 조명을 비춰주는 메서드
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('#fff', 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement); // OrbitControls은 기본적으로 lookAt이 적용되어 있음.

  // ------------------------------------------------------------------------------------------- 학습 내용
  // gltf loader
  const gltfLoader = new GLTFLoader();
  let mixer;
  gltfLoader.load(
    '/models/test.glb', // glb 경로
    (gltf) => {
      scene.add(gltf.scene);

      console.log(gltf.animations);

      mixer = new THREE.AnimationMixer(gltf.scene);
      const actions = [];
      actions[0] = mixer.clipAction(gltf.animations[0]);
      actions[1] = mixer.clipAction(gltf.animations[1]);

      actions[0].play();
      actions[1].play();
    } // glb 파일 로드가 끝나면 실행되는 콜백함수
  );
  // -------------------------------------------------------------------------------------------

  // Ani
  let start = performance.now();

  function draw() {
    const now = performance.now();
    const delta = (now - start) * 0.001;
    start = performance.now();

    if (mixer) mixer.update(delta); // mixer 계속 업데이트 해줘야 함.

    renderer.render(scene, camera);
    requestAnimationFrame(draw);
  }
  draw();

  // Resize
  function setSize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // event
  window.addEventListener('resize', setSize);
}
