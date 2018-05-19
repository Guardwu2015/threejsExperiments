//init
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
var scene = new THREE.Scene();

var ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);
// add spotlight for the shadows
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-30, 60, 60);
spotLight.castShadow = true;
scene.add(spotLight);



class Part{

  constructor(){
    this.angX = (Math.random()-.5)*.1;
    this.angY = (Math.random()-.5)*.1;

    this.vel = new THREE.Vector3( (Math.random()-.5)*.5,(Math.random()-.5)*.5,
    (Math.random()-.5)*.5);

    var size = Math.random()*3+2;
    this.geometry = new THREE.BoxGeometry( size, size, size );


    this.material =  new THREE.MeshLambertMaterial({color: 0x7777ff});

    this.cube = new THREE.Mesh( this.geometry, this.material );
    this.cube.position.add(new THREE.Vector3( (Math.random()-.5)*50.,
    (Math.random()-.5)*50.,(Math.random()-.5)*50.));
    scene.add( this.cube );

    var nVerts =this.cube.geometry.vertices.length;

    for(var i=0; i<nVerts; i++){
      this.cube.geometry.vertices[i].add(new THREE.Vector3( (Math.random()-.5)*2,
      (Math.random()-.5)*2,
      (Math.random()-.5)*2));

    }
    this.cube.geometry.verticesNeedUpdate = true;


    console.log('box created');
  }

  update (){

    this.cube.rotation.x += this.angX;
    this.cube.rotation.y += this.angY;

    var nVerts =this.cube.geometry.vertices.length;
    this.cube.position.add(this.vel);



  }

}


var cubes = [];

var nCubes = 100;
for(var i=0; i<nCubes; i++){
  cubes.push(new Part());

}
//var cube = new Part();





renderer.render( scene, camera );


function animate() {

  for(var i=0; i<cubes.length; i++){
    cubes[i].update();
  }

  requestAnimationFrame( animate );
  renderer.render( scene, camera );

}
animate();
