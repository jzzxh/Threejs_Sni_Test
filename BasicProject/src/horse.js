//! set random speed order at push new object to array

let HorseObjectArr = []; // Store create object

function Horse() {
  this.model;
  this.mixer;
  this.action;
  this.timescale = 1;
  this.speed = 0.001;
  this.move = 0.91;
  this.moveCount; // main count to winner
  this.win = false;
  this.position;
  this.scale;
  this.path = [];
}

Horse.prototype.loadModel = function(url) {
  return new Promise(resolve => {
    new THREE.GLTFLoader().load(url, resolve);
  });
};

Horse.prototype.GetModel = function(url) {
  this.loadModel(url).then(result => {
    this.model = result.scene;
    this.mixer = new THREE.AnimationMixer(this.model);
    this.action = this.mixer.clipAction(result.animations[0]);
    this.action.timeScale = this.timescale;
    this.action.stop();
    scene.add(this.model);
  });
};
