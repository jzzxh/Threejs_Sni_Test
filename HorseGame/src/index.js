// init variable
var delta;
var clock;
// var svgFile = ["svg/R1.svg", "svg/R2.svg", "svg/R3.svg", "svg/R4.svg"];
var svgFile = [
  "svg2/pathw1.svg",
  "svg2/pathw2.svg",
  "svg2/pathw3.svg",
  "svg2/pathw4.svg",
];
/* var modelFile = [
  "model/horse_orange.glb",
  "model/horse_green.glb",
  "model/horse_pink.glb",
  "model/horse_yellow.glb",
]; */
var modelFile = [
  "glb/Horse_1.glb",
  "glb/Horse_2.glb",
  "glb/Horse_3.glb",
  "glb/Horse_4.glb",
];
var lastChange = false;

// device estimate current not use
var deviceEstValue;
var deviceEstSubstractVal = 0;

// visual svg path line
var vLine;

// svg & glb scalar
var svgGlbScalar = 1.3;

var randSpeed = [
  // random speed array
  [0.001, 0.0013, 0.0005, 0.0009],
  [0.0008, 0.0012, 0.0009, 0.00135],
  [0.001, 0.0009, 0.0005, 0.0006],
  [0.0005, 0.0006, 0.00085, 0.00075],
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

// start button state
var startButtonState = false;

// horse track
var trackLoadState = false;

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
var rankHorseChooseImg = [
  "./image/rankch_p1.png",
  "./image/rankch_p2.png",
  "./image/rankch_p3.png",
  "./image/rankch_p4.png",
];

var loadImageState = false;

// Place Object State
var placeObjState = true;

// set Horse updateRun State
var updateRunCount = 0;
var updateRunState = false;

// image target state
var imageTarget_State = false;
var updateRun_State = false;

// choose indicate hint
var indicateObject;

var global_Scene;

const raycaster = new THREE.Raycaster();
const tapPosition = new THREE.Vector2();
var surface; // Transparent surface for raycasting for object placement.

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

function createHorseScene(pointX, pointZ) {
  if (allEqual(HorseObjectArr) != lastChange && trackLoadState) {
    // recenter AR scene
    // XR8.XrController.recenter();

    for (let ik = 0; ik < HorseObjectArr.length; ik++) {
      if (HorseObjectArr[ik].path.length > 0) {
        // confirm all path are settle
        // show horse object
        let horseObj = HorseObjectArr[ik];
        horseObj.model.visible = true;

        HorseObjectArr[ik].SetCatMullPath();
        // HorseObjectArr[ik].updatePosition(new THREE.Vector3(0, 0, 0));
        console.log("IK" + ik + ":" + HorseObjectArr[ik].path.length);

        // Visual Path Cube
        let vCube = new VisCube();
        // visual Path Line
        vLine.getLine(HorseObjectArr[ik].catmullRoomPath, global_Scene);

        //vLine.curveObject.position.set(0,0,0);

        // set the curve line transform
        vLine.setPosition(new THREE.Vector3(pointX, 0.02, pointZ));
        vLine.curveObject.rotation.set(0.06, 0, 0);

        /*         for (let i = 0; i < HorseObjectArr[ik].path.length; i++) {
          let VecX = HorseObjectArr[ik].path[i].x;
          let VecY = 0;
          let VecZ = HorseObjectArr[ik].path[i].z;
          vCube.getCube(
            "gold",
            0.06,
            new THREE.Vector3(VecX, VecY, VecZ),
            global_Scene
          );
        } */
      }
    }
    updateRunCount++;
    imageTarget_State = true;
    lastChange = allEqual(HorseObjectArr);

    console.log("readState bang");
  }
}

function createTrack(pointX, pointZ) {
  let loader = new THREE.TextureLoader();
  let texture = loader.load("./image/trackrun4.png", function(texture) {
    trackLoadState = true;
    let geometry = new THREE.PlaneBufferGeometry(3.2, 1.3, 1);
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      opacity: 1,
      transparent: true,
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pointX, 0, pointZ);
    mesh.rotation.set(-1.5, 0, 0);
    mesh.scale.set(
      1.5 * svgGlbScalar * 0,
      1.5 * svgGlbScalar * 0,
      1.5 * svgGlbScalar * 0
    );
    global_Scene.add(mesh);

    // create horse scene
    createHorseScene(pointX, pointZ);

    // show indicateObject
    indicateObject.visible = true;

    // Horse Animation In
    for (let i = 0; i < HorseObjectArr.length; i++) {
      const HorseObj = HorseObjectArr[i];
      const tScale = { scale: 0 };
      const tween = new TWEEN.Tween(tScale)
        .to({ scale: 1 }, 1300)
        .easing(TWEEN.Easing.Elastic.Out)
        .onUpdate(() => {
          HorseObj.model.scale.set(
            0.02 * svgGlbScalar * tScale.scale,
            0.02 * svgGlbScalar * tScale.scale,
            0.02 * svgGlbScalar * tScale.scale
          );
        })
        .start();
    }

    // Animation In
    const scAll = { sc: 0 };
    const tween = new TWEEN.Tween(scAll) // Create a new tween that modifies 'coords'.
      .to({ sc: 1 }, 1300) // Move to (300, 200) in 1 second.
      .easing(TWEEN.Easing.Elastic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        mesh.scale.set(
          1.5 * svgGlbScalar * scAll.sc,
          1.5 * svgGlbScalar * scAll.sc,
          1.5 * svgGlbScalar * scAll.sc
        );
      })
      .start();
  });
}
const imageTargetPipelineModule = () => {
  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({ scene, camera, renderer }) => {
    console.log("initXrScene");
    /*     renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; */
    // deviceEstimate
    /*     deviceEstValue = window.XR8.XrDevice.deviceEstimate().os;
    if (deviceEstValue === "Android") {
      deviceEstSubstractVal = 0;
    } else {
      deviceEstSubstractVal = 2;
    } */

    // init target position
    const tartgetContainer = document.querySelector(".target");
    tartgetContainer.style.left = String(window.innerWidth / 2 - 50) + "px";
    tartgetContainer.style.top = String(window.innerHeight / 2 - 80) + "px";

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
    }, 5500);

    // Start Button Triiger
    const startButtonContainer = document.querySelector(".startButton");
    startButtonContainer.addEventListener("click", function(e) {
      // Event listener
      if (startButtonState) {
        // hide target container
        /*         const tartgetContainer = document.querySelector(".target");
        tartgetContainer.style.display = "none"; */

        // hide button container show
        const startButtonContainer = document.querySelector(".startButton");
        startButtonContainer.style.display = "none";
        /* 
        for (let i = 0; i < HorseObjectArr.length; i++) {
          const HorseObj = HorseObjectArr[i];
          const tScale = { scale: 0.002 };
          const tween = new TWEEN.Tween(tScale)
            .to({ scale: 0.13 }, 2000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
              HorseObj.model.scale.set(
                tScale.scale,
                tScale.scale,
                tScale.scale
              );
            })
            .start();
        } */
        StartState = true;
      }
      console.log("Fire.!");
    });

    // pass xr8 scene to global
    global_Scene = scene;

    // choose indicate object
    const geometry = new THREE.ConeGeometry(0.8, 2.8, 20);
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    indicateObject = new THREE.Mesh(geometry, material);
    indicateObject.scale.set(0.5 * 0.2, 0.3 * 0.2 , 0.5 * 0.2);
    indicateObject.rotation.z = Math.PI;
    indicateObject.visible = false;
    scene.add(indicateObject);

    // init clock instance
    clock = new THREE.Clock();

    // Light Setup
    lightPosition = {
      lgihtT: new THREE.Vector3(0, 5, 0),
      lightL: new THREE.Vector3(-10, 5, 0),
      lightR: new THREE.Vector3(10, 5, 0),
      lightB: new THREE.Vector3(0, 5, -10),
      LightF: new THREE.Vector3(0, 5, 10),
    };

    for (let lightIns in lightPosition) {
      let dirLight = new THREE.DirectionalLight(0xffffff, 3);
      dirLight.position.copy(lightPosition[lightIns]);
      scene.add(dirLight);
    }

    const light = new THREE.AmbientLight(0x404040, 5); // soft white light
    scene.add(light);

    // End Light Setup

    surface = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 1, 1),
      new THREE.ShadowMaterial({
        opacity: 0.5,
      })
    );
    surface.rotateX(-Math.PI / 2);
    surface.position.set(0, 0, 0);
    surface.receiveShadow = true;
    scene.add(surface);

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
        0.02 * svgGlbScalar,
        randArr[i] * 3,
        randtimescaleArr[i] * 1.7,
        scene
      );
      HorseModel.GetSvgData(svgFile[i], 0.175 * svgGlbScalar);
      HorseObjectArr.push(HorseModel);
    }

    // p5JS preload image
    loadImageState = true;

    // new vLine instance
    vLine = new VisCube();

    console.log(HorseObjectArr);
    //* End Custom Code

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 0);
  };

  // onUpdate
  const onUpdate = () => {
    const { scene, camera, renderer } = XR8.Threejs.xrScene();

    if (allEqual(HorseObjectArr) && imageTarget_State) {
      // confirm all path are settle, set horse init position
      //* once excution

      /*   for (let j = 0; j < HorseObjectArr.length; j++) {
        HorseObjectArr[j].updateRun(vLine.curveObject);
      } */

      updateRunCount++; // excute once
      updateRun_State = true;
      imageTarget_State = false;
      console.log("update RUN.....");
    }

    if (allEqual(HorseObjectArr) && updateRunCount == 2 && StartState) {
      //* once excution Start Run Trigger
      for (let i = 0; i < HorseObjectArr.length; i++) {
        HorseObjectArr[i].runState = true;
        HorseObjectArr[i].action.play();
      }
      console.log("StarState ---> True");
      updateRunCount++;
    }

    //* Loop Condition updateRun
    if (updateRun_State) {
      for (let j = 0; j < HorseObjectArr.length; j++) {
        HorseObjectArr[j].updateRun(vLine.curveObject);

        // show choose indicate top of horse
        if (HorseObjectArr[j].userChoose == 1) {
          indicateObject.position.set(
            HorseObjectArr[j].model.position.x,
            HorseObjectArr[j].model.position.y + 0.7,
            HorseObjectArr[j].model.position.z
          );
        }
      }
    }

    /*   if (allEqual(HorseObjectArr) && updateRunCount == 3 && StartState) {
      //* Loop Condition updateRun
      for (let j = 0; j < HorseObjectArr.length; j++) {
        HorseObjectArr[j].updateRun(vLine.curveObject);
      }
    } */
    // Winner Checks
    if (winnerCheck) {
      for (let i = 0; i < HorseObjectArr.length; i++) {
        let winObj = HorseObjectArr[i];
        if (winObj.winState && winObj.winOrder == 0) {
          winOrderCount++;
          winObj.winOrder = winOrderCount;
          console.log("Winner is: --> " + i + " , winCount: " + winOrderCount);
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

    // Tween update
    TWEEN.update();
  };

  // Places content over image target
  const showTarget = ({ detail }) => {
    if (detail.name === "gift") {
      // console.log("Scan book success!!");
    }
  };

  // Hides the image frame when the target is no longer detected.
  const hideTarget = ({ detail }) => {};

  // create slam horse scene by touch position
  const placeObject = (pointX, pointZ) => {
    if (placeObjState) {
      // show start button
      const startButtonContainer = document.querySelector(".startButton");
      startButtonContainer.style.display = "block";
      // hide target container
      const tartgetContainer = document.querySelector(".target");
      tartgetContainer.style.display = "none";

      setTimeout(function() {
        startButtonState = true;
      }, 2000);

      createTrack(pointX, pointZ);

      placeObjState = false;
    }

    // console.log(`TouchX, ${pointX}, TouchZ, ${pointZ}`);
  };
  const placeObjectTouchHandler = e => {
    // Call XrController.recenter() when the canvas is tapped with two fingers. This resets the
    // AR camera to the position specified by XrController.updateCameraProjectionMatrix() above.
    if (e.touches.length === 2) {
      XR8.XrController.recenter();
    }
    if (e.touches.length > 2) {
      return;
    }
    // If the canvas is tapped with one finger and hits the "surface", spawn an object.
    const { scene, camera } = XR8.Threejs.xrScene();
    // calculate tap position in normalized device coordinates (-1 to +1) for both components.
    tapPosition.x = e.touches[0].clientX / window.innerWidth * 2 - 1;
    tapPosition.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    // Update the picking ray with the camera and tap position.
    raycaster.setFromCamera(tapPosition, camera);
    // Raycast against the "surface" object.
    const intersects = raycaster.intersectObject(surface);
    if (intersects.length === 1 && intersects[0].object === surface) {
      placeObject(intersects[0].point.x, intersects[0].point.z);
    }
  };

  // Grab a handle to the threejs scene and set the camera position on pipeline startup.
  const onStart = ({ canvas, canvasWidth, canvasHeight }) => {
    const { scene, camera, renderer } = XR8.Threejs.xrScene(); // Get the 3js scene from XR

    initXrScene({
      scene,
      camera,
      renderer,
    }); // Add content to the scene and set starting camera position.

    canvas.addEventListener("touchstart", placeObjectTouchHandler, true); // Add touch listener.

    // Sync the xr controller's 6DoF position and camera paremeters with our scene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    });
    // prevent scroll/pinch gestures on canvas
    canvas.addEventListener("touchmove", event => {
      event.preventDefault();
    });
  };

  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be
    // unique within your app.
    name: "HorseGameAR",

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart,
    onUpdate,

    // Listeners are called right after the processing stage that fired them. This guarantees that
    // updates can be applied at an appropriate synchronized point in the rendering cycle.
    listeners: [
      {
        event: "reality.imagefound",
        process: showTarget,
      },
      {
        event: "reality.imageupdated",
        process: showTarget,
      },
      {
        event: "reality.imagelost",
        process: hideTarget,
      },
    ],
  };
};

const onxrloaded = () => {
  // If your app only interacts with image targets and not the world, disabling world tracking can
  // improve speed.
  XR8.xrController().configure({
    disableWorldTracking: false,
    enableWorldPoints: false,
    imageTargets: ["book", "gift"], // add or change name from 8thwall cms
  });
  XR8.addCameraPipelineModules([
    // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
    XR8.Threejs.pipelineModule(), // Creates a ThreeJS AR Scene.
    XR8.XrController.pipelineModule(), // Enables SLAM tracking.
    XRExtras.AlmostThere.pipelineModule(), // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
    // Custom pipeline modules.
    imageTargetPipelineModule(), // Draws a frame around detected image targets.
  ]);

  // Open the camera and start running the camera run loop.
  XR8.run({
    canvas: document.getElementById("camerafeed"),
  });
};

// Show loading screen before the full XR library has been loaded.
const load = () => {
  XRExtras.Loading.showLoading({
    onxrloaded,
  });
};
window.onload = () => {
  window.XRExtras ? load() : window.addEventListener("xrextrasloaded", load);
};
