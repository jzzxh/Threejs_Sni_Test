// init variable
var renderer, scene, camera, controls;
var delta;
var clock;
var statsUI;
var lastChange = false;
var w

// temp data
// var x = 0;

function init() {
  const container = document.querySelector("#scene-container");

  scene = new THREE.Scene();

  scene.background = new THREE.Color("skyblue");
  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 8, 30);

  // Start Button Position
  const butObj = document.querySelector(".btn");
  butObj.style.left = String(container.clientWidth / 2 - 25) + "px";

  // controls
  controls = new THREE.OrbitControls(camera, container);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 10;
  controls.maxDistance = 130;

  // init status
  statsUI = initStats();

  const gridHelper = new THREE.GridHelper(22, 22);
  scene.add(gridHelper);

  // init clock instance
  clock = new THREE.Clock();

  //* Custom Code

  let HorseModel = new Horse();
  HorseModel.GetModel("model/horse2.glb", new THREE.Vector3(0, 0, 0), 0.15);
  HorseModel.GetSvgData("./runway2.svg", 0.8);
  HorseObjectArr.push(HorseModel);
  console.log(HorseObjectArr[0]);

  //* End Custom Code

  // Light Setup
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(10, 10, 10).normalize();
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight2.position.set(10, 10, -10).normalize();
  scene.add(directionalLight2);

  const light = new THREE.AmbientLight(0x404040, 0.8); // soft white light
  scene.add(light);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.append(renderer.domElement);

  console.log("init");
}

function initStats() {
  const stats = new Stats();
  stats.setMode(0); // FPS mode
  document.getElementById("stats").appendChild(stats.domElement);
  return stats;
}

function render() {
  //* iteration Once
  if (HorseObjectArr[0].readState != lastChange) {
    HorseObjectArr[0].updatePosition(new THREE.Vector3(-10, 0, 0));
    HorseObjectArr[0].action.play();
    HorseObjectArr[0].SetCatMullPath();

    console.log("readState bang");

    // console.log(HorseObjectArr[0].catmullRoomPath.getPoints(10));

    // Visual Path Cube
    // Test Cube
    let vCube = new VisCube();

    for (let i = 0; i < HorseObjectArr[0].path.length; i++) {
      let VecX = HorseObjectArr[0].path[i].x;
      let VecY = 0;
      let VecZ = HorseObjectArr[0].path[i].z;

      vCube.getCube("gold", 0.1, new THREE.Vector3(VecX, VecY, VecZ));
    }

    /* console.log(HorseObjectArr[0].path[0]); */

    lastChange = HorseObjectArr[0].readState;
  }

  if (HorseObjectArr[0].readState) {    //* Loop Condition

    HorseObjectArr[0].updateRun();

/*      let pts = HorseObjectArr[0].catmullRoomPath.getPoint(HorseObjectArr[0].move);

      HorseObjectArr[0].updatePosition(new THREE.Vector3(pts.x, pts.y, pts.z));

      let up = new THREE.Vector3(1, 0, 0);
      let axis = new THREE.Vector3();
      let tangent = HorseObjectArr[0].catmullRoomPath.getTangent(HorseObjectArr[0].move).normalize();
      axis.crossVectors(up, tangent).normalize();
      // calcluate the angle between the up vector and the tangent
      let radians = Math.acos(up.dot(tangent));

      HorseObjectArr[0].model.quaternion.setFromAxisAngle(axis, radians);
 
  
    // Moving Condition
    if(HorseObjectArr[0].move >= 1){
      HorseObjectArr[0].move = 0;
    }else{
      HorseObjectArr[0].move += HorseObjectArr[0].speed;
      HorseObjectArr[0].moveCount += HorseObjectArr[0].speed;
    }


    if(HorseObjectArr[0].moveCount >= 1){


    } */

    // console.log('moveing: ' + HorseObjectArr[0].moveCount);

 /*    x += 0.05;

    x > 10
      ? (x = -5)
      : HorseObjectArr[0].updatePosition(new THREE.Vector3(x, 0, 0)); */
  }

  // GLB Animation
  delta = clock.getDelta();

  for (let i = 0; i < HorseObjectArr.length; i++) {
    let horseObj = HorseObjectArr[0];
    if (horseObj.mixer) horseObj.mixer.update(delta);
  }

  statsUI.update();
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

init();
animate();
