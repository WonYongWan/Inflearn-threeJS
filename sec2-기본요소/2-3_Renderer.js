import * as THREE from '../threeJs/three.module.min.js';

export default function example() {
  // 동적으로 캔버스 조립 --------------------------------------------
  // 렌더러 생성
  // const renderer = new THREE.WebGLRenderer();

  // 렌더러 사이즈 지정
  // renderer.setSize(window.innerWidth, window.innerHeight);

  // 생성된 렌더러 엘리먼트를 html에 삽입
  // document.body.appendChild(renderer.domElement);

  // 정적으로 캔버스 조립 !! 가장 최적화된 방법 --------------------------------------------
  const canvas = document.querySelector('#three-canvas');

  //  선택한 엘리먼트 속성으로 넣기
  const renderer = new THREE.WebGLRenderer({canvas: canvas});

  // 렌더러 사이즈 지정
  renderer.setSize(window.innerWidth, window.innerHeight);
}