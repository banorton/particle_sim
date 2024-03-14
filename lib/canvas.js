import Space from "./Space.js";

console.clear();

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight
})

// OBJECTS AND ANIMATION
const spc = new Space();
spc.addParticles(spc.addGroup(3), 1000, 0, .6);
// const grpid = spc.addGroup(100);
// spc.addParticle(grpid, 200, 300, 1, 0);
// spc.addParticle(grpid, 500, 300, -1, 0);

function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
  spc.update(c);
}

animate()