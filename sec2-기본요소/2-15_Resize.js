import * as THREE from '../threeJs/three.module.min.js';

export default function example() {
  const canvas = document.querySelector('#three-canvas');
  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // console.log(window.devicePixelRatio); // 해당 기기의 픽셀 비율 즉 픽셀 밀도를 나타내는 값
  // renderer.setPixelRatio(window.devicePixelRatio) // 화면 픽셀 밀도에 맞춰서 캔버스의 사이즈를 자동으로 지정해 줌 ex) img X 3같은 고밀도 이미지 느낌
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1) // 2배만 해줘도 왠만하면 이미지가 잘 보이기 때문에 성능상 2 아니면 1로 설정하는게 좋음

  // Scene and Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  scene.add(camera);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: '#049ef4',
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  renderer.render(scene, camera);

  // 브라우저 창 사이즈 변경 대응하기 -----------------------------------------------------------
  function setSize() {
    // 카메라 재설정
    camera.aspect = innerWidth / innerHeight; // window는 전역 객체라서 생략 가능함.
    camera.updateProjectionMatrix(); // 카메라에 변화가 있을때마다 업데이트 해줘야 함.
    renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러의 사이즈 재설정 해줘야 함.
    renderer.render(scene, camera); // 렌더러를 다시 렌더 해줘야 함
  }

  window.addEventListener('resize', setSize);
}