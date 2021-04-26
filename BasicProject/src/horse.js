//! set random speed order at push new object to array

var HorseObjectArr = []; // Store create object

function Horse() {
  this.model;
  this.mixer;
  this.action;
  this.timescale = 1;
  this.speed = 0.001;
  this.move = 0.91;
  this.moveCount; // main count to winner
  this.win = false;
  this.position = new THREE.Vector3(0, 0, 0);
  this.scale;
  this.path = [];
  this.pathScalar = 0.8;
  this.readState = false; //
}

Horse.prototype.loadModel = function (url) {
  return new Promise((resolve) => {
    new THREE.GLTFLoader().load(url, resolve);
  });
};

Horse.prototype.GetModel = function (url, position, scale) {
  this.loadModel(url).then((result) => {
    this.model = result.scene;
    this.mixer = new THREE.AnimationMixer(this.model);
    this.action = this.mixer.clipAction(result.animations[0]);
    this.action.timeScale = this.timescale;
    this.action.stop();
    this.scale = scale;
    this.model.scale.set(this.scale, this.scale, this.scale);
    this.position = position;
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
          let x = subPath.getPoints()[k].x * 0.01 - 9.5;
          let y = 0;
          let z = subPath.getPoints()[k].y * 0.01 - 6;
          this.path.push(
            /*             x: subPath.getPoints()[k].x * 0.01 - 9.5,
            y: subPath.getPoints()[k].y * 0.01 - 6,
            scalar: this.scalar, */

            new THREE.Vector3(x, y, z)
          );
        }
      }
    }
  });
  // console.log(this.path);
};
