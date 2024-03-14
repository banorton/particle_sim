import { distance, getRand, randInt, randIntPad, print, elasticCollision, vector } from "./utils.js";
import Circle from "./Circle.js";
import Victor from 'victor';

export default class Space {
    constructor(dt=.5) {
        this.groups = new Map();
        this.particles = new Map();
        this.dt = dt;
        this.defaultV = 5;
        this.damp = .9;
        this.collisionDamp = .95;
        this.colors = ['#0b0ec1', '#3c3ecd', '#6d6eda', '#9d9fe6', '#cecff3'];
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
            particle.p.x = randIntPad(innerWidth, particle.radius);
            particle.p.y = randIntPad(innerHeight, particle.radius);
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

    resolveCollision(particle1, particle2) {
        let m1 = particle1.mass;
        let m2 = particle2.mass;
        let v1 = particle1.v;
        let v2 = particle2.v;
        let p1 = particle1.p;
        let p2 = particle2.p;
        const dp = p2.clone().subtract(p1);
        const dv = v2.clone().subtract(v1);

        if (!dp.x * dv.x + dp.y * dv.y >= 0) {
            return;
        }

        const angle = dp.angle();
        v1.rotate(-angle);
        v2.rotate(-angle);
        [v1.x, v2.x] = elasticCollision(m1, m2, v1.x, v2.x);
        v1.x *= this.collisionDamp;
        v2.x *= this.collisionDamp;
        v1.rotate(angle);
        v2.rotate(angle);
    }

    update(c) {
        for (const particle of this.particles.values()) {

            // Deal with particle collisions.
            const collisions = this.getCollisions(particle, this.particles);
            for (const particle2 of collisions) {
                this.resolveCollision(particle, particle2);
            }

            // Draw a circle for each particle in the space.
            const circ = new Circle(particle.p.x, particle.p.y, particle.radius, particle.color);
            circ.draw(c);

            // Update the positions and velocities of each particle.
            particle.p.x += particle.v.x * this.dt;
            particle.p.y += particle.v.y * this.dt;
            particle.v.x += particle.a.x * this.dt;
            particle.v.y += particle.a.y * this.dt;

            // Deal with collisions with the borders.
            if (particle.p.x > innerWidth - particle.radius || particle.p.x < 0 + particle.radius) {
                particle.p.x = Math.max(particle.radius, Math.min(innerWidth - particle.radius, particle.p.x));
                particle.v.x *= -this.damp;
            }
            if (particle.p.y > innerHeight - particle.radius || particle.p.y < 0 + particle.radius) {
                particle.p.y = Math.max(particle.radius, Math.min(innerHeight - particle.radius, particle.p.y));
                particle.v.y *= -this.damp;
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
        this.p = new Victor(x, y);
        this.v = new Victor(vx, vy);
        this.a = new Victor(ax, ay);
    }
}
