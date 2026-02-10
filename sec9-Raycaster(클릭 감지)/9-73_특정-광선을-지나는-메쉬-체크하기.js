import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

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
  const points = [];
  points.push(new THREE.Vector3(0, 0, 100)); // x, y, z -> z가 100이므로 카메라 방향으로 옴
  points.push(new THREE.Vector3(0, 0, -100)); // z가 -100이므로 카메라 반대 방향으로 감
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points); // BufferGeometry는 임의로 포인트를 설정하고 그 포인트들을 이어가면서 Geometry를 만들어가는 Geometry
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100); // 반지름, 두깨, 세그먼트

  // Material
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 'yellow',
  });
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: 'plum',
  });
  const torusMaterial = new THREE.MeshStandardMaterial({
    color: 'lime',
  });

  // Mesh
  const guide = new THREE.Line(lineGeometry, lineMaterial);
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = 'box';
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = 'torus';
  scene.add(guide, boxMesh, torusMesh);

  // ------------------------------------------------------------------------------------------- 학습 내용
  const meshes = [boxMesh, torusMesh];

  const raycaster = new THREE.Raycaster();

  // Ani
  const start = performance.now();

  function draw() {
    const elapsed = (performance.now() - start) * 0.001;

    boxMesh.position.y = Math.sin(elapsed) * 2;
    torusMesh.position.y = Math.cos(elapsed) * 2;
    boxMesh.material.color.set('plum');
    torusMesh.material.color.set('lime');

    const origin = new THREE.Vector3(0, 0, 100); // 광선을 쏘는 출발점.
    const direction = new THREE.Vector3(0, 0, -100); // 광선의 방향. 길이가 아닌 방향이므로 -1로 하는게 맞음. -100을 하고 싶다면 normalize를 호출해 정규화를 해야 됨.
    direction.normalize();
    console.log(direction.length()); // normalize하면 length가 1로 바뀜.
    raycaster.set(origin, direction);

    // console.log(raycaster.intersectObjects(meshes)); // 광선에 맞았는지 체크. 체크할 요소 전달. 체크할 때 메쉬 전체를 하나로 치는게 아닌 메쉬의 각 면들을 기준으로 체크함.
    const intersects = raycaster.intersectObjects(meshes);
    intersects.forEach((item) => {
      // console.log(item.object.name);
      item.object.material.color.set('red');
    });

    renderer.render(scene, camera);
    requestAnimationFrame(draw);
  }
  draw();
  // -------------------------------------------------------------------------------------------

  // Resize
  function setSize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', setSize);
}
