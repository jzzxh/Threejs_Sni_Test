var renderer, scene, camera, controls;
var linePoints = [];
var pLinePoints = [];
var lastChange;

// Follow Path init
var up = new THREE.Vector3(1, 0, 0);
var axis = new THREE.Vector3();
var marker;
var viewMaker;
var pt, radians, axis, tangent, pathPxn;

// plinePoint Obj path
var pathScalar = [0.8, 1.1];
var pathObjct = [];

// GLB file
var mixer, clock, model;
var textDom;
var action;

//button start test
var button_State = false;

// the getPoint starting variable - !important - You get me ;)
var t = 0.91; // start point half center
var tc = 0;

function getCube(color, size) {
  // cube mats and cube
  var mats = [];
  for (var i = 0; i < 6; i++) {
    mats.push(
      new THREE.MeshBasicMaterial({
        color: color,
        opacity: 0.6,
        transparent: true,
      })
    );
  }

  var cube = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), mats);

  return cube;
}

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

  // controls
  controls = new THREE.OrbitControls(camera, container);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 10;
  controls.maxDistance = 80;

  ////////////////////////////////////////
  //      Create the cube               //
  ////////////////////////////////////////

  marker = getCube("blue", 1);
  marker.position.set(0, 0, 0);
  scene.add(marker);

  // Load SVG file
  loadSVG("./runway2.svg"); // runway2

  // quick test
  const butObj = document.querySelector(".btn");
  butObj.style.left = String(container.clientWidth / 2 - 25) + "px";

  butObj.addEventListener("click", function (e) {
    // Event listener
    action.play();
    button_State = true;
    t = 0.91;
    tc = 0;
    console.log("Fire.!");
  });

  // test data push array object
  let tTestObjs = [];
  let heyMe = [new THREE.Vector3(1, 1, 1), new THREE.Vector3(2, 2, 2)];
  let obj1 = [],
    obj2 = [];
  let scaleValue = [0.8, 1.2];
  let lineObj = [obj1, obj2];
  for (let i = 0; i < lineObj.length; i++) {
    lineObj[i].foo = [];
    lineObj[i].bar = [];
    lineObj[i].foo.push({
      x: Math.random() * 1000,
      y: Math.random() * 100,
      scalar: scaleValue[i],
    });
    lineObj[i].bar.push({ Vec3: heyMe });
  }

  console.log("--------------- Test Code");
  tTestObjs.push({ xec: lineObj });
  console.log(tTestObjs);
  // let tObj = lineObj[0][0];
  console.log(lineObj);
  // console.log(lineObj[0].foo[0].scalar);
  console.log(lineObj[0].bar[0].Vec3[0]);
  /* console.log(Math.ceil(tObj.x)); */
  console.log("--------------- End Test Code");
  // end quick test

  ///////////////////////
  //  Load GLTF FILE   //
  ///////////////////////
  clock = new THREE.Clock();
  loadGLB("model/Horsew2.gltf", 0.03); //horse2.glb(0.2),  Horsew2.gltf(0.03)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight.position.set(10, 10, 10).normalize();
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight2.position.set(10, 10, -10).normalize();
  scene.add(directionalLight2);

  const light = new THREE.AmbientLight(0x404040, 1); // soft white light
  scene.add(light);

  scene.add(new THREE.AxesHelper(10));

  const gridHelper = new THREE.GridHelper(22, 22);
  scene.add(gridHelper);

  // Hmtl modify

  textDom = document.querySelector(".pInfo");
  // textDom.style = 'color:white'

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  container.append(renderer.domElement);

  // renderer.render(scene, camera);
}

function loadGLB(path, size) {
  const loader = new THREE.GLTFLoader();
  // Load a glTF resource
  loader.load(
    // resource URL
    path,
    // called when the resource is loaded
    function (gltf) {
      model = gltf.scene;
      model.scale.set(size, size, size); // scale here 0.2

      mixer = new THREE.AnimationMixer(model);
      action = mixer.clipAction(gltf.animations[0]);
      action.timeScale = 1;
      action.stop();

      // scene.add(model);
      scene.add(model);
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
    }
  );
}

function loadSVG(url) {
  const loader = new THREE.SVGLoader();

  loader.load(url, function (data) {
    const paths = data.paths;

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
        const subPath = path.subPaths[j];

        for (let k = 0, kl = subPath.getPoints().length; k < kl; k++) {
          /*           linePoints.push([
            (subPath.getPoints()[k].x * 0.01 - 9.5) * 0.8, //Path ScaleX
            (subPath.getPoints()[k].y * 0.01 - 6) * 0.8, //Path ScaleY
          ]); */
          linePoints.push({
            x: subPath.getPoints()[k].x * 0.01 - 9.5,
            y: subPath.getPoints()[k].y * 0.01 - 6,
            scalar: 0.8,
          });
        }
      }
    }
  });
}

let pbj1 = [];
let pbj2 = [];
let pathOBjs = [pbj1, pbj2];
let pathCatmullRoom = [];

function lineDraw() {
  console.log(linePoints[0][0]); //Trick delay frame pass data to plinePoints.

  for (let s = 0; s < pathScalar.length; s++) {
    for (let i = 0; i < linePoints.length; i++) {
      /*  var x = linePoints[i][0];
          var y = 0;
          var z = linePoints[i][1]; */
      /*  let lineObj = linePoints[i];
          var x = lineObj.x * lineObj.scalar;
          var y = 0;
          var z = lineObj.y * lineObj.scalar; */

      let lineObj = linePoints[i];
      let x = lineObj.x * pathScalar[s];
      let y = 0;
      let z = lineObj.y * pathScalar[s];

      pLinePoints.push(new THREE.Vector3(x, y, z));
      pathOBjs[s].push(new THREE.Vector3(x, y, z));
    }
  }
}

function pLinePointObjPush() {
  for (let i = 0; i < pathScalar.length; i++) {
    // pathObjct.push({ Vec3: pLinePoints, scalar: pathScalar[i] });
    pathCatmullRoom.push(new THREE.CatmullRomCurve3(pathOBjs[i]));
  }

  // console.log(pathOBjs[0]);
  // console.log(pathCatmullRoom);
}

function render() {
  // console.log(pLinePoints.length);

  if (pLinePoints.length != lastChange) {
    lineDraw();
    pLinePointObjPush();

    console.log("pLinePlints: " + pLinePoints.length);
    //console.log(pLinePoints);

    if (pLinePoints.length > 0) {
      for (let j = 0; j < pathScalar.length; j++) {
        //Create a path from the points
        /*       pathPxn = new THREE.CatmullRomCurve3(pLinePoints);
      pointsPTS = pathPxn.getPoints(100); */

        let bpointPTS = pathCatmullRoom[j].getPoints(100);

        // const geometry = new THREE.BufferGeometry().setFromPoints(pointsPTS);
        const geometry = new THREE.BufferGeometry().setFromPoints(bpointPTS);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        // Create the final object to add to the scene
        const curveObject = new THREE.Line(geometry, material);
        scene.add(curveObject);

        // Create Path preview
        /*       for (let i = 0, il = pointsPTS.length; i < il; i++) {
        //const cubePoints = pathPxn.getPoints(205)[i];
        const cubePoints = pointsPTS[i];

        viewMaker = getCube("gold", 0.1);
        viewMaker.position.set(cubePoints.x, cubePoints.y, cubePoints.z);
        scene.add(viewMaker);
      } */
        for (let i = 0, il = bpointPTS.length; i < il; i++) {
          //const cubePoints = pathPxn.getPoints(205)[i];
          const cubePoints = bpointPTS[i];
          viewMaker = getCube("gold", 0.1);
          viewMaker.position.set(cubePoints.x, cubePoints.y, cubePoints.z);
          scene.add(viewMaker);
        }
      }

      // console.log(pathPxn.getPoints(205)[0].y);

      // console.log(pointsPTS[0].x);
    }

    lastChange = pLinePoints.length;
  }

  // Animation Part

  /*   if (pLinePoints.length > 0) {
    // set the marker position
    pt = pathPxn.getPoint(t);

    // set the marker position
    marker.position.set(pt.x, pt.y, pt.z);
    model.position.set(pt.x, pt.y, pt.z);
    // get the tangent to the curve
    tangent = pathPxn.getTangent(t).normalize();

    // calculate the axis to rotate around
    axis.crossVectors(up, tangent).normalize();

    // calcluate the angle between the up vector and the tangent
    radians = Math.acos(up.dot(tangent));

    // set the quaternion
    marker.quaternion.setFromAxisAngle(axis, radians);
    model.quaternion.setFromAxisAngle(axis, radians);

    if (button_State) {
      // t = t >= 1 ? 0 : (t += 0.001);
      // t = t >= 1 ? button_State = false : (t += 0.001);
      if (t >= 1) {
        t = 0;
      } else {
        t += 0.001;
        tc += 0.001;
      }

      //start count
      if (tc >= 1) {
        button_State = false;
        action.stop();
      }

      textDom.innerHTML = "Iter: " + tc.toFixed(2); 
    // t = t <= -0.09 ? -0.09 : (t -= 0.001);
  }
} */

  // GLB Animation
  var delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

init();
animate();
