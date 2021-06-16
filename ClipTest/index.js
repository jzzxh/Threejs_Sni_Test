var model;

const loadmodel = function(url) {
  return new Promise(resolve => {
    new THREE.GLTFLoader().load(url, resolve);
  });
};

const test = function(tt) {
  console.log("call init TT" + tt);
};

const placegroundScenePipelineModule = () => {
  // Populates some object into an XR scene and sets the initial camera position. The scene and
  // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
  const initXrScene = ({ scene, camera }) => {
    console.log("initXrScene");
    // Light Setup
    let lightPosition = {
      lgihtT: new THREE.Vector3(0, 5, 0),
      lightL: new THREE.Vector3(-10, 5, 0),
      lightR: new THREE.Vector3(10, 5, 0),
      lightB: new THREE.Vector3(0, 5, -10),
      LightF: new THREE.Vector3(0, 5, 10),
    };

    for (let lightIns in lightPosition) {
      let dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
      dirLight.position.copy(lightPosition[lightIns]);
      scene.add(dirLight);
    }
    scene.add(new THREE.AmbientLight(0x404040, 5)); // Add soft white light to the scene.

    /*     let loader = new THREE.TextureLoader();
    let texture = loader.load("./trackrun4.png", function(texture) {
      trackLoadState = true;
      let geometry = new THREE.PlaneBufferGeometry(3.2, 1.3, 1);
      let material = new THREE.MeshBasicMaterial({
        map: texture,
        opacity: 1,
        transparent: true,
      });

      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, -2);
      mesh.rotation.set(-1.5, 0, 0);
      mesh.scale.set(1.5, 1.5, 1.5);
      scene.add(mesh);
    }); */

    //* load glb track
    loadmodel("./Truck3d_2.glb").then(result => {
      model = result.scene;
      model.position.set(0, 0, -5);
      model.scale.set(0.5, 0.5, 0.5);
      scene.add(model);
    });

    // test("Hello world!!");

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 0);
  };

  const PJHandler = e => {
    if (e.touches.length === 2) {
      XR8.XrController.recenter();
    }
  };

  /*   const loadmodel = url => {
    return new Promise(resolve => {
      new THREE.GLTFLoader().load(url, resolve);
    });
  }; */

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: "ClipTester",

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR.Threejs scene to be ready before we can access it to add content. It was created in
    // XR.Threejs.pipelineModule()'s onStart method.
    onStart: ({ canvas, canvasWidth, canvasHeight }) => {
      const { scene, camera } = XR.Threejs.xrScene(); // Get the 3js sceen from xr3js.

      initXrScene({ scene, camera }); // Add objects to the scene and set starting camera position.

      canvas.addEventListener("touchstart", PJHandler, true);
      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      });
    },
  };
};

const onxrloaded = () => {
  XR.addCameraPipelineModules([
    // Add camera pipeline modules.
    // Existing pipeline modules.
    XR.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
    XR.Threejs.pipelineModule(), // Creates a ThreeJS AR Scene.
    XR.XrController.pipelineModule(), // Enables SLAM tracking.
    XRExtras.AlmostThere.pipelineModule(), // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
    // Custom pipeline modules.
    placegroundScenePipelineModule(),
  ]);

  // Open the camera and start running the camera run loop.
  XR.run({ canvas: document.getElementById("camerafeed") });
};

// Show loading screen before the full XR library has been loaded.
const load = () => {
  XRExtras.Loading.showLoading({ onxrloaded });
};
window.onload = () => {
  window.XRExtras ? load() : window.addEventListener("xrextrasloaded", load);
};
