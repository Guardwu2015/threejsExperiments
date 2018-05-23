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

        this.geometry = new THREE.Geometry();
        var rectsH = 10;
        var rectsV =25;
        var dx = 5;
        var dy= 5;


        var angvar = 2*3.14 / (rectsV-1) ;
        this.LineMat= new THREE.LineBasicMaterial( { color: 0x0000ff } );

        for(var i = 0; i< rectsH; i++){

          for(var j=0;j < rectsV; j++){



            var dir1 = new THREE.Vector3(1,0,0).normalize();
            var dir2 = new THREE.Vector3(1,0,0).normalize();
            var dir3 = new THREE.Vector3(1,0,0).normalize();
            var dir4 = new THREE.Vector3(1,0,0).normalize();

            var perp1 = new THREE.Vector3(0,1,0).normalize();
            var perp2 = new THREE.Vector3(0,1,0).normalize();
            var perp3 = new THREE.Vector3(0,1,0).normalize();
            var perp4 = new THREE.Vector3(0,1,0).normalize();

            var ang1 = angvar * j;
            var ang2 = angvar * (j+1);

            var d1 = (Math.sin(i)*0.5+0.5)*5+5;
            var d2 = (Math.sin(i+1)*0.5+0.5)*5+5;

            var dh1 = Math.sin(angvar*(j)*10.)*2;
            var dh2 = Math.sin(angvar*(j+1)*10.)*2;

            var rot1 = perp1.applyAxisAngle(dir1, ang1).multiplyScalar(d1+dh1);
            var rot2 = perp2.applyAxisAngle(dir2, ang1).multiplyScalar(d2+dh1);


            var rot3 = perp3.applyAxisAngle(dir3, ang2).multiplyScalar(d1+dh2);
            var rot4 = perp4.applyAxisAngle(dir4, ang2).multiplyScalar(d2+dh2);

            var lineGeometry = new THREE.Geometry();

            var o1 = new THREE.Vector3(i*dx,0,0 ) ;
            var o2 = new THREE.Vector3((i+1)*dx,0,0 ) ;


            var v1 = new THREE.Vector3(rot1.x,rot1.y ,rot1.z ).add(o1);
            var v2 = new THREE.Vector3(rot2.x, rot2.y ,rot2.z ).add(o2);

            var v3 = new THREE.Vector3(rot3.x, rot3.y ,rot3.z ).add(o1);
            var v4 = new THREE.Vector3(rot4.x, rot4.y ,rot4.z ).add(o2);




            lineGeometry.vertices.push(o1);
            lineGeometry.vertices.push(v1);

            var line = new THREE.Line( lineGeometry, this.lineMat);

            //scene.add( line );


            this.geometry.vertices.push( v3 );
            this.geometry.vertices.push( v4 );
            this.geometry.vertices.push( v2 );
            this.geometry.vertices.push( v1 );


            /*
            this.geometry.vertices.push( new THREE.Vector3(i*dx, j*dy, 2 ) );
            this.geometry.vertices.push( new THREE.Vector3( (i+1)*dx, j*dy, 2 ) );
            this.geometry.vertices.push( new THREE.Vector3( (i+1)*dx, (j+1)*dy, 2 ) );
            this.geometry.vertices.push( new THREE.Vector3(i*dx, (j+1)*dy, 2 ) );
            */


            this.geometry.faces.push( new THREE.Face3( (j*rectsH*4) + i*4,
            (j*rectsH*4) + i*4+1,
            (j*rectsH*4) + i*4+2 ) ); // counter-clockwise winding order
            this.geometry.faces.push( new THREE.Face3( (j*rectsH*4) + i*4,
            (j*rectsH*4) + i*4+2,
            (j*rectsH*4) + i*4+3 ) );


          }

        }
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();

        this.material =  new THREE.MeshLambertMaterial({color: 0x7777ff});
        this.material.side = THREE.DoubleSide;

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        scene.add( this.mesh );

        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xcc00ff} );
        this.wireframe = new THREE.LineSegments( this.geometry, this.lineMaterial );

        //scene.add( this.wireframe );

        var cVertexPos = this.mesh.geometry.vertices.length/2;
        var c = this.geometry.vertices[cVertexPos];

        this.geometry.translate(-c.x, -c.y, -c.z);
        console.log('mesh created');
      }

      update (){





          this.mesh.rotation.x +=.01;
          this.mesh.rotation.y +=.01;
          //this.mesh.position.z = -15;

      }

    }


    var meshes = [];

    var nMesh = 1;
    for(var i=0; i<nMesh; i++){
      meshes.push(new Part());

    }






    renderer.render( scene, camera );


    function animate() {

      for(var i=0; i<meshes.length; i++){
        meshes[i].update();
      }

      requestAnimationFrame( animate );
      renderer.render( scene, camera );

    }
    animate();
