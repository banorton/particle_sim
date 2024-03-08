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