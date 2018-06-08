// not working well
//flocking from p5js flocking example.

//init scene
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
var scene = new THREE.Scene();

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-30, 60, 60);
spotLight.castShadow = true;
scene.add(spotLight);

var targetObject = new THREE.Object3D();
targetObject.position.set(new THREE.Vector3(0,0,0));
spotLight.target = targetObject;
scene.add(spotLight.target);


var width = window.innerWidth;
var height =window.innerHeight

var nBoids =10;

var camPos = new THREE.Vector3(0,0,0);
var vertNum = 7;
var mag = .5;


var flock;

function setup() {


  flock = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < nBoids; i++) {
    var b = new Boid(0,0,0);
    flock.addBoid(b);
  }
}

/*
function draw() {
background(51);
flock.run();
}
*/
// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX,mouseY));
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x,y,z) {
  this.acceleration = new THREE.Vector3(0,0,0);
  this.velocity = new THREE.Vector3(Math.random(),Math.random(),Math.random());
  this.position = new THREE.Vector3(x,y,z);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = Math.random()*0.2+.05; // Maximum steering force


  this.bbdir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
  this.newDir = this.bbdir.clone();
  this.bblastPos = new THREE.Vector3(0, 0, 0);
  this.bbgeometry = new THREE.Geometry();


  this.bbmaterial = new THREE.LineBasicMaterial( { color: 0x0000ff} );
  this.bbline = new THREE.Line( this.bbgeometry, this.bbmaterial );;

  for(var i=0; i<vertNum; i++){

    var tempDir = this.bbdir;
    var dirNorm = tempDir.normalize();
    var dirScaled = dirNorm.multiplyScalar(mag);
    var tempNewDir= this.bblastPos.add(dirScaled);

    this.bbgeometry.vertices.push(new THREE.Vector3( tempNewDir.x, tempNewDir.y, tempNewDir.z));
  }


  //mesh
  this.geometry = new THREE.Geometry();
  this.rectsH = vertNum;
  this.rectsV =15;
  var dx = 5;
  var dy= 5;
  var angvar = 2*3.14 / (this.rectsV-1) ;

  this.LineMat= new THREE.LineBasicMaterial( { color: 0x0000ff } );

  for(var i = 0; i< this.rectsH; i++){
    for(var j=0;j < this.rectsV; j++){

      var newDirec = new THREE.Vector3(0,0,0);
      var newDirec2 = new THREE.Vector3(0,0,0);
      var tempVec1 = new THREE.Vector3(0,0,0);
      var tempVec2 = new THREE.Vector3(0,0,0);
      if(i==0){
        newDirec.copy(this.bbdir);
        newDirec2 = tempVec2.copy(this.bbline.geometry.vertices[i+1]).sub(this.bbline.geometry.vertices[i]).normalize();
      }
      else{

        if(i<this.rectsH-1){
          newDirec = tempVec1.copy(this.bbline.geometry.vertices[i]).sub(this.bbline.geometry.vertices[i-1]).normalize();
          newDirec2 = tempVec2.copy(this.bbline.geometry.vertices[i+1]).sub(this.bbline.geometry.vertices[i]).normalize();

        }

      }
      //newDirec.normalize();

      var dir = new THREE.Vector3(newDirec.x, newDirec.y, newDirec.z);
      var perp = new THREE.Vector3(newDirec.x,newDirec.y,newDirec.z);

      var dir2 = new THREE.Vector3(newDirec2.x, newDirec2.y, newDirec2.z);
      var perp2 = new THREE.Vector3(newDirec2.x,newDirec2.y,newDirec2.z);

      perp.cross(new THREE.Vector3(0,1,0)).normalize();
      perp2.cross(new THREE.Vector3(0,1,0)).normalize();

      var ang1 = angvar * j;
      var ang2 = angvar * (j+1);

      var d1 = (Math.sin(i)*0.5+0.5)*5+5;
      var d2 = (Math.sin(i+1)*0.5+0.5)*5+5;
      var dh1 = 0;//Math.sin(angvar*(j)*10.)*1;
      var dh2 = 0;//Math.sin(angvar*(j+1)*10.)*1;

      var rot1 = perp.clone().applyAxisAngle(dir, ang1).multiplyScalar(d1+dh1);
      var rot2 = perp2.clone().applyAxisAngle(dir2, ang1).multiplyScalar(d2+dh1);

      var rot3 = perp.clone().applyAxisAngle(dir, ang2).multiplyScalar(d1+dh2);
      var rot4 = perp2.clone().applyAxisAngle(dir2, ang2).multiplyScalar(d2+dh2);

      var lineGeometry = new THREE.Geometry();

      var o1 = new THREE.Vector3(0,0,0);
      var o2 = new THREE.Vector3(0,0,0);

      if(i<this.rectsH-1){

        o1.copy(this.bbline.geometry.vertices[i]);
        o2.copy(this.bbline.geometry.vertices[i+1]);

      }else {
        o1.copy(this.bbline.geometry.vertices[i]);
        o2.copy(this.bbline.geometry.vertices[i]);
      }


      var v1 = new THREE.Vector3(rot1.x, rot1.y ,rot1.z ).add(o1);
      var v2 = new THREE.Vector3(rot2.x, rot2.y ,rot2.z ).add(o2);
      var v3 = new THREE.Vector3(rot3.x, rot3.y ,rot3.z ).add(o1);
      var v4 = new THREE.Vector3(rot4.x, rot4.y ,rot4.z ).add(o2);


      //for debug
      /*
      lineGeometry.vertices.push(o1);
      lineGeometry.vertices.push(v1);

      if(i!=this.rectsH-1){
      var line = new THREE.Line( lineGeometry, this.lineMat);
      scene.add( line );
    }
    */
    this.geometry.vertices.push( v3 );
    this.geometry.vertices.push( v4 );
    this.geometry.vertices.push( v2 );
    this.geometry.vertices.push( v1 );

    if(i>0){
      this.geometry.faces.push( new THREE.Face3( (j*this.rectsH*4) + i*4,
      (j*this.rectsH*4) + i*4+1,
      (j*this.rectsH*4) + i*4+2 ) ); // counter-clockwise winding order
      this.geometry.faces.push( new THREE.Face3( (j*this.rectsH*4) + i*4,
      (j*this.rectsH*4) + i*4+2,
      (j*this.rectsH*4) + i*4+3 ) );
    }
  }
}
this.geometry.computeFaceNormals();
this.geometry.computeVertexNormals();

this.material =  new THREE.MeshLambertMaterial({color: 0xdddddd});

this.material.side = THREE.DoubleSide;
this.mesh = new THREE.Mesh( this.geometry, this.material );
scene.add( this.mesh );


console.log('mesh created');
//console.log("cube created");
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();

}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  var sep = this.separate(boids);   // Separation
  var ali = this.align(boids);      // Alignment
  var coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.multiplyScalar(1.5);
  ali.multiplyScalar(1.0);
  coh.multiplyScalar(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.clampLength(-this.maxspeed,this.maxspeed);   /// !!!!!!!!!!!!!
  this.position.add(this.velocity);

  // Reset accelertion to 0 each cycle
  this.acceleration.multiplyScalar(0);

  //this.cube.position.copy(this.position);

  for(var i=0; i<vertNum; i++){
    //backbone update
    if(i == 0){

      var tempDir = this.velocity.clone();
      var tempDir2 = this.velocity.clone();

      //console.log(this.velocity);
      if(Math.random()<2.){

        this.newDir = new THREE.Vector3((Math.random()-.5)*2.,
        (Math.random()-.5)*2.,
        (Math.random()-.5)*2.);

      }


      var tempNewDir = this.newDir.clone();


      tempDir2.x += ((tempNewDir.x-tempDir.x)*.15);
      tempDir2.y += ((tempNewDir.y-tempDir.y)*.15);
      tempDir2.z += ((tempNewDir.z-tempDir.z)*.15);

      this.bbline.geometry.vertices[0].add( tempDir2.normalize().multiplyScalar(mag));
      this.bbdir.copy(tempDir2);


    }
    else{

      var vec1 = new THREE.Vector3(this.bbline.geometry.vertices[i].x, this.bbline.geometry.vertices[i].y,
        this.bbline.geometry.vertices[i].z);
        var vec2 = new THREE.Vector3(this.bbline.geometry.vertices[i-1].x, this.bbline.geometry.vertices[i-1].y,
          this.bbline.geometry.vertices[i-1].z);

          this.bbline.geometry.vertices[i] = vec1.add( (vec2.sub(vec1)).multiplyScalar(.2) );

        }

      }


      var angvar = 2*3.14 / (this.rectsV-1) ;
      //mesh update
      for(var i = 0; i< this.rectsH; i++){

        for(var j=0;j < this.rectsV; j++){

          var newDirec = new THREE.Vector3(0,0,0);
          var newDirec2 = new THREE.Vector3(0,0,0);
          var tempVec1 = new THREE.Vector3(0,0,0);
          var tempVec2 = new THREE.Vector3(0,0,0);
          if(i==0){
            newDirec.copy(this.bbdir);
            newDirec2 = tempVec2.copy(this.bbline.geometry.vertices[i+1]).sub(this.bbline.geometry.vertices[i]).normalize();
          }
          else{

            if(i<this.rectsH-1){
              newDirec = tempVec1.copy(this.bbline.geometry.vertices[i]).sub(this.bbline.geometry.vertices[i-1]).normalize();
              newDirec2 = tempVec2.copy(this.bbline.geometry.vertices[i+1]).sub(this.bbline.geometry.vertices[i]).normalize();

            }

          }

          var dir = newDirec.clone();
          var dir2 = newDirec2.clone();

          var perp = newDirec.clone();
          var perp2 = newDirec2.clone();

          perp.cross(new THREE.Vector3(0,1,0)).normalize();
          perp2.cross(new THREE.Vector3(0,1,0)).normalize();

          var ang1 = angvar * j;
          var ang2 = angvar * (j+1);

          var d1 = (Math.sin(i)*0.5+0.5)*5+5;
          var d2 = (Math.sin((i+1))*0.5+0.5)*5+5;
          var dh1 = Math.sin(angvar*(j)*3.)*.5+0.75;
          var dh2 = Math.sin(angvar*(j+1)*3.)*.5+.75;

          var cc = this.rectsH*.5;
          var dd1 = Math.abs((i) -  cc);
          var dd2 = Math.abs((i+1) -  cc);
          var env1 = (cc-dd1)*.06;
          var env2 = (cc-dd2)*.06;

          d1*=.5 ;
          d2*=.5 ;
          dh1*=.55 ;
          dh2*=.55 ;

          var rot1 = perp.clone().applyAxisAngle(dir, ang1).multiplyScalar( (d1* env1+dh1* env1));
          var rot2 = perp2.clone().applyAxisAngle(dir2, ang1).multiplyScalar( (d2* env2+dh1* env2));
          var rot3 = perp.clone().applyAxisAngle(dir, ang2).normalize().multiplyScalar( (d1* env1+dh2* env1));
          var rot4 = perp2.clone().applyAxisAngle(dir2, ang2).normalize().multiplyScalar((d2* env2+dh2* env2));

          var o1 = new THREE.Vector3(0,0,0);
          var o2 = new THREE.Vector3(0,0,0);

          if(i<this.rectsH-1){
            o1.copy(this.bbline.geometry.vertices[i]);
            o2.copy(this.bbline.geometry.vertices[i+1]);
          }else {
            o1.copy(this.bbline.geometry.vertices[i]);
            o2.copy(this.bbline.geometry.vertices[i]);
          }

          var v1 = new THREE.Vector3(rot1.x,rot1.y ,rot1.z ).add(o1);
          var v2 = new THREE.Vector3(rot2.x, rot2.y ,rot2.z ).add(o2);

          var v3 = new THREE.Vector3(rot3.x, rot3.y ,rot3.z ).add(o1);
          var v4 = new THREE.Vector3(rot4.x, rot4.y ,rot4.z ).add(o2);

          var vr = new THREE.Vector3(Math.random(), Math.random(),Math.random()).multiplyScalar(10);

          var pv1 = this.mesh.geometry.vertices[(j*this.rectsH*4)].clone();
          var pv2 = this.mesh.geometry.vertices[(j*this.rectsH*4) + i*4+1].clone();
          var pv3 = this.mesh.geometry.vertices[(j*this.rectsH*4) + i*4+3].clone();
          var pv4 = this.mesh.geometry.vertices[(j*this.rectsH*4) + i*4+2].clone();

          this.mesh.geometry.vertices[(j*this.rectsH*4) + i*4].copy(v1);
          this.mesh.geometry.vertices[(j*this.rectsH*4) + i*4+1].copy(v2);
          this.mesh.geometry.vertices[(j*this.rectsH*4) + i*4+3].copy(v3);
          this.mesh.geometry.vertices[(j*this.rectsH*4) + i*4+2].copy(v4);

        }

      }

      var vert0 = this.bbline.geometry.vertices[0].clone();
      for(var kk =0; kk<this.bbline.geometry.vertices.length; kk++){
        this.bbline.geometry.vertices[kk].sub(vert0);
      }

      this.mesh.position.add(vert0);


      this.bbline.geometry.verticesNeedUpdate = true;
      this.mesh.geometry.verticesNeedUpdate = true;

      this.mesh.geometry.computeFaceNormals();
      this.mesh.geometry.computeVertexNormals();
      this.mesh.visible = true;
    }






    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    Boid.prototype.seek = function(target) {
      var desired = target.clone().sub(this.position);  // A vector pointing from the location to the target
      // Normalize desired and scale to maximum speed
      desired.normalize();
      desired.multiplyScalar(this.maxspeed);
      // Steering = Desired minus Velocity
      var steer = desired.clone().sub(this.velocity);
      steer.clampLength(0,this.maxforce);  // Limit to maximum steering force
      return steer;
    }



    // Separation
    // Method checks for nearby boids and steers away
    Boid.prototype.separate = function(boids) {
      var desiredseparation = 20.0;
      var steer = new THREE.Vector3(0,0,0);
      var count = 0;
      // For every boid in the system, check if it's too close
      for (var i = 0; i < boids.length; i++) {
        var d = this.position.distanceTo(boids[i].position);
        // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
        if ((d > 0) && (d < desiredseparation)) {
          // Calculate vector pointing away from neighbor
          var diff = this.position.clone().sub(boids[i].position);
          diff.normalize();
          diff.divideScalar(d);        // Weight by distance
          steer.add(diff);
          count++;            // Keep track of how many
        }
      }
      // Average -- divide by how many
      if (count > 0) {
        steer.divideScalar(count);
      }

      // As long as the vector is greater than 0
      if (steer.length() > 0) { /// !!!! mag ->length
        // Implement Reynolds: Steering = Desired - Velocity
        steer.normalize();
        steer.multiplyScalar(this.maxspeed);
        steer.sub(this.velocity);
        steer.clampLength(0,this.maxforce);
      }
      return steer;
    }

    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    Boid.prototype.align = function(boids) {
      var neighbordist = 150;
      var sum = new THREE.Vector3(0,0,0);
      var count = 0;
      for (var i = 0; i < boids.length; i++) {
        //var d = p5.Vector.dist(this.position,boids[i].position);
        var d = this.position.distanceTo(boids[i].position);
        if ((d > 0) && (d < neighbordist)) {
          sum.add(boids[i].velocity);
          count++;
        }
      }
      if (count > 0) {
        sum.divideScalar(count);
        sum.normalize();
        sum.multiplyScalar(this.maxspeed);
        var steer = sum.clone().sub(this.velocity);
        steer.clampLength(0,this.maxforce);    // ver limit!!!!!!!!!!!
        return steer;
      } else {
        return new THREE.Vector3(0,0,0);
      }
    }

    // Cohesion
    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    Boid.prototype.cohesion = function(boids) {
      var neighbordist = 150;
      var sum = new THREE.Vector3(0,0,0);   // Start with empty vector to accumulate all locations
      var count = 0;
      for (var i = 0; i < boids.length; i++) {
        var d = this.position.distanceTo(boids[i].position);
        if ((d > 0) && (d < neighbordist)) {
          sum.add(boids[i].position); // Add location
          count++;
        }
      }
      if (count > 0) {
        sum.divideScalar(count);
        return this.seek(sum);  // Steer towards the location
      } else {
        return new THREE.Vector3(0,0,0);
      }
    }

    class BkgPart{

      constructor(){

        this.starsGeometry = new THREE.Geometry();

        for ( var i = 0; i < 100000; i ++ ) {

          var star = new THREE.Vector3();
          star.x = THREE.Math.randFloatSpread( 2000 );
          star.y = THREE.Math.randFloatSpread( 2000 );
          star.z = THREE.Math.randFloatSpread( 2000 );

          this.starsGeometry.vertices.push( star );

        }
        this.starsMaterial = new THREE.PointsMaterial( { color: 0x888888 } );

        this.starField = new THREE.Points( this.starsGeometry, this.starsMaterial );

        scene.add(this.starField );

      }


    }


    setup();
    bkg = new BkgPart();

    renderer.render( scene, camera );


    function animate() {

      flock.run();

    
  var tempPos = flock.boids[0].mesh.position.clone();

    //camera follow
    camPos.add((tempPos.sub(camPos)).multiplyScalar(.5));
    camera.position.set(camPos.x, camPos.y, camPos.z+60);
    camera.lookAt( camPos );

    //Spotlight follow
    spotLight.position.set(camPos.x-30, camPos.y+40, camPos.z+0);
    targetObject.position.set(camPos.x, camPos.y, camPos.z);

    requestAnimationFrame( animate );
    renderer.render( scene, camera );



  }


  animate();
