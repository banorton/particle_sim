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
    let answer = Math.sqrt((particle1.x - particle2.x)**2 + (particle1.y - particle2.y)**2);
    return answer;
}