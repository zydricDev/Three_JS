import * as THREE from 'three';
import { CinematicCamera } from './node_modules/three/examples/jsm/cameras/CinematicCamera.js';

import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';
import { GUI } from './node_modules/three/examples/jsm/libs/dat.gui.module.js';


var camera, scene, raycaster, renderer, stats;

var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;

init();
animate();

function init() {

  camera = new CinematicCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.setLens( 5 );
  camera.position.set( 2, 1, 500 );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf0f0f0 );
  scene.add( new THREE.AmbientLight( 0xffffff, 0.3 ) );

  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var light = new THREE.DirectionalLight( 0xffffff, 0.35 );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );



  var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );

  for ( var i = 0; i < 2000; i ++ ) {

    var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

    object.position.x = Math.random() * 800 - 400;
    object.position.y = Math.random() * 800 - 400;
    object.position.z = Math.random() * 800 - 400;

    scene.add( object );

  }

  stats = new Stats();
  document.body.appendChild( stats.dom );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  window.addEventListener( 'resize', onWindowResize, false );

  var effectController = {

    focalLength: 15,
    // jsDepthCalculation: true,
    // shaderFocus: false,
    //
    fstop: 2.8,
    // maxblur: 1.0,
    //
    showFocus: false,
    focalDepth: 3,
    // manualdof: false,
    // vignetting: false,
    // depthblur: false,
    //
    // threshold: 0.5,
    // gain: 2.0,
    // bias: 0.5,
    // fringe: 0.7,
    //
    // focalLength: 35,
    // noise: true,
    // pentagon: false,
    //
    // dithering: 0.0001

  };

  var matChanger = function ( ) {

    for ( var e in effectController ) {
      if ( e in camera.postprocessing.bokeh_uniforms ) {
        camera.postprocessing.bokeh_uniforms[ e ].value = effectController[ e ];
      }

    }

    camera.postprocessing.bokeh_uniforms[ 'znear' ].value = camera.near;
    camera.postprocessing.bokeh_uniforms[ 'zfar' ].value = camera.far;
    camera.setLens( effectController.focalLength, camera.frameHeight, effectController.fstop, camera.coc );
    effectController[ 'focalDepth' ] = camera.postprocessing.bokeh_uniforms[ 'focalDepth' ].value;

  };

  //

  var gui = new GUI();

  //GUI OPTIONS ON THE TOP RIGHT
  gui.add( effectController, 'focalLength', 1, 135, 0.01 ).onChange( matChanger );
  gui.add( effectController, 'fstop', 1.8, 22, 0.01 ).onChange( matChanger );
  gui.add( effectController, 'focalDepth', 0.1, 100, 0.001 ).onChange( matChanger );
  gui.add( effectController, 'showFocus', true ).onChange( matChanger );

  matChanger();

  window.addEventListener( 'resize', onWindowResize, false );

  window.addEventListener( 'click', onDocumentMouseClick, false);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

let timer = 0
let memory = null;
function quickspin(){
  if(timer >= 100){ timer = 0; }
  else{
    requestAnimationFrame(quickspin)
    memory.rotation.y += 0.1
    timer += 1;
  }

}

function onDocumentMouseClick(e){
  if(e.button == 0 && INTERSECTED != null && timer==0){
    console.log(INTERSECTED)
    memory = INTERSECTED;
    quickspin();
  }
}

function animate() {

  requestAnimationFrame( animate, renderer.domElement );

  render();
  stats.update();
  /**for(let i=2; i<scene.children.length; i++){
    scene.children[i].rotation.x += 0.1
  }
  **/


}


function render() {

  theta += 0.1;

  camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
  camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
  camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
  camera.lookAt( scene.position );

  camera.updateMatrixWorld();

  // find intersections

  //take a parameter of 2d points : x,y  and camera
  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( scene.children );

  if ( intersects.length > 0 ) {
    /**for(let i=0; i<intersects.length;i++){
      intersects[i].object.rotation.y += 0.1;
    }**/
    var targetDistance = intersects[ 0 ].distance;

    camera.focusAt( targetDistance ); // using Cinematic camera focusAt method
    //console.log(INTERSECTED)
    if ( INTERSECTED != intersects[ 0 ].object ) {

      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );

    }

  } else {
    //if the mouse is pointing at space
    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    INTERSECTED = null;

  }

  //

  if ( camera.postprocessing.enabled ) {

    camera.renderCinematic( scene, renderer );

  } else {

    scene.overrideMaterial = null;

    renderer.clear();
    renderer.render( scene, camera );

  }

}
