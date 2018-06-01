//scene setup
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
var scene = new THREE.Scene();

var ambientLight = new THREE.AmbientLight(0xffffff);
//scene.add(ambientLight);

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-30, 60, 60);
spotLight.castShadow = true;
scene.add(spotLight);

var targetObject = new THREE.Object3D();
targetObject.position.set(new THREE.Vector3(0,0,0));

spotLight.target = targetObject;
scene.add(spotLight.target);


//some initializations
var vertNum = 20;
var mag = .5;
var camPos = new THREE.Vector3(0,0,0);

//the worm!
class Part{

  constructor(){
    //backbone

    this.bbdir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    this.newDir = this.bbdir.clone();
    this.bblastPos = new THREE.Vector3(0, 0, 0);
    this.bbgeometry = new THREE.Geometry();
    /**/
    this.bbmaterial = new THREE.LineBasicMaterial( { color: 0x0000ff} );
    this.bbline = new THREE.Line( this.bbgeometry, this.bbmaterial );;

    for(var i=0; i<vertNum; i++){

      var tempDir = this.bbdir;
      var dirNorm = tempDir.normalize();
      var dirScaled = dirNorm.multiplyScalar(mag);
      var tempNewDir= this.bblastPos.add(dirScaled);

      this.bbgeometry.vertices.push(new THREE.Vector3( tempNewDir.x, tempNewDir.y, tempNewDir.z));
    }

    //for debug
    /*
    this.bbline = new THREE.Line( this.bbgeometry, this.bbmaterial );
    scene.add( this.bbline );
    */

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

//  this.material =  new THREE.MeshLambertMaterial({color: 0x353335});
  this.material =  new THREE.MeshLambertMaterial({color: 0xdddddd});

  this.material.side = THREE.DoubleSide;
  this.mesh = new THREE.Mesh( this.geometry, this.material );
  scene.add( this.mesh );


  console.log('mesh created');

}

update (){

  for(var i=0; i<vertNum; i++){
    //backbone update
    if(i == 0){

      var tempDir = this.bbdir.clone();
      var tempDir2 = this.bbdir.clone();//new THREE.Vector3(tempDir.x,tempDir.y,tempDir.z);


      if(Math.random()<.1){
        //this.newDir.normalize().copy(tempDir.applyAxisAngle(new THREE.Vector3((Math.random()-.5)*2., (Math.random()-5)*2.,(Math.random()-5)*2.), (Math.random()-.5)*360));
        this.newDir = new THREE.Vector3((Math.random()-.5)*2.,
        (Math.random()-.5)*2.,
        (Math.random()-.5)*2.);
        console.log(this.newDir);
      }



      var tempNewDir = this.newDir.clone();



      tempDir2.x += ((tempNewDir.x-tempDir.x)*.05);
      tempDir2.y += ((tempNewDir.y-tempDir.y)*.05);
      tempDir2.z += ((tempNewDir.z-tempDir.z)*.05);

      //

      this.bbline.geometry.vertices[0].add( tempDir2.normalize().multiplyScalar(mag));

      this.bbdir.copy(tempDir2);

    }
    else{

      var vec1 = new THREE.Vector3(this.bbline.geometry.vertices[i].x, this.bbline.geometry.vertices[i].y,
        this.bbline.geometry.vertices[i].z);
        var vec2 = new THREE.Vector3(this.bbline.geometry.vertices[i-1].x, this.bbline.geometry.vertices[i-1].y,
          this.bbline.geometry.vertices[i-1].z);

          this.bbline.geometry.vertices[i] = vec1.add( (vec2.sub(vec1)).multiplyScalar(.5) );

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
          //var env = ((cc-Math.abs(i -  this.rectsH*.5))/this.rectsH*.5)*4.;
          var env1 = (cc-dd1)*.06;
          var env2 = (cc-dd2)*.06;

          d1*=.1 ;
          d2*=.1 ;

          dh1*=.5 ;
          dh2*=.5 ;



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
    update(){


    }


  }


  var meshes = [];


  var nMesh = 1;
  for(var i=0; i<nMesh; i++){
    meshes.push(new Part());
  }

  bkg = new BkgPart();



  renderer.render( scene, camera );


  function animate() {



    for(var i=0; i<meshes.length; i++){
      meshes[i].update();
    }





    var tempPos = meshes[0].mesh.position.clone();

    camPos.add((tempPos.sub(camPos)).multiplyScalar(.075));
    camera.position.set(camPos.x, camPos.y, camPos.z+20);
    camera.lookAt( camPos );

    spotLight.position.set(camPos.x-30, camPos.y+60, camPos.z+60);
    targetObject.position.set(camPos.x, camPos.y, camPos.z);

    requestAnimationFrame( animate );
    renderer.render( scene, camera );



  }


  animate();
