import * as THREE from 'three';

let scene, camera, renderer

let pivotSet = [], meshSet= [];

const card_quantity = 5;

function init(){

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight ,
    0.1,
    5000,
  );
  renderer = new THREE.WebGLRenderer({antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  const geometry = new THREE.BoxGeometry(1,300,300);

  //const material = new THREE.MeshStandardMaterial({color: 0x0000ff});

  const texture = new THREE.TextureLoader().load("test.svg");
  const material = new THREE.MeshStandardMaterial({map: texture });


  for(let i=0; i<card_quantity; i++){
    meshSet.push(new THREE.Mesh(geometry, material));
    meshSet[i].position.set(500,0,0);
    scene.add(meshSet[i])
  }
  let angle = 0;
  for(let i=0; i<meshSet.length; i++){
    pivotSet.push(new THREE.Group());
    pivotSet[i].position.set(0,0,0);

    scene.add(pivotSet[i]);

    pivotSet[i].add(meshSet[i]);

    pivotSet[i].rotation.y = angle;
    angle += 2 * Math.PI / meshSet.length
  }
  //camera.rotation.y += 0.5
  //camera.rotation.x -= 0.2
  //camera.position.y += 300
  //camera.position.x += 300

  const plane_shape = new THREE.PlaneBufferGeometry(4000,4000,8,8);
  const plane_mat = new THREE.MeshStandardMaterial({color: 0xD3D3D3, side: THREE.DoubleSide});
  const plane = new THREE.Mesh(plane_shape, plane_mat);
  plane.rotation.x = Math.PI / 2
  plane.position.y -= 200
  scene.add(plane)
  camera.rotation.x -= 0.5
  camera.position.y += 400

  const ambientLight = new THREE.AmbientLight ( 0xffffff, 0.2);
  scene.add( ambientLight );

  const pointLight = new THREE.PointLight( 0xffffff, 1 );
  pointLight.position.set( 0, 1000, 0 );
  scene.add( pointLight );


}



let dive = 1000;

function onMouseWheel(e){
  var amount = e.deltaY;
  if(amount ===0) return;
  var dir = amount / Math.abs(amount)
  dive += amount / 10;
}
window.addEventListener( 'wheel', onMouseWheel, false );

let active = false;
let tracker = 0;
function fun(){
  if(active == true){
    requestAnimationFrame(fun)
    tracker += 1;
    for(let i=0; i<meshSet.length; i++){
      pivotSet[i].rotation.y += 2 * Math.PI / card_quantity / 100
    }
    if(tracker >= 100){
      tracker = 0;
      active = false
      return 0;
    }
    console.log(tracker)
  }


}

function onMouseClick(e){
  if(e.button == 0 && tracker < 100 && active == false){
    active = true;
    fun();
  }
}
window.addEventListener( 'click', onMouseClick, false);

function animate(){

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  renderer.setClearColor (0xFFFFFF, 1);
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
