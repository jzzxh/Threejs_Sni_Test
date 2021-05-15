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
var modelFile = [
  "model/horse_orange.glb",
  "model/horse_green.glb",
  "model/horse_pink.glb",
  "model/horse_yellow.glb",
];
var lastChange = false;

// device estimate current not use
var deviceEstValue;
var deviceEstSubstractVal = 0;

// visual svg path line
var vLine;

// svg & glb scalar
var svgGlbScalar = 1.3;

// horse track
var trackLoadState = false;

// Place Object State
var placeObjState = true;

// set Horse updateRun State
var updateRunCount = 0;
var updateRunState = false;

// image target state
var imageTarget_State = false;
var imageTargetLev2_State = false;

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
        //HorseObjectArr[ik].updatePosition(new THREE.Vector3(0, 0, 0));
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
  let texture = loader.load("./image/trackrun3.png", function(texture) {
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
    deviceEstValue = window.XR8.XrDevice.deviceEstimate().os;
    if (deviceEstValue === "Android") {
      deviceEstSubstractVal = 0;
    } else {
      deviceEstSubstractVal = 2;
    }

    // pass xr8 scene to global

    global_Scene = scene;

    // init clock instance
    clock = new THREE.Clock();

    // Light Setup
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3, 100);

    // directionalLight.position.set(10, 10, 10).normalize();
    directionalLight.position.set(1, 4.3, 3.5);
    scene.add(directionalLight);

    /*     directionalLight.shadow.mapSize.width = 1024; // default
    directionalLight.shadow.mapSize.height = 1024; // default
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 500; // default
    directionalLight.castShadow = true; */

    /*    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2,100);
    directionalLight2.position.set(10, 10, -10).normalize();
    scene.add(directionalLight2); */

    const light = new THREE.AmbientLight(0x404040, 5); // soft white light
    scene.add(light);

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

    for (let i = 0; i < modelFile.length; i++) {
      let HorseModel = new Horse();
      HorseModel.GetModel(
        modelFile[i],
        new THREE.Vector3(0, 0, 0),
        0.02 * svgGlbScalar,
        scene
      );
      HorseModel.GetSvgData(svgFile[i], 0.175 * svgGlbScalar);
      HorseObjectArr.push(HorseModel);
    }

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

    if (
      allEqual(HorseObjectArr) &&
      /* (updateRunCount == 3 - deviceEstSubstractVal) && */ imageTarget_State
    ) {
      // confirm all path are settle, set horse init position
      //* once excution
      for (let j = 0; j < HorseObjectArr.length; j++) {
        HorseObjectArr[j].updateRun(vLine.curveObject);
      }
      updateRunCount++; // excute once
      imageTargetLev2_State = true;
      imageTarget_State = false;
      console.log("update RUN.....");
    }

    if (
      allEqual(HorseObjectArr) &&
      /*  updateRunCount == 4 - deviceEstSubstractVal && */
      updateRunCount == 2 &&
      imageTargetLev2_State
    ) {
      //* once excution Start Run Trigger
      for (let i = 0; i < HorseObjectArr.length; i++) {
        HorseObjectArr[i].runState = true;
        HorseObjectArr[i].action.play();
      }
      console.log("StarState ---> True");
      updateRunCount++;
    }

    if (
      allEqual(HorseObjectArr) &&
      /*  updateRunCount >= 5 - deviceEstSubstractVal && */
      updateRunCount == 3 &&
      imageTargetLev2_State
    ) {
      //* Loop Condition updateRun
      for (let j = 0; j < HorseObjectArr.length; j++) {
        HorseObjectArr[j].updateRun(vLine.curveObject);
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
