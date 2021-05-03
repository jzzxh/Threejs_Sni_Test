//! set random speed order at push new object to array

var HorseObjectArr = []; // Store create object

function Horse() {
  this.model;
  this.mixer;
  this.action;
  this.timescale = 1;
  this.speed = 0.001;
  this.move = 0.91;
  this.moveCount = 0; // main count to winner
  this.win = false;
  this.position = new THREE.Vector3(0, 0, 0);
  this.scale;
  this.path = [];
  this.catmullRoomPath = [];
  this.pathScalar = 0.8;
  this.readState = false; // Confirm State
  this.runState = false; // start run state
  this.winState = false;
  this.winOrder = 0;
  this.userChoose = -1;
}

Horse.prototype.loadModel = function (url) {
  return new Promise((resolve) => {
    new THREE.GLTFLoader().load(url, resolve);
  });
};

Horse.prototype.GetModel = function (url, position, scale, speed, timescale) {
  this.loadModel(url).then((result) => {
    this.timescale = timescale;
    this.model = result.scene;
    this.mixer = new THREE.AnimationMixer(this.model);
    this.action = this.mixer.clipAction(result.animations[0]);
    this.action.timeScale = this.timescale;
    this.action.stop();
    this.scale = scale;
    this.model.scale.set(this.scale, this.scale, this.scale);
    this.position = position;
    this.speed = speed;
    this.model.position.set(this.position.x, this.position.y, this.position.z);
    scene.add(this.model);

    this.readState = true; // confirm load fin
  });
};

Horse.prototype.updatePosition = function (position) {
  this.position = position;
  this.model.position.set(this.position.x, this.position.y, this.position.z);
};

// SVGload Promise
Horse.prototype.loadSVG = function (url) {
  return new Promise((reslove) => {
    new THREE.SVGLoader().load(url, reslove);
  });
};

Horse.prototype.GetSvgData = function (url, scalar) {
  this.scalar = scalar;

  this.loadSVG(url).then((result) => {
    const paths = result.paths;
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
        const subPath = path.subPaths[j];
        for (let k = 0, kl = subPath.getPoints().length; k < kl; k++) {
          let x = (subPath.getPoints()[k].x * 0.01 - 9.55) * this.scalar;
          let y = 0;
          let z = (subPath.getPoints()[k].y * 0.01 - 5.8) * this.scalar;
          this.path.push(new THREE.Vector3(x, y, z));
        }
      }
    }
  });
};

Horse.prototype.SetCatMullPath = function () {
  this.catmullRoomPath = new THREE.CatmullRomCurve3(this.path);
};

Horse.prototype.updateRun = function (curveObject) {
  // Move on the path
  let pts = this.catmullRoomPath
    .getPoint(this.move)
    .applyMatrix4(curveObject.matrixWorld);

  this.updatePosition(new THREE.Vector3(pts.x, pts.y, pts.z));

  let up = new THREE.Vector3(1, 0, 0);
  let axis = new THREE.Vector3();
  let tangent = this.catmullRoomPath.getTangent(this.move).normalize();
  axis
    .crossVectors(up, tangent)
    .applyMatrix4(curveObject.matrixWorld)
    .normalize();
  // calcluate the angle between the up vector and the tangent
  let radians = Math.acos(up.dot(tangent));

  this.model.quaternion.setFromAxisAngle(axis, radians);

  if (this.runState) {
    // Moving Condition
    if (this.move >= 0.999) {
      // 0.999999 to slove glitch when move on the path
      this.move = 0;
    } else {
      this.move += this.speed;
      this.moveCount += this.speed;
    }
  }

  // Win Checks
  if (this.moveCount >= 1) {
    this.runState = false;
    this.action.stop();
    this.winState = true;
  }
};
