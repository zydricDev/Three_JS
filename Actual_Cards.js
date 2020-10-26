import * as THREE from 'three';
import {cardContent, switchContent, closeContent} from './Actual_Cards_Content.js'


var camera, scene, raycaster, renderer;
var mouse = new THREE.Vector2(), INTERSECTED;
var counter = 0;
var tracker = [];


function indicator(e){
  if(e){
    if(e.path[0].id == 'left-btn' && counter == 0){
      card_switch_left();
      tracker.unshift(tracker.pop());


    }else if (counter == 0){
      card_switch_right();
      tracker.push(tracker.shift())

    }


    //console.log(tracker)
  }
}




let left_btn = document.getElementById('left-btn');
let right_btn = document.getElementById('right-btn');

left_btn.addEventListener('click', indicator);
right_btn.addEventListener('click', indicator);


document.addEventListener( 'mousemove', onDocumentMouseMove, false );
function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

document.addEventListener( 'click', onDocumentMouseClick, false );
function onDocumentMouseClick(e){
  if(e.button == 0 &&
    INTERSECTED != null &&
    counter==0 &&
    INTERSECTED.geometry.type == "BoxGeometry" &&
    INTERSECTED.name == tracker[0]
  ){
    cardContent(INTERSECTED.name);
    let exit_btn = document.getElementById('card_exit');
    exit_btn.addEventListener('click',closeContent);
  }
}


function init(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf0f0f0 );
  scene.add( new THREE.AmbientLight( 0xffffff, 0.3 ) );

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight ,
    0.1,
    5000,
  );

  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const light = new THREE.DirectionalLight( 0xffffff, 0.35 );
  light.position.set( 0, 1000, 0 ).normalize();
  scene.add( light );



  const plane_geometry = new THREE.PlaneBufferGeometry(4000,4000,8,8);
  const plane_material = new THREE.MeshStandardMaterial({color: 0xD3D3D3, side: THREE.DoubleSide});
  const plane = new THREE.Mesh(plane_geometry, plane_material);
  plane.rotation.x = Math.PI / 2
  scene.add(plane)

  const geometry = new THREE.BoxGeometry(300,500,1);
  //const material = new THREE.MeshStandardMaterial({color: 0x0000ff});

  let card_quantity = 5
  let radians = 1.6;
  for(let i=0; i<card_quantity; i++){
    tracker.push(i+1);
    var object = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x0000ff  }));

    var xSub = 800;
    var ySub = 0;

    var xSub2 = xSub * Math.cos(radians) - Math.sin(radians) * ySub
    var ySub2 = xSub * Math.sin(radians) + Math.cos(radians) * ySub

    object.position.x = xSub2;
    object.position.y = 300;
    object.position.z = ySub2;
    object.name = i+1;
    object.rotation.z += 10;
    scene.add(object);
    radians += 2*Math.PI / card_quantity
  }




  camera.position.z = 1400
  camera.position.y += 400
}



function card_switch_left(){
  counter +=1;
  if(counter <= 72){
    requestAnimationFrame(card_switch_left)
    var radians = 2 * Math.PI / 360
    for(let i=3; i<scene.children.length; i++){
      var xSub = scene.children[i].position.x;
      var ySub = scene.children[i].position.z;

      var xSub2 = xSub * Math.cos(radians) - Math.sin(radians) * ySub
      var ySub2 = xSub * Math.sin(radians) + Math.cos(radians) * ySub

      scene.children[i].position.x = xSub2;
      scene.children[i].position.z = ySub2;
    }
  }else{
    switchContent(tracker[0]);
    counter = 0;
    return 0;
  }
}

function card_switch_right(){
  counter +=1;
  if(counter <= 72){
    requestAnimationFrame(card_switch_right)
    var radians = -2 * Math.PI / 360

    for(let i=3; i<scene.children.length; i++){
      var xSub = scene.children[i].position.x;
      var ySub = scene.children[i].position.z;

      var xSub2 = xSub * Math.cos(radians) - Math.sin(radians) * ySub
      var ySub2 = xSub * Math.sin(radians) + Math.cos(radians) * ySub

      scene.children[i].position.x = xSub2;
      scene.children[i].position.z = ySub2;
    }
  }else{
    switchContent(tracker[0]);
    counter = 0;
    return 0;
  }
}

function card_rotation(object){
  var radians = 2 * Math.PI / 360

  var xSub = object.position.x;
  var ySub = object.position.z;

  var xSub2 = xSub * Math.cos(radians) - Math.sin(radians) * ySub
  var ySub2 = xSub * Math.sin(radians) + Math.cos(radians) * ySub

  object.position.x = xSub2;
  object.position.y = 300;
  object.position.z = ySub2;

}

function render(){
  renderer.render(scene, camera);
  renderer.setClearColor (0xFFFFFF, 1);

  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );
  if (intersects.length > 0) {
    var targetDistance = intersects[0].distance;
    if (INTERSECTED != intersects[0].object){
      //console.log(INTERSECTED)
      if (INTERSECTED){ INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex); }
      INTERSECTED = intersects[0].object;

      if(INTERSECTED.geometry.type == "BoxGeometry"){
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex( 0xff0000 );

      }


    }
  }else{
    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    INTERSECTED = null;
  }


  for(let i=3; i<scene.children.length; i++){
    scene.children[i].rotation.y -= 0.05;
    //card_rotation(scene.children[i]);
  }

}

function animate(){

  requestAnimationFrame( animate, renderer.domElement );
  render();



  //camera.rotation.x +=0.001

}

init();
animate();

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

}
window.addEventListener('resize', onWindowResize, false);
