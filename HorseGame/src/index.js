// init variable
var delta;
var clock;
var svgFile = ["svg/R1.svg", "svg/R2.svg", "svg/R3.svg", "svg/R4.svg"];
var modelFile = [
  "model/horse_orange.glb",
  "model/horse_green.glb",
  "model/horse_pink.glb",
  "model/horse_yellow.glb",
];
var lastChange = false;

var vLine;

// set Horse updateRun State
var updateRunCount = 0;
var updateRunState = false;

function allEqual(arr) {
  // Checks array each slice all equal. object filter.
  let krr = [];
  for (let k of arr) {
    krr.push(k.readState);
  }
  return new Set(krr).size == 1;
}

const imageTargetPipelineModule = () => {
  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({ scene, camera }) => {
    console.log("initXrScene");

    // init clock instance
    clock = new THREE.Clock();

    // Light Setup
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight2.position.set(10, 10, -10).normalize();
    scene.add(directionalLight2);

    const light = new THREE.AmbientLight(0x404040, 5); // soft white light
    scene.add(light);

    //* Custom Code

    // Add a purple cube that casts a shadow.
    /*     const material = new THREE.MeshBasicMaterial();
    material.side = THREE.DoubleSide;
    material.map = new THREE.TextureLoader().load(
      "https://cdn.8thwall.com/web/assets/cube-texture.png"
    );
    material.color = new THREE.Color(0xad50ff);
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    cube.position.set(0, 0.5, 0);
    scene.add(cube); */

    for (let i = 0; i < modelFile.length; i++) {
      let HorseModel = new Horse();
      HorseModel.GetModel(
        modelFile[i],
        new THREE.Vector3(0, 0, 0),
        0.03,
        scene
      );
      HorseModel.GetSvgData(svgFile[i], 0.3);
      HorseObjectArr.push(HorseModel);
    }
    console.log(HorseObjectArr);
    //* End Custom Code

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 5, 0);
  };

  // onUpdate
  const onUpdate = () => {
    const { scene, camera, renderer } = XR.Threejs.xrScene();

    if (allEqual(HorseObjectArr) != lastChange) {
      for (let ik = 0; ik < HorseObjectArr.length; ik++) {
        if (HorseObjectArr[ik].path.length > 0) {
          // confirm all path are settle
          HorseObjectArr[ik].SetCatMullPath();
          //HorseObjectArr[ik].updatePosition(new THREE.Vector3(0, 0, 0));
          console.log("IK" + ik + ":" + HorseObjectArr[ik].path.length);
          // Visual Path Cube
          let vCube = new VisCube();
          // visual Path Line
          vLine = new VisCube();
          vLine.getLine(HorseObjectArr[ik].catmullRoomPath, scene);

          // set the curve line transform
          // vLine.curveObject.rotation.set(0.5, 0, 0);
          // vLine.curveObject.position.copy(new THREE.Vector3(10,0,0));

          for (let i = 0; i < HorseObjectArr[ik].path.length; i++) {
            let VecX = HorseObjectArr[ik].path[i].x;
            let VecY = 0;
            let VecZ = HorseObjectArr[ik].path[i].z;
            vCube.getCube(
              "gold",
              0.06,
              new THREE.Vector3(VecX, VecY, VecZ),
              scene
            );
          }
        }
      }
      updateRunCount++;
      lastChange = allEqual(HorseObjectArr);

      console.log("readState bang");
    }

    // console.log(updateRunCount);

    if (allEqual(HorseObjectArr) && updateRunCount == 3) {
      // confirm all path are settle
      //* Loop Condition
      for (let j = 0; j < HorseObjectArr.length; j++) {
        HorseObjectArr[j].updateRun(vLine.curveObject);
      }
      updateRunCount++; // excute once

      // console.log("update RUN.....");
    }

    if (allEqual(HorseObjectArr) && updateRunCount == 4) {
      for (let i = 0; i < HorseObjectArr.length; i++) {
        HorseObjectArr[i].runState = true;
        HorseObjectArr[i].action.play();
      }
      console.log("StarState ---> True");
      updateRunCount++;
    }

    if (allEqual(HorseObjectArr) && updateRunCount >= 5) {
      //* Loop Condition
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
  };

  // Places content over image target
  const showTarget = ({ detail }) => {
    if (detail.name === "flo0128") {
    }
  };

  // Hides the image frame when the target is no longer detected.
  const hideTarget = ({ detail }) => {};

  // Grab a handle to the threejs scene and set the camera position on pipeline startup.
  const onStart = ({ canvas }) => {
    const { scene, camera } = XR8.Threejs.xrScene(); // Get the 3js scene from XR

    initXrScene({
      scene,
      camera,
    }); // Add content to the scene and set starting camera position.

    // Sync the xr controller's 6DoF position and camera paremeters with our scene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    });
    // prevent scroll/pinch gestures on canvas
    canvas.addEventListener("touchmove", event => {
      event.preventDefault();
    });
    // Recenter content when the canvas is tapped.
    canvas.addEventListener(
      "touchstart",
      e => {
        e.touches.length === 1 && XR8.XrController.recenter();
      },
      true
    );
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
    // imageTargets: ["video-target"],
    imageTargets: ["flo0128"], // add or change name from 8thwall cms
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
