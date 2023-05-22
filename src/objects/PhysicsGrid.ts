import * as THREE from "three";
import * as CANNON from "cannon";

export class PhysicsGrid {
	dist = 0.5;
	mass = 0.5;
	size = 15;
	N = 10;

	particleMaterial: THREE.Material;
	particleGeometry: THREE.SphereGeometry;

	shape: CANNON.Particle;

	particles: { [key: string]: CANNON.Body } = {};

	meshArr: THREE.Mesh[] = [];
	bodiesArr: CANNON.Body[] = [];
	constructor(world: CANNON.World, scene: THREE.Scene) {
		this.particleGeometry = new THREE.SphereGeometry(0.1);
		this.particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

		this.shape = new CANNON.Particle();

		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				const body = new CANNON.Body({
					mass: this.mass,
					shape: this.shape,
					position: new CANNON.Vec3(
						i * this.dist - (this.size * this.dist) / 2,
						j * this.dist - (this.size * this.dist) / 2,
						0
					),
				});
				this.particles[`${i},${j}`] = body;
				world.addBody(body);

				this.bodiesArr.push(body);

				const mesh = new THREE.Mesh(
					this.particleGeometry,
					this.particleMaterial
				);
				scene.add(mesh);
				this.meshArr.push(mesh);
			}
		}
	}

	update() {
		for (let i = 0; i < this.meshArr.length; ++i) {
			this.meshArr[i].position.copy(
				new THREE.Vector3(
					this.bodiesArr[i].position.x,
					this.bodiesArr[i].position.y,
					this.bodiesArr[i].position.z
				)
			);
		}
	}
}
