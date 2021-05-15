// init variable
var renderer, scene, camera, controls;
var delta;
var clock;
var statsUI;
var lastChange = false;
var modelFile = [
  "model/horse_orange.glb",
  "model/horse_green.glb",
  "model/horse_pink.glb",
  "model/horse_yellow.glb",
];
var svgFile = ["svg/R1.svg", "svg/R2.svg", "svg/R3.svg", "svg/R4.svg"];

var svgScalar = [1, 1, 1, 1];
var randSpeed = [
  // random speed array
  [0.001, 0.0013, 0.0005, 0.0009],
  [0.0008, 0.0012, 0.0009, 0.00135],
  [0.001, 0.0009, 0.0005, 0.0006],
  [0.0003, 0.0005, 0.00025, 0.0004],
  [0.0008, 0.00052, 0.00045, 0.00066],
];
var randTiemScale = [
  // random Time Scale
  [0.9, 1, 0.5, 0.52],
  [0.5, 1, 0.9, 1.3],
  [1, 0.9, 0.5, 0.75],
  [0.8, 0.9, 0.85, 1.5],
  [0.85, 0.5, 0.5, 0.6],
];
var winnerCheck = true;

// winOrder Checks
var winOrderCount = 0;

// Start Button State
var StartState = false;

// Visual Line Object
var vLine;

// start button state
var startButtonState = false;

// P5JS Varible
var RankState = false; /* default (false) */
var explainButton_State = false;

// rank image
var rankImg = [
  "./image/w1.png",
  "./image/w2.png",
  "./image/w3.png",
  "./image/w4.png",
];
var rankHorseImg = [
  "./image/horseP1.png",
  "./image/horseP2.png",
  "./image/horseP3.png",
  "./image/horseP4.png",
];

// temp data
/* var imgShow;
var imgList = [
  "./image/horsew0.png",
  "./image/horsew1.png",
  "./image/horsew2.png",
  "./image/horsew3.png",
];
 */
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

  //  init Intro Page
  const introContainer = document.querySelector(".introPage");
  setTimeout(function() {
    const coords = { x: 0, y: 0 }; // Start at (0, 0)
    const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
      .to({ x: 0, y: -1000 }, 1000) // Move to (300, 200) in 1 second.
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        introContainer.style.setProperty(
          "transform",
          `translate(${coords.x}px, ${coords.y}px)`
        );
      })
      .start();
    explainButton_State = true;
  }, 3000);

  // Start Button Position
  /*   const butObj = document.querySelector(".btn");
  butObj.style.left = String(container.clientWidth / 2 - 25) + "px";
  butObj.addEventListener("click", function(e) {
    // Event listener
    StartState = true;
    console.log("Fire.!");
  }); */
  // Start Button Triiger
  const startButtonContainer = document.querySelector(".startButton");
  startButtonContainer.addEventListener("click", function(e) {
    // Event listener
    if (startButtonState) {
      // hide target container
      const tartgetContainer = document.querySelector(".target");
      tartgetContainer.style.display = "none";

      // hide button container show
      const startButtonContainer = document.querySelector(".startButton");
      startButtonContainer.style.display = "none";

      for (let i = 0; i < HorseObjectArr.length; i++) {
        const HorseObj = HorseObjectArr[i];
        const tScale = { scale: 0.002 };
        const tween = new TWEEN.Tween(tScale)
          .to({ scale: 0.13 }, 2000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            HorseObj.model.scale.set(tScale.scale, tScale.scale, tScale.scale);
          })
          .start();
      }

      StartState = true;
    }
    console.log("Fire.!");
  });

  /*   const GotitBut = document.querySelector(".onboarding-button");
  GotitBut.addEventListener("click", function (e) {
    const onBoardContainer = document.querySelector(".background-overlay");
    const coords = { x: 0, y: 0 }; // Start at (0, 0)
    const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
      .to({ x: 0, y: -1000 }, 1000) // Move to (
        300, 200) in 1 second.
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        onBoardContainer.style.setProperty(
          "transform",
          `translate(${coords.x}px, ${coords.y}px)`
        );
      })
      .start();
    // onBoardContainer.style.display = "none";
    console.log("onBoard Button Pressed!!");
  }); */

  // End Button

  //imgShow
  /*   imgShow = document.querySelector("#imgshow");
  // imgShow.style.left = String(container.clientWidth / 2 - 240) + "px";
  imgShow.style.left = "0px";
  // imgShow.style.top = String(container.clientHeight / 2 - 100) + "px";
  imgShow.style.top = "50px";
  imgShow.style.display = "none"; */

  // controls
  controls = new THREE.OrbitControls(camera, container);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 5;
  controls.maxDistance = 130;

  // init target position
  const tartgetContainer = document.querySelector(".target");
  tartgetContainer.style.left = String(container.clientWidth / 2 - 70) + "px";
  tartgetContainer.style.top = String(container.clientHeight / 2 - 80) + "px";

  // init status
  statsUI = initStats();

  const gridHelper = new THREE.GridHelper(22, 22);
  scene.add(gridHelper);

  // init clock instance
  clock = new THREE.Clock();

  //* Custom Code

  let randArr = randSpeed[getRandomIntInclusive(0, 4)];
  let randtimescaleArr = randTiemScale[getRandomIntInclusive(0, 4)];
  console.log(randArr);
  console.log(randtimescaleArr);
  for (let i = 0; i < modelFile.length; i++) {
    let HorseModel = new Horse();
    HorseModel.GetModel(
      modelFile[i],
      new THREE.Vector3(0, 0, 0),
      0.0, // default 0.13
      randArr[i],
      randtimescaleArr[i]
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

  const light = new THREE.AmbientLight(0x404040, 5); // soft white light
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
      HorseObjectArr[ik].SetCatMullPath();
      HorseObjectArr[ik].updatePosition(new THREE.Vector3(0, 0, 0));

      // console.log(HorseObjectArr[0].catmullRoomPath.getPoints(10));

      // Visual Path Cube
      let vCube = new VisCube();
      // visual Path Line
      vLine = new VisCube();
      vLine.getLine(HorseObjectArr[ik].catmullRoomPath);

      // set the curve line transform
      vLine.curveObject.rotation.set(0.5, 0, 0);
      // vLine.curveObject.position.copy(new THREE.Vector3(10,0,0));

      for (let i = 0; i < HorseObjectArr[ik].path.length; i++) {
        let VecX = HorseObjectArr[ik].path[i].x;
        let VecY = 0;
        let VecZ = HorseObjectArr[ik].path[i].z;

        // vCube.getCube("gold", 0.1, new THREE.Vector3(VecX, VecY, VecZ));
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
      HorseObjectArr[j].updateRun(vLine.curveObject);
    }
  }

  // Winner Checks
  if (winnerCheck) {
    for (let i = 0; i < HorseObjectArr.length; i++) {
      let winObj = HorseObjectArr[i];
      if (winObj.winState && winObj.winOrder == 0) {
        winOrderCount++;
        winObj.winOrder = winOrderCount;
        console.log("Winner is: --> " + i + " , winCount: " + winOrderCount);

        // quick Test image appendChilds
        /*         let elem = document.createElement("img");
        elem.setAttribute("src", imgList[i]);
        elem.setAttribute("width", "30%");
        elem.setAttribute("height", "auto");
        document.getElementById("imgshow").appendChild(elem);
        imgShow.style.opacity = "0.75";
        imgShow.style.display = "block"; */

        break;
      }
    }
    if (winOrderCount == 4) {
      // User Choosen Compare
      /*     for (let i = 0; i < HorseObjectArr.length; i++) {
        let chooseObj = HorseObjectArr[i];
        if (chooseObj.userChoose == 1 && chooseObj.winOrder == 1) {
          // Right Choose get Winner
          // show some result
        } else {
          // show some result
        }
      } */

      // show p5js container
      // show rank container
      // set rankState (true)
      // wait 1's show rank page
      setTimeout(function() {
        const RankContainer = document.querySelector(".rankPage");
        RankContainer.style.display = "flex";
        const ChooseContainer = document.querySelector("#ChooseInP5");
        ChooseContainer.style.display = "block";
        RankState = true;
      }, 1000);

      console.log(`winorderCount ${winOrderCount}`);
      winnerCheck = false;
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
  TWEEN.update();
}

init();
animate();
