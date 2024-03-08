import { getRand, randInt, randIntPad } from "./utils.js";
import Circle from "./Circle.js";

export default class Space {
    constructor(dt=1) {
        this.idGen = 0;
        this.dt = dt;
        this.defaultV = 5;
        this.groups = new Map();
        this.colors = ['#92ddc8', '#81b69d', '#5aa17f', '#137a63', '#0a3a2a'];
    }

    addGroup(size=10, color='#2185C5', mass=1) {
        const group = new Group(this, this.idGen, size, color, mass);
        this.idGen++;
        this.groups.set(group.id, group);
        return group.id;
    }

    addParticle(groupId, x, y, vx = randInt(2 * this.defaultV) - this.defaultV, vy = randInt(2 * this.defaultV) - this.defaultV, ax = 0, ay = 0) {
        const group = this.groups.get(groupId);
        if (!group) {
            throw new Error(`Group with id '${groupId}' not found.`);
        };
        x == null ? x = randIntPad(innerWidth, group.size) : x;
        y == null ? y = randIntPad(innerHeight, group.size) : y;
        return group.addParticle(x, y, vx, vy, ax, ay);
    }

    addRelation(groupId1, groupId2, func) {
        const group1 = this.groups.get(groupId1);
        const group2 = this.groups.get(groupId2);
        if (!group1) {
            throw new Error(`Could not find group with id '${groupId1}'.`);
        } else if (!group2) {
            throw new Error(`Could not find group with id '${groupId2}'.`);
        }
        group1.addRelation(group2, func);
    }

    addParticles(groupId, num) {
        for (let i = 0; i < num; i++) {
            this.addParticle(groupId);
        }
    }

    update(c) {
        for (const [groupId, group] of this.groups) {
            for (const [particleId, p] of group.particles) {
                const circ = new Circle(p.x, p.y, p.size, p.color);
                circ.draw(c);
                p.x += p.vx * this.dt;
                p.vx += p.ax * this.dt;
                p.y += p.vy * this.dt;
                p.vy += p.ay * this.dt;
                const damp = .8;
                if (p.x > innerWidth - p.size || p.x < 0 + p.size) {
                    p.vx *= -damp;
                }
                if (p.y > innerHeight - p.size || p.y < 0 + p.size) {
                    p.vy *= -damp;
                }
            }
        }
    }
}

class Group {
    constructor(space, id, size, color, mass) {
        this.space = space;
        this.id = id;
        this.size = size;
        this.color = color;
        this.mass = mass;
        this.idGen = 0;
        this.particles = new Map();
        this.relations = new Map();
    }

    addParticle(x, y, vx, vy, ax, ay) {
        // const particle = new Particle(this.space, this, this.idGen, this.size, this.color, this.mass, x, y, vx, vy, ax, ay);
        const particle = new Particle(this.space, this, this.idGen, this.size, getRand(this.space.colors), this.mass, x, y, vx, vy, ax, ay);
        this.idGen++;
        this.particles.set(particle.id, particle);
        return particle.id;
    }

    addRelation(group, func) {
        const relation = { actor: this.id, responder: group.id, function: func };
        this.idGen++;
        this.relations.set(relation.id, relation);
        return relation.id;
    }
}

class Particle {
    constructor(space, group, id, size, color, mass, x, y, vx, vy, ax, ay) {
        this.space = space;
        this.group = group;
        this.id = id;
        this.size = size;
        this.color = color;
        this.mass = mass;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = .4;
    }
}

class Relation {
    constructor(space, actor, responder, func) {
        this.space = space;
        this.actor = actor;
        this.responder = responder;
        this.func = func;
    }
}
