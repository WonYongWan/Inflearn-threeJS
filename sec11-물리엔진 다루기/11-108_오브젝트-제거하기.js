import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as CANNON from 'cannon-es'; // cannon-es 불러오기
import { PreventDragClick } from './PreventDragClick';
import { MySphere } from './MySphere';

// ----- 주제: 충돌 이벤트, 사운드 넣기
export default function example() {
  // Renderer
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // 구 형태가 떨어질때 그림자가 생성되게 하려면 renderer, directionalLight, floorMesh, sphereMesh 모두 그림자 설정 셋팅을 해줘야 함.
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자 부드럽게 설정

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight('white', 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('white', 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  directionalLight.castShadow = true; // 빛에 따른 그림자 생성
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Cannon(물리 엔진)
  const cannonWorld = new CANNON.World(); // Three.js의 Scene랑 비슷한 역할이라 생각하면 됨. 무대 생성
  cannonWorld.gravity.set(0, -10, 0); // 중력 설정. 축(x, y, z) 별로 세팅 할 수 있음. 음수로 값을 넣어야 떨어지는 방향이 아래로 됨. (지구 중력가속도 9.80665m / s2)

  // 성능을 위한 셋팅
  cannonWorld.allowSleep = true; // body(요소)가 엄청 느려지면, 테스트 안함.(만능은 아님. 상황마다 판단) - 게임 같은 경우는 안됨
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld); // 퀄리티를 저하시키 않으면서 퍼포먼스도 잘 나옴(제일 많이 사용함)

  // Contact Material
  const defaultMaterial = new CANNON.Material('default'); // 머티리얼 생성. 이름 설정 가능
  const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.5, // 마찰
    restitution: 0.3, // 반발
  }); // 1, 2번 매개변수 자리에 인자로 부딪힐 머티리얼 두개를 넣으면 됨
  cannonWorld.defaultContactMaterial = defaultContactMaterial; // defaultContactMaterial에 값 지정해줘야 마찰, 반발력 동작

  const floorShape = new CANNON.Plane(); // Grometry == Shape
  const floorBody = new CANNON.Body({
    mass: 0, // 무게 -> 물리엔진의 영향으로 바닥으로 만든 것도 떨어지기 때문에 중력에 영향을 안 받게 해줘야 함. 값 0으로 해주면 됨
    position: new CANNON.Vec3(0, 0, 0), // CANNON에도 Vector3가 있음 == new CANNON.Vec3(x, y, z)
    shape: floorShape,
    material: defaultMaterial, // 바닥 재질 설정
  }); // 물리에 적용받는 실체
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2); // rotation이 아닌 quaternion 사용. setFromAxisAngle(축, 각도)
  cannonWorld.addBody(floorBody);

  // Mesh
  const floorMesh = new THREE.Mesh( // 지면 생성
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: 'slategray',
    }),
  );
  floorMesh.rotation.x = -Math.PI / 2; //Math.PI / 2; // Math.PI === 3.14.. === 180deg / 2 = 90deg => 수직 각도 제한(상 -> 하)
  floorMesh.receiveShadow = true; // 그림자를 받는 역할
  scene.add(floorMesh);

  const spheres = [];
  const sphereGeometry = new THREE.SphereGeometry(0.5);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 'seagreen',
  });

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();
    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120; // 화면 주사율 체크
    cannonWorld.step(cannonStepTime, delta, 3);

    spheres.forEach((item) => {
      item.mesh.position.copy(item.cannonBody.position);
      item.mesh.quaternion.copy(item.cannonBody.quaternion);
    });

    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 사운드 넣기
  const sound = new Audio('../sounds/boing.mp3');
  function collide(e) {
    const velocity = e.contact.getImpactVelocityAlongNormal(); // 부딪히는 속도
    if (velocity > 3) {
      sound.currentTime = 0; // 현재 플레이 헤드가 있는 시간 초기화
      sound.play();
    }
  }

  // 이벤트
  window.addEventListener('resize', setSize);
  canvas.addEventListener('click', () => {
    const mySphere = new MySphere({
      scene,
      cannonWorld,
      sphereGeometry,
      sphereMaterial,
      x: (Math.random() - 0.5) * 2, // -1 ~ 1 범위로 설정
      y: Math.random() * 5 + 2, // 좀 위쪽에 뜨도록 설정. 2 ~ 7 범위
      z: (Math.random() - 0.5) * 2,
      scale: Math.random() + 0.2,
    });

    spheres.push(mySphere);
    mySphere.cannonBody.addEventListener('collide', collide); // 충돌 이벤트
  });

  const preventDragClick = new PreventDragClick(canvas);

  // ------------------------------------------------------------------------------------------- 학습 내용
  const $btn = document.createElement('button');
  $btn.style.cssText = 'position: absolute; left: 20px; top: 20px; font-size:20px';
  $btn.innerHTML = '삭제';
  document.body.append($btn);

  $btn.addEventListener('click', () => {
    spheres.forEach((item) => {
      item.cannonBody.removeEventListener('collide', collide); // 충돌 이벤트 제거
      cannonWorld.removeBody(item.cannonBody); // 물리엔진 삭제
      scene.remove(item.mesh); // 메쉬 삭제
    });
  });
  // -------------------------------------------------------------------------------------------

  draw();
}
