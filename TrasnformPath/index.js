var renderer, scene, camera, controls;
var linePoints = [];
var pLinePoints = [];
var lastChange;

// Follow Path init
// var up = new THREE.Vector3(1, 0, 0);
// var axis = new THREE.Vector3();

let tangent_1, tangent_2;
let radians_1, radians_2;
let up_1 = new THREE.Vector3(1, 0, 0);
let up_2 = new THREE.Vector3(1, 0, 0);
let axis_1 = new THREE.Vector3();
let axis_2 = new THREE.Vector3();
let pts_1, pts_2;

var curveObject;

var pathCalObj = [
  {
    radians: radians_1,
    tangent: tangent_1,
    up: up_1,
    axis: axis_1,
    pts: pts_1,
  },
  {
    radians: radians_2,
    tangent: tangent_2,
    up: up_2,
    axis: axis_2,
    pts: pts_2,
  },
];

var marker;
var viewMaker;
// var pt, radians, axis, tangent, pathPxn;

// plinePoint Obj path
var pathScalar = [0.8, 1];
var pathObjct = [];

// GLB file
var mixer, mixer2, clock;
var modelPack = [];
var model_1, model_2;
var textDom;
var action_1, action_2;

//button start test
var button_State = true;

// the getPoint starting variable - !important - You get me ;)
var tsObj = [
  { moveT: 0.91, CountT: 0, Speed: 0.001 },
  { moveT: 0.91, CountT: 0, Speed: 0.001 },
]; // start point half center
var t = 0.91;
var tc = 0;
var inc = 0.001;
var incSpeed = [0.0015, 0.001]; // difference Speed

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

  // Setup random Speed
  tsObj[0].Speed = incSpeed[0];
  tsObj[1].Speed = incSpeed[1];

  console.log(tsObj);

  ////////////////////////////////////////
  //      Create the cube               //
  ////////////////////////////////////////

  marker = getCube("blue", 1);
  marker.position.set(0, 0, 0);
  scene.add(marker);

  // Load SVG file
  loadSVG("./runway2.svg"); // runway2

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

  loadModel("horse_orange.glb").then(result => {
    model_2 = result.scene;
    mixer2 = new THREE.AnimationMixer(model_2);
    action_2 = mixer2.clipAction(result.animations[0]);
    action_2.timeScale = 1;
    action_2.stop();
    model_2.scale.set(0.15, 0.15, 0.15);
    model_2.position.set(0, 0, 0);
    modelPack.push(model_2);
    scene.add(model_2);
  });

  // loadGLB("horse_orange", 0.2); //horse2.glb(0.2),  Horsew2.gltf(0.03)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight.position.set(10, 10, 10).normalize();
  scene.add(directionalLight);

  const light = new THREE.AmbientLight(0x404040, 6); // soft white light
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

function loadModel(url) {
  return new Promise(resolve => {
    new THREE.GLTFLoader().load(url, resolve);
  });
}

function loadGLB(path, size) {
  const loader = new THREE.GLTFLoader();
  // Load a glTF resource
  loader.load(
    // resource URL
    path,
    // called when the resource is loaded
    function(gltf) {
      model_1 = gltf.scene;
      model_1.scale.set(size, size, size); // scale here 0.2

      mixer = new THREE.AnimationMixer(model_1);
      action_1 = mixer.clipAction(gltf.animations[0]);
      action_1.timeScale = 1;
      action_1.stop();
      modelPack.push(model_1);
      scene.add(model_1);
    }
  );
}

function loadSVG(url) {
  const loader = new THREE.SVGLoader();

  loader.load(url, function(data) {
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
let pathOBjs = [pbj1, pbj2]; //number of path nedd create equal empty obj
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

    console.log(modelPack);

    if (pLinePoints.length > 0) {
      for (let j = 0; j < pathScalar.length; j++) {
        let bpointPTS = pathCatmullRoom[j].getPoints(100);

        // const geometry = new THREE.BufferGeometry().setFromPoints(pointsPTS);
        const geometry = new THREE.BufferGeometry().setFromPoints(bpointPTS);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        // Create the final object to add to the scene
        curveObject = new THREE.Line(geometry, material);
        curveObject.rotation.set(0.4, 0.3, 0.1);

        scene.add(curveObject);

        for (let i = 0, il = bpointPTS.length; i < il; i++) {
          //const cubePoints = pathPxn.getPoints(205)[i];
          const cubePoints = bpointPTS[i];
          viewMaker = getCube("gold", 0.1);
          viewMaker.position.set(cubePoints.x, cubePoints.y, cubePoints.z);
          scene.add(viewMaker);
        }
      }
    }

    lastChange = pLinePoints.length;
  }

  // Animation Part

  if (pLinePoints.length > 0) {
    // for (let s = 0; s < tsObj.length; s++) {
    let pts = pathCatmullRoom[1]
      .getPoint(tsObj[1].moveT)
      .applyMatrix4(curveObject.matrixWorld);
    marker.position.set(pts.x, pts.y, pts.z);
    // modelPack[s].position.set(pts.x, pts.y, pts.z);
    model_2.position.set(pts.x, pts.y, pts.z);

    var up = new THREE.Vector3(1, 0, 0);
    var axis = new THREE.Vector3();
    let tangent = pathCatmullRoom[1].getTangent(tsObj[1].moveT).normalize();

    // calculate the axis to rotate around
    axis.crossVectors(up, tangent).normalize();

    // calcluate the angle between the up vector and the tangent
    let radians = Math.acos(up.dot(tangent));

    // set the quaternion
    marker.quaternion.setFromAxisAngle(axis, radians);
    model_2.quaternion.setFromAxisAngle(axis, radians);

    // rotation curveObject
/*     tc += 0.01;
    curveObject.rotation.set(tc, 0, 0); */
    /*  curveObject.rotation.set(1,0,0); */

    //  if (button_State) {
    // t = t >= 1 ? 0 : (t += 0.001);
    // t = t >= 1 ? button_State = false : (t += 0.001);
    if (tsObj[1].moveT >= 1) {
      tsObj[1].moveT = 0;
    } else {
      tsObj[1].moveT += tsObj[1].Speed;
      tsObj[1].CountT += tsObj[1].Speed;
    }

    //start count
    /*         if (tsObj[0].CountT >= 1) {
          action_1.stop();
          action_2.stop();
          console.log("Win: " + s);

          button_State = false;
        } */

    // }
    // }
    //}
    // }
  }

  // GLB Animation
  var delta = clock.getDelta();

  if (mixer) mixer.update(delta);
  if (mixer2) mixer2.update(delta);

  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

init();
animate();
