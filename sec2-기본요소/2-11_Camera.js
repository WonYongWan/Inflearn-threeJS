import * as THREE from '../threeJs/three.module.min.js';

export default function example() {
  const canvas = document.querySelector('#three-canvas');

  const renderer = new THREE.WebGLRenderer({canvas: canvas});

  renderer.setSize(window.innerWidth, window.innerHeight);

  // Scene(장면, 무대) 생성
  const scene = new THREE.Scene();

  // Camera(카메라) 생성 ->  PerspectiveCamera(원근카메라 = 가장 기본: 3D 장면을 렌더링하는데 가장 널리 쓰이는 투영 모드입니다. / 종류는 2가지 있음)
  const camera = new THREE.PerspectiveCamera(
    75, // fov - 카메라 절두체 수직 시야.
    window.innerWidth / window.innerHeight, // aspect - 카메라 절두체 종횡비. -> 가로 세로 비율. 다르게 얘기하면 (화면의 너비 / 화면의 높이)
    0.1, // near - 카메라 절두체 근평면.
    1000 // far - 카메라 절두체 원평면.
  );

  // Camera 위치 설정 - 안하면 기본값 0, 0, 0 에 위치됨. 이러면 한가운데에 셋팅되서 안보임.
  camera.position.z = 5;

  // Scene에 생성한 Camera 넣기
  scene.add(camera);
}