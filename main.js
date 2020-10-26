import * as THREE from 'three';

let scene, camera, renderer, cube, cube2;


function init(){

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight ,
    0.1,
    1000,
  );


  renderer = new THREE.WebGLRenderer({antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(10,0,2);
  const geometry2 = new THREE.BoxGeometry(1,1,5);
  const material = new THREE.MeshStandardMaterial({color: 0x0000ff});
  cube = new THREE.Mesh(geometry, material);
  cube2 = new THREE.Mesh(geometry2,material);
  scene.add(cube);
  scene.add(cube2);

  camera.position.z = 5;

  const ambientLight = new THREE.AmbientLight ( 0xffffff, 0.2);
  scene.add( ambientLight );

  const pointLight = new THREE.PointLight( 0xffffff, 1 );
  pointLight.position.set( 25, 50, 25 );
  scene.add( pointLight );


}

let mouse = [0.5,0.5]
function onMouseMove(e){
  mouse[0] = e.clientX / window.innerWidth;
  mouse[1] = e.clientY / window.innerHeight;
  console.log(mouse[0])
}

window.addEventListener('mousemove', onMouseMove, false);

let dive = 10;

function onMouseWheel(e){
  var amount = e.deltaY;
  if(amount ===0) return;
  var dir = amount / Math.abs(amount)
  dive += amount / 1000;
}
window.addEventListener( 'wheel', onMouseWheel, false );


function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  camera.position.x = Math.sin( .5 * Math.PI * ( mouse[ 0 ] - .5 ) )
  camera.position.y = Math.sin( .25 * Math.PI * ( mouse[ 1 ] - .5 ) )
  camera.position.z = dive;

}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

}
window.addEventListener('resize', onWindowResize, false);

init();
animate();
