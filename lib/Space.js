import { distance, getRand, randInt, randIntPad } from "./utils.js";
import Circle from "./Circle.js";

export default class Space {
    constructor(dt=1) {
        this.groups = new Map();
        this.particles = new Map();
        this.dt = dt;
        this.defaultV = 3;
        this.damp = .7;
        this.colors = ['#90b89b', '#abd2b6', '#c9e7d2', '#dcf0e2', '#e6f6eb'];
        this.idGen = 0;
    }

    addGroup(radius=10, color='#e6f6eb', mass=1) {
        const group = new Group(this, this.generateID(), radius, color, mass);
        this.groups.set(group.id, group);
        return group.id;
    }

    addParticle(groupId, x=null, y=null, vx=null, vy=null, ax=0, ay=0) {
        const group = this.groups.get(groupId);
        if (!group) throw new Error(`Group with id '${groupId}' not found.`);
        
        // Generate random particle position such that it is within the canvas and not overlapping the canvas.
        x = x ?? randIntPad(innerWidth, group.radius);
        y = y ?? randIntPad(innerHeight, group.radius);

        // Generate random particle velocity if one is not input.
        vx = vx ?? randInt(2 * this.defaultV) - this.defaultV;
        vy = vy ?? randInt(2 * this.defaultV) - this.defaultV;

        // Create particle.
        const particle = new Particle(this, group, this.generateID(), group.radius, getRand(this.colors), group.mass, x, y, vx, vy, ax, ay);

        // Make sure particle does not overlap with any other particles.
        while (this.getCollisions(particle, this.particles).length > 0) {
            particle.x = randIntPad(innerWidth, particle.radius);
            particle.y = randIntPad(innerHeight, particle.radius);
        }

        this.particles.set(particle.id, particle);
        return particle.id;
    }

    addRelation(groupId1, groupId2, func) {
        const group1 = this.groups.get(groupId1);
        const group2 = this.groups.get(groupId2);
        if (!group1) throw new Error(`Could not find group with id '${groupId1}'.`);
        if (!group2) throw new Error(`Could not find group with id '${groupId2}'.`);
        group1.addRelation(group2, func);
    }

    addParticles(groupId, num, ax=0, ay=.8) {
        for (let i = 0; i < num; i++) {
            const vx = randInt(2 * this.defaultV) - this.defaultV;
            const vy = randInt(2 * this.defaultV) - this.defaultV;
            this.addParticle(groupId, null, null, vx, vy, ax, ay);
        }
    }

    generateID() {
        return this.idGen++;
    }

    getCollisions(particle1, particles) {
        const collisions = [];
        for (const particle2 of particles.values()) {
            if (particle1.id == particle2.id) continue;
            const dist = distance(particle1, particle2);
            if (distance(particle1, particle2) < particle1.radius + particle2.radius) collisions.push(particle2);
        }
        return collisions;
    }

    calcCollision(particle1, particle2) {
        const m1 = particle1.mass;
        const m2 = particle2.mass;
        const v1 = { x: particle1.vx, y: particle1.vy };
        const v2 = { x: particle2.vx, y: particle2.vy };

        // Calculate center of mass velocity
        const cmVelocity = {
            x: (m1 * v1.x + m2 * v2.x) / (m1 + m2),
            y: (m1 * v1.y + m2 * v2.y) / (m1 + m2)
        };

        // Calculate relative velocity
        const relVelocity = {
            x: v2.x - v1.x,
            y: v2.y - v1.y
        };

        // Calculate normal vector
        const normalVector = {
            x: particle2.x - particle1.x,
            y: particle2.y - particle1.y
        };
        const norm = Math.sqrt(normalVector.x * normalVector.x + normalVector.y * normalVector.y);
        const unitNormal = { x: normalVector.x / norm, y: normalVector.y / norm };

        // Calculate final velocities
        const v1Final = {
            x: cmVelocity.x + relVelocity.x * (m2 / (m1 + m2)),
            y: cmVelocity.y + relVelocity.y * (m2 / (m1 + m2))
        };
        const v2Final = {
            x: cmVelocity.x - relVelocity.x * (m1 / (m1 + m2)),
            y: cmVelocity.y - relVelocity.y * (m1 / (m1 + m2))
        };

        // Assign final velocities to particles
        particle1.vx = v1Final.x;
        particle1.vy = v1Final.y;
        particle2.vx = v2Final.x;
        particle2.vy = v2Final.y;
        // const alpha = particle2.mass / particle1.mass;
        // const v1fx = (((1 - alpha)/(1 + alpha)) * particle1.vx) + (((2 * alpha) / (1 + alpha)) * particle2.vx);
        // const v1fy = (((1 - alpha)/(1 + alpha)) * particle1.vy) + (((2 * alpha) / (1 + alpha)) * particle2.vy);
        // const v2fx = v1fx + (particle1.vx - particle2.vx);
        // const v2fy = v1fy + (particle1.vy - particle2.vy);
        // particle1.vx = v1fx;
        // particle1.vy = v1fy;
        // particle2.vx = v2fx;
        // particle2.vy = v2fy;
    }

    update(c) {
        for (const particle of this.particles.values()) {

            // Deal with particle collisions.
            const collisions = this.getCollisions(particle, this.particles);
            for (const particle2 of collisions) {
                console.log("collision detected")
                this.calcCollision(particle, particle2);
            }

            // Draw a circle for each particle in the space.
            const circ = new Circle(particle.x, particle.y, particle.radius, particle.color);
            circ.draw(c);

            // Update the positions and velocities of each particle.
            particle.x += particle.vx * this.dt;
            particle.y += particle.vy * this.dt;
            particle.vx += particle.ax * this.dt;
            particle.vy += particle.ay * this.dt;

            // Deal with collisions with the borders.
            if (particle.x > innerWidth - particle.radius || particle.x < 0 + particle.radius) {
                particle.x = Math.max(particle.radius, Math.min(innerWidth - particle.radius, particle.x));
                particle.vx *= -this.damp;
            }
            if (particle.y > innerHeight - particle.radius || particle.y < 0 + particle.radius) {
                particle.y = Math.max(particle.radius, Math.min(innerHeight - particle.radius, particle.y));
                particle.vy *= -this.damp;
            }

        }

    }
}

class Group {
    constructor(space, id, radius, color, mass) {
        this.space = space;
        this.id = id;
        this.radius = radius;
        this.color = color;
        this.mass = mass;
    }

    addRelation(group, func) {
        const relation = { actor: this.id, responder: group.id, function: func };
        this.space.idGen++;
        // Not sure what you want to do with this relation, so leaving as is
    }
}

class Particle {
    constructor(space, group, id, radius, color, mass, x, y, vx, vy, ax, ay) {
        this.space = space;
        this.group = group;
        this.id = id;
        this.radius = radius;
        this.color = color;
        this.mass = mass;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;
    }
}
