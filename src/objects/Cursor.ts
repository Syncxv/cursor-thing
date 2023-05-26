import * as THREE from "three";
import * as CANNON from "cannon";
import { getHeight, getWidth } from "../main";

export class Cursor {
	sphereBody: CANNON.Body;

	sphereGeometry: THREE.SphereGeometry;
	sphereMaterial: THREE.Material;

	sphereMesh: THREE.Mesh;

	size = 0.4;

	constructor(world: CANNON.World, scene: THREE.Scene) {
		this.sphereBody = new CANNON.Body({
			mass: 0,
			shape: new CANNON.Sphere(this.size),
			position: new CANNON.Vec3(getWidth(), getHeight(), -1),
		});
		world.addBody(this.sphereBody);
		// this.bodiesArr.push(sphereBody);

		this.sphereGeometry = new THREE.SphereGeometry(this.size);
		this.sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
		this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
		scene.add(this.sphereMesh);
		// this.meshArr.push(sphereMesh);
	}

	update(
		mousePosNormalized: THREE.Vector2,
		camera: THREE.Camera,
		raycaster: THREE.Raycaster
	) {
		// Update the picking ray with the camera and mouse position
		raycaster.setFromCamera(mousePosNormalized, camera);

		// Assume we're working on a plane at z = 0
		let planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
		let intersection = new THREE.Vector3();

		// cast a ray to find the point of intersection on the plane
		raycaster.ray.intersectPlane(planeZ, intersection);

		// Update sphereMesh and sphereBody positions
		this.sphereMesh.position.copy(intersection);
		this.sphereBody.position.copy(
			new CANNON.Vec3(intersection.x, intersection.y, intersection.z)
		);

		// this.sphereMesh.position.copy(new THREE.Vector3(mouse.x, mouse.y, 0));
		// this.sphereBody.position.copy(new CANNON.Vec3(mouse.x, mouse.y, 0));
	}
}
