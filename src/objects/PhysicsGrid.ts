import * as THREE from "three";
import * as CANNON from "cannon";

export class PhysicsGrid {
	dist = 0.3;
	mass = 1000.1;
	size = 20;

	particleMaterial: THREE.Material;
	particleGeometry: THREE.SphereGeometry;

	shape: CANNON.Particle;

	particles: { [key: `${number},${number}`]: CANNON.Body } = {};
	cornerParticles: { [key: `${number},${number}`]: CANNON.Body } = {};

	meshArr: THREE.Mesh[] = [];
	bodiesArr: CANNON.Body[] = [];

	minBound = -(this.size * this.dist) / 2;
	maxBound = (this.size * this.dist) / 2;
	constructor(public world: CANNON.World, public scene: THREE.Scene) {
		this.particleGeometry = new THREE.SphereGeometry(0.1);
		this.particleMaterial = new THREE.MeshBasicMaterial({ color: 0xaaffff });

		this.shape = new CANNON.Particle();
		const material = new CANNON.Material("particleMaterial");
		material.friction = 0.1;
		material.restitution = 0.9;

		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				const body = new CANNON.Body({
					mass: this.mass,
					shape: this.shape,
					material,
					position: new CANNON.Vec3(
						i * this.dist - (this.size * this.dist) / 2,
						j * this.dist - (this.size * this.dist) / 2,
						0
					),
				});
				body.velocity = new CANNON.Vec3(
					Math.random() * 0.001,
					Math.random() * 0.001,
					0
				);
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

		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				if (i < this.size - 1) {
					this.connect(i, j, i + 1, j);
				}
				if (j < this.size - 1) {
					this.connect(i, j, i, j + 1);
				}
			}
		}
	}

	connect(i: number, j: number, toI: number, toJ: number) {
		const distanceConstraint = new CANNON.DistanceConstraint(
			this.particles[`${i},${j}`],
			this.particles[`${toI},${toJ}`],
			this.dist
			// 1
		);
		this.world.addConstraint(distanceConstraint);
	}

	update() {
		for (let i = 0; i < this.meshArr.length; ++i) {
			const { minBound, maxBound } = this;
			if (
				(this.bodiesArr[i].position.x < minBound &&
					this.bodiesArr[i].velocity.x < 0) ||
				(this.bodiesArr[i].position.x > maxBound &&
					this.bodiesArr[i].velocity.x > 0)
			) {
				this.bodiesArr[i].velocity.x *= -1;
			}

			if (
				(this.bodiesArr[i].position.y < minBound &&
					this.bodiesArr[i].velocity.y < 0) ||
				(this.bodiesArr[i].position.y > maxBound &&
					this.bodiesArr[i].velocity.y > 0)
			) {
				this.bodiesArr[i].velocity.y *= -1;
			}

			this.meshArr[i].position.copy(
				new THREE.Vector3(
					this.bodiesArr[i].position.x,
					this.bodiesArr[i].position.y,
					this.bodiesArr[i].position.z
				)
			);
		}

		// this.particles["0,0"].position.set(
		// 	-(this.size * this.dist) / 2,
		// 	-(this.size * this.dist) / 2,
		// 	0
		// );
		// this.particles[`${this.size - 1},0`].position.set(
		// 	(this.size * this.dist) / 2,
		// 	-(this.size * this.dist) / 2,
		// 	0
		// );
		// this.particles[`0,${this.size - 1}`].position.set(
		// 	-(this.size * this.dist) / 2,
		// 	(this.size * this.dist) / 2,
		// 	0
		// );
		// this.particles[`${this.size - 1},${this.size - 1}`].position.set(
		// 	(this.size * this.dist) / 2,
		// 	(this.size * this.dist) / 2,
		// 	0
		// );
	}
}
