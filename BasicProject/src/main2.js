// init variable
var renderer, scene, camera, controls;
var delta;
var clock;
var statsUI;
var lastChange = false;
var modelFile = ["model/horse2.glb", "model/horse3_green.glb"];
var svgFile = ["./runway2.svg", "./runway2_1.svg"];
var svgScalar = [1, 1];
var randSpeed = [
  // random speed array
  [0.001, 0.0013],
  [0.0005, 0.0012],
  [0.001, 0.0009],
  [0.0003, 0.0005],
];
var winnerCheck = true;

// Start Button State
var StartState = false;

// temp data
var imgShow;
var imgList = ["./image/horsew0.png", "./image/horsew1.png"];

function init() {
  const container = document.querySelector("#scene-container");

  scene = new THREE.Scene();

  scene.background = new THREE.Color("skyblue");
  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 8, 30);

  // Start Button Position
  const butObj = document.querySelector(".btn");
  butObj.style.left = String(container.clientWidth / 2 - 25) + "px";
  butObj.addEventListener("click", function(e) {
    // Event listener
    StartState = true;
    console.log("Fire.!");
  });

  //imgShow
  imgShow = document.querySelector("#imgshow");
  imgShow.style.left = String(container.clientWidth / 2 - 240) + "px";
  imgShow.style.top = String(container.clientHeight / 2 - 100) + "px";
  imgShow.style.display = "none";

  // controls
  controls = new THREE.OrbitControls(camera, container);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 5;
  controls.maxDistance = 130;

  // init status
  statsUI = initStats();

  const gridHelper = new THREE.GridHelper(22, 22);
  scene.add(gridHelper);

  // init clock instance
  clock = new THREE.Clock();

  //* Custom Code

  let randArr = randSpeed[getRandomIntInclusive(0, 2)];
  for (let i = 0; i < modelFile.length; i++) {
    let HorseModel = new Horse();
    HorseModel.GetModel(
      modelFile[i],
      new THREE.Vector3(0, 0, 0),
      0.15,
      randArr[i]
    );
    HorseModel.GetSvgData(svgFile[i], svgScalar[i]);
    HorseObjectArr.push(HorseModel);
  }

  console.log(HorseObjectArr);

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

  // if (HorseObjectArr[0].readState != lastChange) {
  if (allEqual(HorseObjectArr) != lastChange) {
    for (let ik = 0; ik < HorseObjectArr.length; ik++) {
      HorseObjectArr[ik].updatePosition(new THREE.Vector3(0, 0, 0));
      HorseObjectArr[ik].SetCatMullPath();

      // console.log(HorseObjectArr[0].catmullRoomPath.getPoints(10));

      // Visual Path Cube
      let vCube = new VisCube();
      for (let i = 0; i < HorseObjectArr[ik].path.length; i++) {
        let VecX = HorseObjectArr[ik].path[i].x;
        let VecY = 0;
        let VecZ = HorseObjectArr[ik].path[i].z;

        vCube.getCube("gold", 0.1, new THREE.Vector3(VecX, VecY, VecZ));
      }

      /* console.log(HorseObjectArr[0].path[0]); */

      // lastChange = HorseObjectArr[0].readState;
      lastChange = allEqual(HorseObjectArr);
    }
    console.log("readState bang");
  }

  // Start Run
  if (allEqual(HorseObjectArr) && StartState) {
    for (let i = 0; i < HorseObjectArr.length; i++) {
      HorseObjectArr[i].runState = true;
      HorseObjectArr[i].action.play();
    }
    console.log("StarState ---> True");
    StartState = false;
  }

  if (allEqual(HorseObjectArr)) {
    //* Loop Condition
    for (let j = 0; j < HorseObjectArr.length; j++) {
      HorseObjectArr[j].updateRun();
    }
  }

  // Winner Checks
  if (winnerCheck) {
    for (let i = 0; i < HorseObjectArr.length; i++) {
      let winObj = HorseObjectArr[i];
      if (winObj.winState) {
        console.log("Winner is: --> " + i);
        winnerCheck = false;

        // quick Test image appendChilds

        let elem = document.createElement("img");
        elem.setAttribute("src", imgList[i]);
        elem.setAttribute("width", "50%");
        elem.setAttribute("height", "auto");
        document.getElementById("imgshow").appendChild(elem);
        imgShow.style.display = "block";
      }
    }
  }

  // GLB Animation
  delta = clock.getDelta();

  for (let i = 0; i < HorseObjectArr.length; i++) {
    let horseObj = HorseObjectArr[i];
    if (horseObj.mixer) horseObj.mixer.update(delta);
  }

  statsUI.update();
  renderer.render(scene, camera);
}

function allEqual(arr) {
  // Checks array each slice all equal. object filter.
  let krr = [];
  for (let k of arr) {
    krr.push(k.readState);
  }
  return new Set(krr).size == 1;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

init();
animate();
