import Space from "./Space.js";

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
spc.addParticles(spc.addGroup(3), 100, 0, .5);
// spc.addParticles(spc.addGroup(3), 100, 0, -.5);
// spc.addParticles(spc.addGroup(3), 100, .5, 0);
// spc.addParticles(spc.addGroup(3), 100, -.5, 0);

function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
  spc.update(c);
  let test = spc.groups.get(0);
}

animate()