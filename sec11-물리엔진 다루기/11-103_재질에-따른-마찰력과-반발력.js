import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as CANNON from 'cannon-es'; // cannon-es 불러오기

// ----- 주제: Contact Material
// 재질에 따라서 마찰력이나 반발력이 다르다.
export default function example() {
  // Renderer
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // ------------------------------------------------------------------------------------------- 학습 내용
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

  // Contact Material
  const defaultMaterial = new CANNON.Material('default'); // 머티리얼 생성. 이름 설정 가능
  const rubberMaterial = new CANNON.Material('rubber');
  const ironMaterial = new CANNON.Material('iron');
  const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.5, // 마찰
    restitution: 0.3, // 반발
  }); // 1, 2번 매개변수 자리에 인자로 부딪힐 머티리얼 두개를 넣으면 됨
  cannonWorld.defaultContactMaterial = defaultContactMaterial; // defaultContactMaterial에 값 지정해줘야 마찰, 반발력 동작

  const rubberDefaultContactMaterial = new CANNON.ContactMaterial(rubberMaterial, defaultMaterial, {
    friction: 0.5,
    restitution: 0.7,
  });
  cannonWorld.addContactMaterial(rubberDefaultContactMaterial); // cannonWorld에 등록만 한 상태

  const ironDefaultContactMaterial = new CANNON.ContactMaterial(ironMaterial, defaultMaterial, {
    friction: 0.5,
    restitution: 0,
  });
  cannonWorld.addContactMaterial(ironDefaultContactMaterial);

  const floorShape = new CANNON.Plane(); // Grometry == Shape
  const floorBody = new CANNON.Body({
    mass: 0, // 무게 -> 물리엔진의 영향으로 바닥으로 만든 것도 떨어지기 때문에 중력에 영향을 안 받게 해줘야 함. 값 0으로 해주면 됨
    position: new CANNON.Vec3(0, 0, 0), // CANNON에도 Vector3가 있음 == new CANNON.Vec3(x, y, z)
    shape: floorShape,
    material: defaultMaterial, // 바닥 재질 설정
  }); // 물리에 적용받는 실체
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2); // rotation이 아닌 quaternion 사용. setFromAxisAngle(축, 각도)
  cannonWorld.addBody(floorBody);

  const sphereShape = new CANNON.Sphere(0.5); // 0.5 === 반지름
  const sphereBody = new CANNON.Body({
    mass: 1, // 실제 무게라고 생각하고 값 설정. ex) 돌과 스펀지의 무게는 같지 않다. 돌이 더 무겁다.
    position: new CANNON.Vec3(0, 10, 0),
    shape: sphereShape,
    // material: rubberMaterial, // 공 재질 설정
    material: ironMaterial,
  });
  cannonWorld.addBody(sphereBody);

  // Mesh
  const floorMesh = new THREE.Mesh( // 지면 생성
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: 'slategray',
    })
  );
  const sphereGeometry = new THREE.SphereGeometry(0.5);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 'seagreen',
  });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  floorMesh.rotation.x = -Math.PI / 2; //Math.PI / 2; // Math.PI === 3.14.. === 180deg / 2 = 90deg => 수직 각도 제한(상 -> 하)
  floorMesh.receiveShadow = true; // 그림자를 받는 역할
  sphereMesh.position.y = 0.5; // 큐브 사이즈가 1일 경우 y를 0.5로 해줘야 0보다 위에 위치하게 됨.
  sphereMesh.castShadow = true; // 빛에 따른 그림자 생성
  scene.add(floorMesh, sphereMesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();
    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120; // 화면 주사율 체크

    // 메서드 1번 값 => 시간 단계 셋팅. 고정된 시간 단위 1/n초 간격으로 갱신을 해 줄건지 설정 해야 함. 일반적으로는 1/60초를 목표로 함. 하지만 주사율이 2배인 화면도 생각했을때
    // 메서드 2번 값 => 성능보정. delta 같은 시간차?
    // 메서드 3번 값 => 잠재적으로 지연이나 차이가 벌어질 수 있으므로 간격을 메우는 시도를 몇번을 해줄건지 횟수로 셋팅
    cannonWorld.step(cannonStepTime, delta, 3);
    // floorMesh는 가만히 있으므로 굳이 불필요한 연산을 할 필요가 없음
    // floorMesh.position.copy(floorBody.position); // floorBody의 포지션을 카피해서 floorMesh의 포지션에 적용
    sphereMesh.position.copy(sphereBody.position); // floorBody의 포지션을 카피해서 floorMesh의 포지션에 적용. <위치>
    sphereMesh.quaternion.copy(sphereBody.quaternion); // sphereMesh도 quaternion사용 가능. CANNON에서 quaternion를 사용하므로 똑같이 적용 <회전>

    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
  }

  // -------------------------------------------------------------------------------------------

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener('resize', setSize);

  draw();
}
