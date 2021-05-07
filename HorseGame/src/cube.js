// Visualazie path

function VisCube() {
  this.color = "blue";
  this.size = 0.1;
  this.mats = [];
  this.cube;
  this.position = new THREE.Vector3(0, 0, 0);
  this.curveObject;
}

VisCube.prototype.getCube = function (color, size, position,_scene) {
  this.color = color;
  this.size = size;
  this.position = position;
  for (let i = 0; i < 6; i++) {
    this.mats.push(
      new THREE.MeshBasicMaterial({
        color: this.color,
        opacity: 0.6,
        transparent: true,
      })
    );
  }
  this.cube = new THREE.Mesh(
    new THREE.BoxGeometry(this.size, this.size, this.size),
    this.mats
  );
  this.cube.position.set(this.position.x, this.position.y, this.position.z);
  _scene.add(this.cube);
};

VisCube.prototype.getLine = function (catmullPath,_scene) {
  let catmullPTS = catmullPath.getPoints(100);
  let geometry = new THREE.BufferGeometry().setFromPoints(catmullPTS);
  let material = new THREE.LineBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.75,
  });
  this.curveObject = new THREE.Line(geometry, material);
  _scene.add(this.curveObject);
};
