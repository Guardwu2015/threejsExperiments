var vertices = [];
var camPos = new THREE.Vector3(0,0,0);

var pos = new THREE.Vector3(0, 0, 0);

var vel;
var mag = 1;

var dir = new THREE.Vector3(1, 0, 0);

var maxVerts = 100;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

var scene = new THREE.Scene();

var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

var geometry = new THREE.Geometry();

geometry.vertices.push(new THREE.Vector3(0, 0, 0) );

var line = new THREE.Line( geometry, material );

scene.add( line );
renderer.render( scene, camera );

function animate() {


  dir.applyAxisAngle(new THREE.Vector3(Math.random(), Math.random(),Math.random()), Math.random()*.5);
  dir.normalize();
  vel = dir.multiplyScalar(mag);
  pos = pos.add(vel);


  scene.remove( line );

  vertices.push(new THREE.Vector3(pos.x, pos.y, pos.z));
  if(vertices.length>maxVerts){
    vertices.splice(0,1);
  }

  var geometry = new THREE.Geometry();
  geometry.vertices = vertices;

  line = new THREE.Line( geometry, material );



  scene.add( line );




  requestAnimationFrame( animate );
  renderer.render( scene, camera );

  var tempPos = new THREE.Vector3(pos.x, pos.y, pos.z);
  camPos.add((tempPos.sub(camPos)).multiplyScalar(0.01));

  camera.position.set(camPos.x, camPos.y, camPos.z+100);
  camera.lookAt( camPos );


}
animate();
