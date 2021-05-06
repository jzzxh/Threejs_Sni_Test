// init variable
var svgFile = ["svg/R1.svg", "svg/R2.svg", "svg/R3.svg", "svg/R4.svg"];
var modelFile = [
  "model/horse_orange.glb",
  "model/horse_green.glb",
  "model/horse_pink.glb",
  "model/horse_yellow.glb",
];

const imageTargetPipelineModule = () => {
  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({ scene, camera }) => {
    console.log("initXrScene");

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



      //* End Custom Code

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 0);
  };

  // onUpdate
  const onUpdate = () => {
    const { scene, camera, renderer } = XR.Threejs.xrScene();
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
    disableWorldTracking: true,
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
