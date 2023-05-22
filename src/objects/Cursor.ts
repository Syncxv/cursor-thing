import * as THREE from "three";
import * as CANNON from "cannon";

export class Cursor {
	sphereBody: CANNON.Body;

	sphereGeometry: THREE.SphereGeometry;
	sphereMaterial: THREE.Material;

	sphereMesh: THREE.Mesh;

	constructor(world: CANNON.World, scene: THREE.Scene) {
		this.sphereBody = new CANNON.Body({
			mass: 0,
			shape: new CANNON.Sphere(0.3),
			position: new CANNON.Vec3(0, 0, 0),
		});
		world.addBody(this.sphereBody);
		// this.bodiesArr.push(sphereBody);

		this.sphereGeometry = new THREE.SphereGeometry(0.3);
		this.sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
		this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
		scene.add(this.sphereMesh);
		// this.meshArr.push(sphereMesh);
	}

	update(mouse: THREE.Vector2) {
		this.sphereMesh.position.copy(new THREE.Vector3(mouse.x, mouse.y, 0));
		this.sphereBody.position.copy(new CANNON.Vec3(mouse.x, mouse.y, 0));
	}
}
