import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { PreventDragClick } from './9-76_PreventDragClick';

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

  // Geometry
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100); // 반지름, 두깨, 세그먼트

  // Material
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: 'plum',
  });
  const torusMaterial = new THREE.MeshStandardMaterial({
    color: 'lime',
  });

  // Mesh
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = 'box';
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = 'torus';
  scene.add(boxMesh, torusMesh);

  const meshes = [boxMesh, torusMesh];

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(); // x, y 2차원 위치. 마우스는 평면이기 때문에 2차원으로 사용하면 됨.

  // Ani
  const start = performance.now();

  function draw() {
    const elapsed = (performance.now() - start) * 0.001;

    boxMesh.position.y = Math.sin(elapsed) * 2;
    torusMesh.position.y = Math.cos(elapsed) * 2;
    // boxMesh.material.color.set('plum');
    // torusMesh.material.color.set('lime');

    renderer.render(scene, camera);
    requestAnimationFrame(draw);
  }
  draw();

  function checkIntersects() {
    console.log(preventDragClick.mouseMoved);
    if (preventDragClick.mouseMoved) return;

    // 카메라 시점을 기준으로 하기 때문에 set이 아닌 setFromCamera 메서드를 사용하면 됨.
    raycaster.setFromCamera(mouse, camera); // 광선을 쏘는 출발점, 광선의 방향

    const intersects = raycaster.intersectObjects(meshes);
    for (const item of intersects) {
      // console.log(item.object.name);
      item.object.material.color.set('red');
      break; // break를 걸어주는 이유는 광선에 여러 물체가 동시에 찍힐 수 있기 때문에 원하는 물체만 출력하기 위해서 걸어줌.
    }
  }

  // Resize
  function setSize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // event
  window.addEventListener('resize', setSize);
  canvas.addEventListener('click', (e) => {
    // three.js의 좌표에 맞게 설정해줘야 함. (클릭 위치 / 창 크기) * 2 - 1
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -(e.clientY / canvas.clientHeight) * 2 + 1; // three.js에서 y는 위가 +가 되야하므로 값을 반대로 설정

    checkIntersects();
  });

  const preventDragClick = new PreventDragClick(canvas);
}
