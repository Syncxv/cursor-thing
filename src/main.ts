import "./scss/_main.scss";
import * as THREE from "three";
import * as CANNON from "cannon";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PhysicsGrid } from "./objects/PhysicsGrid";
import { Cursor } from "./objects/Cursor";
const container = document.querySelector<HTMLElement>(".three-container");

if (!container) {
	throw new Error("No container found");
}

export const getHeight = () => container.getBoundingClientRect().height;
export const getWidth = () => container.getBoundingClientRect().width;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	getWidth() / getHeight(),
	0.1,
	1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(getWidth(), getHeight());
container.appendChild(renderer.domElement);

const world = new CANNON.World();

const controls = new OrbitControls(camera, renderer.domElement);

const onResize = () => {
	camera.aspect = getWidth() / getHeight();
	camera.updateProjectionMatrix();
	renderer.setSize(getWidth(), getHeight());
};

const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (e) => {
	mouse.x = (e.clientX / getWidth()) * 2 - 1;
	mouse.y = -(e.clientY / getHeight()) * 2 + 1;
});

const raycaster = new THREE.Raycaster();

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const obj = new PhysicsGrid(world, scene);
const cursor = new Cursor(world, scene);
// obj.bodiesArr.push(cursor.sphereBody);
// obj.meshArr.push(cursor.sphereMesh);

const animate = () => {
	requestAnimationFrame(animate);
	world.step(1 / 60);
	obj.update();
	cursor.update(mouse, camera, raycaster);
	controls.update();
	renderer.render(scene, camera);
};

animate();

window.addEventListener("resize", onResize);
