import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { OBJLoader } from 'OBJLoader';
// import { PLYLoader } from 'PLYLoader';
// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = -190;
camera.position.x = -200;
camera.position.y = 130;
// create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// set ambient light: roof, window, floor color
const hlight = new THREE.AmbientLight(0xFFFFFF,500);
scene.add(hlight);
// set orbit control
var controls = new OrbitControls(camera,renderer.domElement);

var fileNo = 0;
// load ply
// const loader = new PLYLoader();
// loader.load('model.ply', (ply) => {
// 	// move model to center
// 	ply.center();
// 	// process model appearance
// 	const material = new THREE.PointsMaterial( {size: 0.0001, vertexColors: true, transparent: true, opacity: 0.3 } );
// 	const object = new THREE.Points( ply, material );
// 	// scale
// 	object.scale.set(5,5,5);
// 	scene.add( object );
// 	// keep updating object location from sample data
// 	var interval = setInterval(function() {
// 		var formattedNumber = String(fileNo).padStart(6, '0');
// 		// call loadCoordinate function with parameters
// 		loadCoordinateData('/dataset/'+formattedNumber+'.txt');
// 		// move to the next sample data file
// 		fileNo += 1;
// 		if (fileNo == 107) clearInterval(interval);
// 	}, 100);
// 	animate();
// });

// load obj
const loader = new OBJLoader();
loader.load('Warehouse.obj', (obj) => {
	obj.traverse((child) => {
    	if (child instanceof THREE.Mesh) {
    	  // check if this part of the model should be transparent
    	  if (child.material.transparent == false) {
    	    child.material.transparent = true;
    	    child.material.opacity = 0.5; // Adjust opacity as needed
    	  }
    	}
  	});
  	var material = new THREE.MeshBasicMaterial({ color: 0x272727, transparent: true, opacity: 0.7 });
  	obj.children[0].material = material;
	obj.scale.set(10,10,10);
  	scene.add(obj);
	// keep updating object location from sample data
	var interval = setInterval(function() {
		var formattedNumber = String(fileNo).padStart(6, '0');
		// call loadCoordinate function with parameters
		loadCoordinateData('/dataset/'+formattedNumber+'.txt');
		// move to the next sample data file
		fileNo += 1;
		if (fileNo == 107) clearInterval(interval);
	}, 100);
	animate();
});

// load sample data
function loadCoordinateData(file) {
	var dataArray = [];
	readTextFile(file, dataArray)
	.then(count => {
		// print number of object
        console.log(file + ": " + count);
		LoadObjectLocation(dataArray, count);
    });
}

// read sample data file
function readTextFile(file, dataArray) {
	return fetch(file)
    	.then(response => {
    	    if (!response.ok) {
    	        throw new Error('Network response error');
    	    }
    	    return response.text();
    	})
    	.then(data => {
			// process file content
			var lines = data.split('\n');
			lines.forEach(line => {
				var values = line.split(' ');
				dataArray.push(values);
			});
			return dataArray.length
    	})
    	.catch(error => {
    	    console.error('Error loading the file:', error);
    	});

}

// load object x, y, z values
function LoadObjectLocation(dataArray, count){
	for(let i = 0; i < count ; i++){
		console.log("item "+i+" = "+ dataArray[i]);
		createObject(dataArray[i]);
	}
}

// create object with coordinates
function createObject(itemArray){
	console.log("x axis: "+itemArray[0]);
	console.log("y axis: "+itemArray[1]);
	console.log("z axis: "+itemArray[2]);
	const geometryItem = new THREE.SphereGeometry(2, 64, 32);
	const materialItem = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	const cubeItem = new THREE.Mesh( geometryItem, materialItem );
	cubeItem.position.set(itemArray[0], itemArray[1], itemArray[2]);
	scene.add(cubeItem);
	setTimeout(() => {
		scene.remove(cubeItem); // Remove the object from the scene
	}, 100);
}

// animate function
function animate() {
	requestAnimationFrame( animate );
	// set background color
	renderer.setClearColor(0x000000, 1);
	renderer.render( scene, camera );
}


