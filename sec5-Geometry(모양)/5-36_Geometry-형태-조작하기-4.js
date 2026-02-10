// 아래 경로로 사용하려면 vite 설치해야 됨. readme.md 5번 참조
import * as THREE from 'three';
import dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// Geometry 형태 조작하기 4 - 정점(Vertex) position 이용하기 ------------------------------------------------
// Geometry 형태 조작하기 최종
export default function example() {
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.x = 0;
  camera.position.y = 6;
  camera.position.z = 10;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight('#fff', 0.5); // 은은하게 전체적으로 조명을 비춰주는 메서드
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('#fff', 1);
  directionalLight.position.x = 1;
  directionalLight.position.y = 20;
  directionalLight.position.z = 0;
  scene.add(directionalLight);

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3); // 3은 축, 헬퍼 사이즈
  scene.add(axesHelper);

  // GridHelper
  const gridHelper = new THREE.GridHelper(5); // 5는 사이즈
  scene.add(gridHelper);

  const controls = new OrbitControls(camera, renderer.domElement); // 카메라 컨트롤 추가 - 카메라 회전 가능

  // ------------------------------------------------------------------------------------------- 학습 내용
  // Mesh
  const geometry = new THREE.SphereGeometry(4, 64, 64);
  // const geometry = new THREE.PlaneGeometry(10, 10, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: 'orangered',
    // wireframe: true,
    side: THREE.DoubleSide,
    flatShading: true, // 표면이 부드럽지 않고 각지게 해 줌.
  });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // attributes 속성의 position값을 이용함. (정점(Vertex)의 위치를 담고 있는 배열) Float32Array(12675)은 특정한 타입의 값만 넣을 수 있는 배열이고 성능이 빠름
  // [-0, 4, 0, ...]의 형태로 되어 있는데 3개씩 끊고 각 x, y, z값이다.
  // console.log(geometry.attributes.position.array);

  const positionArray = geometry.attributes.position.array;
  // 랜덤으로 미리 셋팅된 값을 가지고 일괄적이고 일정하게 반복해야 됨! 값은 draw 함수 호출 전에 미리 셋팅해야 됨.
  const randomArray = [];

  // x, y, z가 점 하나 이고 for문이 돌 때 점 한개씩 셋팅해야 하므로 i가 3의 배수일 경우만 조건을 걸어야 됨. (범위)
  for (let i = 0; i < positionArray.length; i += 3) {
    // 정점(Vertex) 한 개의 x, y, z 좌표를 범위가 있는 랜덤으로 조정
    // Math.random()을 더하면 계속 양수가 나오므로 자연스럽게 양쪽으로 오가기 위해서는 음수도 나와야 됨. 그러므로 -0.5를 해줌.(random은 0 ~ 1사이의 값을 출력한다.) 즉 결과는 -0.5 ~ 0.5까지만 나옴.
    // (Math.random() - 0.5) * 0.2는 1/5값임. 범위를 줄이는 과정임.
    positionArray[i] = positionArray[i] + (Math.random() - 0.5) * 0.2; // x 포지션
    positionArray[i + 1] = positionArray[i + 1] + (Math.random() - 0.5) * 0.2; // y 포지션
    positionArray[i + 2] = positionArray[i + 2] + (Math.random() - 0.5) * 0.2; // z 포지션

    // randomArray 고정값 셋팅하기
    randomArray[i] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
  }
  console.log(geometry.attributes.position.array, randomArray);
  // -------------------------------------------------------------------------------------------

  // Dat GUI -> GUI 컨트롤
  const gui = new dat.GUI(); // three.js 뿐만 아니라 js도 적용 됨
  // 오브젝트, 속성(문자열), 범위 최소값, 범위 최대값, 단계 + .name(레이블 네임)
  gui.add(camera.position, 'x', -5, 10, 0.01).name('카메라 포지션 x');
  gui.add(camera.position, 'y', -5, 10, 0.01).name('카메라 포지션 y');
  gui.add(camera.position, 'z', -5, 10, 0.01).name('카메라 포지션 z');
  // 옵셔널 체이닝도 가능
  gui.add(directionalLight.position, 'x').min(0).max(20).step(0.01).name('라이트 포지션 x');
  gui.add(directionalLight.position, 'y').min(0).max(20).step(0.01).name('라이트 포지션 y');
  gui.add(directionalLight.position, 'z').min(0).max(20).step(0.01).name('라이트 포지션 z');

  // camera lookAt
  camera.lookAt(mesh.position);

  // ------------------------------------------------------------------------------------------- 학습 내용
  const startTime = performance.now();

  // Ani
  function draw() {
    const nowTime = performance.now();
    const time = ((nowTime - startTime) / 1000) * 3; // 각도를 더 빨리 바꾸기 위해 * 3을 해줌

    for (let i = 0; i < positionArray.length; i += 3) {
      // cos or sin 사용
      // sin의 y값이 너무 크면 안되기 때문에 * 0.001를 해줌.
      // 각도에 + 셋팅한 랜덤 고정값 -> 사이즈를 키우기 위해 * 100을 해줌
      positionArray[i] += Math.sin(time + randomArray[i] * 100) * 0.001; // x
      positionArray[i + 1] += Math.sin(time + randomArray[i + 1] * 100) * 0.001; // y
      positionArray[i + 2] += Math.sin(time + randomArray[i + 2] * 100) * 0.001; // z
    }

    // 한번 적용하는건 되지만 값을 계속 바꾸려면 업데이트 설정을 true로 해줘야 함.
    geometry.attributes.position.needsUpdate = true;
    // -------------------------------------------------------------------------------------------

    camera.lookAt(mesh.position); // lookAt도 계속 업데이트 해줘야 함.
    renderer.render(scene, camera);

    requestAnimationFrame(draw);
  }

  draw();

  // ReSize
  function setSize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', setSize);
}
