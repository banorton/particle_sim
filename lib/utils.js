import Victor from 'victor';

export function getRand(arr) {
    let randidx = Math.floor(Math.random() * arr.length);
    return arr[randidx];
}

export function randInt(max) {
    return Math.floor(Math.random() * max);;
}

export function randIntPad(max, pad) {
    const r = (Math.random() * (max - (2 * pad))) + pad;
    return Math.floor(r);
}

export function distance(particle1, particle2) {
    let answer = Math.sqrt((particle1.p.x - particle2.p.x)**2 + (particle1.p.y - particle2.p.y)**2);
    return answer;
}

export function print(thing="") {
    console.log(thing);
}

export function elasticCollision(m1, m2, v1i, v2i) {
    const v1f = (((m1 - m2) / (m1 + m2)) * v1i) + (((2 * m2) / (m1 + m2)) * v2i);
    const v2f = v1f + (v1i - v2i);
    return [v1f, v2f];
}

export function vector(x, y) {
    if (!y) {
        return new Victor(x, x);
    }
    return new Victor(x, y);
}

// Storage
// APROACH 2
        // const m1 = particle1.mass;
        // const m2 = particle2.mass;
        // const v1 = { x: particle1.vx, y: particle1.vy };
        // const v2 = { x: particle2.vx, y: particle2.vy };

        // // Calculate center of mass velocity
        // const cmVelocity = {
        //     x: (m1 * v1.x + m2 * v2.x) / (m1 + m2),
        //     y: (m1 * v1.y + m2 * v2.y) / (m1 + m2)
        // };

        // // Calculate relative velocity
        // const relVelocity = {
        //     x: v2.x - v1.x,
        //     y: v2.y - v1.y
        // };

        // // Calculate normal vector
        // const normalVector = {
        //     x: particle2.x - particle1.x,
        //     y: particle2.y - particle1.y
        // };
        // const norm = Math.sqrt(normalVector.x * normalVector.x + normalVector.y * normalVector.y);
        // const unitNormal = { x: normalVector.x / norm, y: normalVector.y / norm };

        // // Calculate final velocities
        // const v1Final = {
        //     x: cmVelocity.x + relVelocity.x * (m2 / (m1 + m2)),
        //     y: cmVelocity.y + relVelocity.y * (m2 / (m1 + m2))
        // };
        // const v2Final = {
        //     x: cmVelocity.x - relVelocity.x * (m1 / (m1 + m2)),
        //     y: cmVelocity.y - relVelocity.y * (m1 / (m1 + m2))
        // };

        // // Assign final velocities to particles
        // particle1.vx = v1Final.x;
        // particle1.vy = v1Final.y;
        // particle2.vx = v2Final.x;
        // particle2.vy = v2Final.y;

        // APROACH 1
        // const alpha = particle2.mass / particle1.mass;
        // const v1fx = (((1 - alpha)/(1 + alpha)) * particle1.vx) + (((2 * alpha) / (1 + alpha)) * particle2.vx);
        // const v1fy = (((1 - alpha)/(1 + alpha)) * particle1.vy) + (((2 * alpha) / (1 + alpha)) * particle2.vy);
        // const v2fx = v1fx + (particle1.vx - particle2.vx);
        // const v2fy = v1fy + (particle1.vy - particle2.vy);
        // particle1.vx = v1fx;
        // particle1.vy = v1fy;
        // particle2.vx = v2fx;
        // particle2.vy = v2fy;