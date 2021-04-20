var renderer, scene, camera, controls;
var linePoints = [];
var pLinePoints = [];
var lastChange;


// Follow Path init
var up = new THREE.Vector3(1, 0, 0);
var axis = new THREE.Vector3();
var marker;
var pt, radians, axis, tangent, pathPxn;
// the getPoint starting variable - !important - You get me ;)
var t = 0; 



function getCube() {
  // cube mats and cube
  var mats = [];
  for (var i = 0; i < 6; i++) {
    mats.push(
      new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
        opacity: 0.6,
        transparent: true,
      })
    );
  }

  var cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    mats
  );

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

  camera.position.set(0, 5, 20);

  // controls
  controls = new THREE.OrbitControls(camera, container);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 10;
  controls.maxDistance = 50;

    ////////////////////////////////////////
  //      Create the cube               //
  ////////////////////////////////////////

  marker = getCube();
  marker.position.set(0, 0, 0);
  scene.add(marker);


  // var mats = [];
  // for (var i = 0; i < 6; i++) {
  //   mats.push(
  //     new THREE.MeshBasicMaterial({
  //       color: Math.random() * 0xffffff,
  //       opacity: 0.6,
  //       transparent: true,
  //     })
  //   );
  // }

  // const geometry = new THREE.BoxBufferGeometry(2, 2, 2);

  // //   const material = new THREE.MeshBasicMaterial(mats);
  // // const facematerial = new THREE.MeshBasicMaterial(mats); //dec

  // const cube = new THREE.Mesh(geometry, mats);

  // scene.add(cube);

  // Create Line
  //   const lineMaterial = new THREE.LineBasicMaterial({ color: 'red' });

  //   const points = [];
  //   points.push(new THREE.Vector3(-10, 0, 0));
  //   points.push(new THREE.Vector3(0, 10, 0));
  //   points.push(new THREE.Vector3(10, 0, 0));

  //   const linGeometry = new THREE.BufferGeometry().setFromPoints(points);

  //   const line = new THREE.Line(linGeometry, lineMaterial);

  //   scene.add(line);

  // Load SVG file
  loadSVG("./runway2.svg");

  //   LineCatmullroom();

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0.75, 0.75, 1.0).normalize();
  scene.add(directionalLight);

  scene.add(new THREE.AxesHelper(10));

  const gridHelper = new THREE.GridHelper(22, 22);
  scene.add(gridHelper);

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  container.append(renderer.domElement);

  // renderer.render(scene, camera);
}

function loadSVG(url) {
  const loader = new THREE.SVGLoader();

  loader.load(url, function(data) {
    const paths = data.paths;
    const group = new THREE.Group();
    group.scale.multiplyScalar(0.005);
    group.position.x = 0;
    group.position.y = 0;
    group.scale.y *= -1;

    // console.log(paths);

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      const material = new THREE.MeshBasicMaterial({
        color: "red",
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
        const subPath = path.subPaths[j];

        for (let k = 0, kl = subPath.getPoints().length; k < kl; k++) {
          linePoints.push([
            subPath.getPoints()[k].x * 0.01 - 10,
            subPath.getPoints()[k].y * 0.01 - 5,
          ]);
        }

        // const geometry = THREE.SVGLoader.pointsToStroke(
        //   subPath.getPoints(),
        //   path.userData.style
        // );

        // if (geometry) {
        //   const mesh = new THREE.Mesh(geometry, material);
        //   group.add(mesh);
        // }
      }
    }

    // pLinePoints = _.cloneDeep(linePoints);
    // console.log(linePoints.length);

    scene.add(group);
  });

  // console.log("plinpoints: " + pLinePoints.length);
  // console.log("Test ponts: " + testPoints2.length);
}

function LineCatmullroom() {
  //Hard coded array of points

  var points = [[0, 2], [2, 10], [-1, 15], [-3, 20], [0, 25]];

  //Convert the array of points into vertices
  //   for (var i = 0; i < points.length; i++) {
  //     var x = points[i][0];
  //     var y = 0;
  //     var z = points[i][1];
  //     points[i] = new THREE.Vector3(x, y, z);
  //   }

  // for (var i = 0; i < linePoints.length; i++) {
  //     var x = linePoints[i][0];
  //     var y = 0;
  //     var z = linePoints[i][1] ;
  //     pLinePoints.push(new THREE.Vector3(x, y, z));
  //   }

  //Create a path from the points
  //   var path = new THREE.CatmullRomCurve3(points);
  //   var geometry = new THREE.TubeGeometry(path, 64, 2, 8, false);
  //Basic red material
  //   var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  //Create a mesh
  //   var tube = new THREE.Mesh(geometry, material);
  //Add tube into the scene
  //   scene.add(tube);

  //   const pathPxn = new THREE.CatmullRomCurve3(linePoints);
  //   const pointsPTS = pathPxn.getPoints(50);
  //   const geometry = new THREE.BufferGeometry().setFromPoints(pointsPTS);

  //   const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  //   // Create the final object to add to the scene
  //   const curveObject = new THREE.Line(geometry, material);

  //   scene.add(curveObject);
}

function lineDraw() {
   
  console.log(linePoints[0][0]); //Trick delay frame pass data to plinePoints.

  for (var i = 0; i < linePoints.length; i++) {
    var x = linePoints[i][0];
    var y = 0;
    var z = linePoints[i][1];
    pLinePoints.push(new THREE.Vector3(x, y, z));
  }
}

function render() {
  // console.log(pLinePoints.length);

  if (pLinePoints.length != lastChange) {
    lineDraw();

    console.log("pLinePlints: " + pLinePoints.length);
    //console.log(pLinePoints);

    if (pLinePoints.length > 0) {
      //Create a path from the points
       pathPxn = new THREE.CatmullRomCurve3(pLinePoints);
      const pointsPTS = pathPxn.getPoints(100);
      const geometry = new THREE.BufferGeometry().setFromPoints(pointsPTS);
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

      // Create the final object to add to the scene
      const curveObject = new THREE.Line(geometry, material);

      scene.add(curveObject);
    }

    lastChange = pLinePoints.length;
  }

  if (pLinePoints.length > 0) {
    // set the marker position
    pt = pathPxn.getPoint(t);

    // set the marker position
    marker.position.set(pt.x, pt.y, pt.z);
  
    // get the tangent to the curve
    tangent = pathPxn.getTangent(t).normalize();
  
    // calculate the axis to rotate around
    axis.crossVectors(up, tangent).normalize();
  
    // calcluate the angle between the up vector and the tangent
    // radians = Math.acos( up.dot( tangent ) );
    radians = Math.acos(up.dot(tangent));
  
    // set the quaternion
    marker.quaternion.setFromAxisAngle(axis, radians);
  
    t = t >= 1 ? 0 : (t += 0.001);

  }

  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

init();
animate();
