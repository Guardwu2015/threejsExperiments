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

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-30, 60, 60);
spotLight.castShadow = true;


//let geometry = new THREE.Geometry();

var lastPos = new THREE.Vector3( 0, 0, 0 );
var vertices = [];
var verNum = 8;
var camPos = new THREE.Vector3(0,0,0);

var pos = new THREE.Vector3(0, 0, 0);

var vel;
var mag = 1;

//var dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
//var dir = new THREE.Vector3(1, 0,0);


class Worm{

  constructor(){
    this.dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    //this.dir =  new THREE.Vector3(1, 0,0);
    this.lastPos = new THREE.Vector3(  (Math.random()-.5)*30,
    (Math.random()-.5)*30, (Math.random()-.5)*30 );

    this.geometry = new THREE.Geometry();
    this.material = new THREE.LineBasicMaterial( { color: 0xcc00ff} );

    this.line = new THREE.Line( this.geometry, this.material );;


    for(var i=0; i<verNum; i++){
      //console.log(i);

      var tempDir = this.dir;//new THREE.Vector3( Math.random(), Math.random(), Math.random() );
      var dirNorm = tempDir.normalize();
      var dirScaled = dirNorm.multiplyScalar(mag);
      var tempNewDir= this.lastPos.add(dirScaled);
      //console.log(tempNewDir, lastPos);

      //console.log(newVert);
      //this.geometry.vertices.push(new THREE.Vector3( Math.random()*10, Math.random()*10, Math.random()*10 ));
      this.geometry.vertices.push(new THREE.Vector3( tempNewDir.x, tempNewDir.y, tempNewDir.z ));
      //lastPos=newVert;
    }



    //console.log('n vertex:', this.line.geometry.vertices.length);
    this.line = new THREE.Line( this.geometry, this.material );

    //console.log(this.line.geometry.vertices[5].x);

    scene.add( this.line );
    console.log('worm created');
  }

  update (){

    //console.log(this.line.geometry.vertices.length);

    for(var i=0; i < this.line.geometry.vertices.length ;i++){
      //console.log('i:',i,  '  cond ',i < this.line.geometry.vertices.length);
      if(i == 0){
        var tempDir = this.dir;
        //if(Math.random()<.1){
          tempDir.applyAxisAngle(new THREE.Vector3(Math.random(), Math.random(),Math.random()).normalize(), (Math.random()-.5)*3.14);

        //}
        this.line.geometry.vertices[0].add(tempDir.normalize().multiplyScalar(mag));

      }
      else{

        var vec1 = new THREE.Vector3(this.line.geometry.vertices[i].x, this.line.geometry.vertices[i].y,
        this.line.geometry.vertices[i].z);
        var vec2 = new THREE.Vector3(this.line.geometry.vertices[i-1].x, this.line.geometry.vertices[i-1].y,
        this.line.geometry.vertices[i-1].z);

        //var d = vec1.distanceTo(this.vec2);
        //console.log(i);
        //if(d > 10){

        this.line.geometry.vertices[i] = vec1.add( (vec2.sub(vec1)).multiplyScalar(.2) );
        //}
      }

    }

    this.line.geometry.verticesNeedUpdate= true;

  }

}

var worms = [];
var nWorms = 100;
for(var i=0; i<nWorms; i++){
  worms[i] = new Worm();

}



//console.log(scene.children);

renderer.render( scene, camera );


function animate() {

  for(var i=0; i<worms.length; i++){
    worms[i].update();
  }

  requestAnimationFrame( animate );
  renderer.render( scene, camera );

}
animate();
