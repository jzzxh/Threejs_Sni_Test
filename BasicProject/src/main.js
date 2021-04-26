var renderer, scene, camera, controls;
var linePoints = [];
var pLinePoints = [];
var lastChange;

// Follow Path init
// var up = new THREE.Vector3(1, 0, 0);
// var axis = new THREE.Vector3();

let tangent_1,tangent_2 
let radians_1,radians_2;
let up_1 = new THREE.Vector3(1, 0, 0);
let up_2 = new THREE.Vector3(1, 0, 0);
let axis_1 = new THREE.Vector3();
let axis_2 = new THREE.Vector3();
let pts_1,pts_2;

var pathCalObj =[{
  radians: radians_1,
  tangent: tangent_1,
  up: up_1,
  axis: axis_1,
  pts: pts_1
},
{
  radians: radians_2,
  tangent: tangent_2,
  up: up_2,
  axis: axis_2,
  pts: pts_2
}];



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
var button_State = false;

// the getPoint starting variable - !important - You get me ;)
var tsObj = [
  { moveT: 0.91, CountT: 0, Speed: 0.001 },
  { moveT: 0.91, CountT: 0, Speed: 0.001 },
]; // start point half center
var t = 0.91;
var tc = 0;
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

  // quick test
  const butObj = document.querySelector(".btn");
  butObj.style.left = String(container.clientWidth / 2 - 25) + "px";

  butObj.addEventListener("click", function(e) {
    // Event listener
    action_1.play();
    button_State = true;
    t = 0.91;
    tc = 0;

    action_2.play();
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

  loadModel("model/horse2.glb").then(result => {
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

  loadGLB("model/Horsew2.gltf", 0.02); //horse2.glb(0.2),  Horsew2.gltf(0.03)

  /*   Promise.all(p1).then(() => {
    model_2.position.set(0, 0, 0);
    scene.add(model_2);
  }); */

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

  if (pLinePoints.length > 0) {
    // for (let j = 0; j < pathScalar.length; j++) {
    // set the marker position
    /*     pt = pathPxn.getPoint(t);

    // set the marker position
    marker.position.set(pt.x, pt.y, pt.z);
    model.position.set(pt.x, pt.y, pt.z); */

  //  for (let i = 0; i < pathScalar.length; i++) {

      for (let s = 0; s < tsObj.length ; s++) {

        let pts = pathCatmullRoom[s].getPoint(tsObj[s].moveT);
        marker.position.set(pts.x, pts.y, pts.z);
        modelPack[s].position.set(pts.x, pts.y, pts.z);
        /* pathCalObj[s].pts = pathCatmullRoom[s].getPoint(tsObj[s].moveT);
        marker.position.set(pathCalObj[s].pts.x, pathCalObj[s].pts.y, pathCalObj[s].pts.z);
        modelPack[s].position.set(pathCalObj[s].pts.x, pathCalObj[s].pts.y, pathCalObj[s].pts.z); */

        // get the tangent to the curve
        // tangent = pathPxn.getTangent(t).normalize();
        var up = new THREE.Vector3(1, 0, 0);
        var axis = new THREE.Vector3();
        let tangent = pathCatmullRoom[s].getTangent(tsObj[s].moveT).normalize();

        // calculate the axis to rotate around
        axis.crossVectors(up, tangent).normalize();

        // calcluate the angle between the up vector and the tangent
        let radians = Math.acos(up.dot(tangent));

        // set the quaternion
        marker.quaternion.setFromAxisAngle(axis, radians);
        modelPack[s].quaternion.setFromAxisAngle(axis, radians);

        if (button_State) {
          // t = t >= 1 ? 0 : (t += 0.001);
          // t = t >= 1 ? button_State = false : (t += 0.001);
          if (tsObj[s].moveT >= 1) {
            tsObj[s].moveT = 0;
          } else {
            tsObj[s].moveT += tsObj[s].Speed;
            tsObj[s].CountT += tsObj[s].Speed;
          }

          //start count
          if (tsObj[s].CountT >= 1) {
           
            action_1.stop();
            action_2.stop();
            console.log('Win: '+s);
            
            button_State = false;
          }

           textDom.innerHTML = "Iter: " + tsObj[0].CountT.toFixed(2);
          // t = t <= -0.09 ? -0.09 : (t -= 0.001);
        }
      }
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
