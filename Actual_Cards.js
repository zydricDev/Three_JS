import * as THREE from 'three';
import {cardContent, switchContent, closeContent} from './Actual_Cards_Content.js'


var camera, scene, raycaster, renderer;
var mouse = new THREE.Vector2(), INTERSECTED;
var counter = 0;
var tracker = [];
var card_light = [];

function indicator(e){
  if(e){
    if(e.path[0].id == 'left-btn' && counter == 0){
      card_switch_left();
      tracker.unshift(tracker.pop());
    }else if (counter == 0){
      card_switch_right();
      tracker.push(tracker.shift())
    }
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
  scene.background = new THREE.Color( 0x00000 );
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

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  document.body.appendChild( renderer.domElement );


  const plane_geometry = new THREE.PlaneBufferGeometry(4000,4000,8,8);
  const plane_material = new THREE.MeshPhongMaterial({color: 0xD3D3D3, side: THREE.DoubleSide});
  const plane = new THREE.Mesh(plane_geometry, plane_material);
  plane.receiveShadow = true;


  plane.rotation.x = Math.PI / 2
  scene.add(plane)
  const light = new THREE.SpotLight( 0xffffff, 1, 1500, 50);

  const geometry = new THREE.BoxGeometry(300,500,1);

  let card_quantity = 5
  let radians = 1.6;
  for(let i=0; i<card_quantity; i++){
    tracker.push(i+1);
    var object = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x0000ff  }));
    object.receiveShadow = true;
    object.castShadow = true;
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

    card_light.push(new THREE.SpotLight( 0xffffff, 1, 1500, 50))
    card_light[i].target = object
    card_light[i].rotation.set(4,4,4)

    card_light[i].position.set( object.position.x, object.position.y + 500, object.position.z+1);
    card_light[i].castShadow = true;




    scene.add( card_light[i] );


  }

  camera.position.z = 1400
  camera.position.y += 400
}



function card_switch_left(){
  counter +=1;
  if(counter <= 72){
    requestAnimationFrame(card_switch_left)
    var radians = 2 * Math.PI / 360
    for(let i=0; i<scene.children.length; i++){
      if(scene.children[i].name || scene.children[i].type == "SpotLight"){

        var xSub = scene.children[i].position.x;
        var ySub = scene.children[i].position.z;

        var xSub2 = xSub * Math.cos(radians) - Math.sin(radians) * ySub
        var ySub2 = xSub * Math.sin(radians) + Math.cos(radians) * ySub

        scene.children[i].position.x = xSub2;
        scene.children[i].position.z = ySub2;
      }

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

    for(let i=0; i<scene.children.length; i++){
      if(scene.children[i].name || scene.children[i].type == "SpotLight"){
        var xSub = scene.children[i].position.x;
        var ySub = scene.children[i].position.z;

        var xSub2 = xSub * Math.cos(radians) - Math.sin(radians) * ySub
        var ySub2 = xSub * Math.sin(radians) + Math.cos(radians) * ySub

        scene.children[i].position.x = xSub2;
        scene.children[i].position.z = ySub2;
      }

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

      if (INTERSECTED && INTERSECTED.material.emissive){ INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex); }
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


  for(let i=0; i<scene.children.length; i++){
    if(scene.children[i].name){
      scene.children[i].rotation.y -= 0.05;
    }


  }

}

function animate(){

  requestAnimationFrame( animate, renderer.domElement );
  render();
  console.log(scene.children)




}

init();
animate();

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

}
window.addEventListener('resize', onWindowResize, false);
