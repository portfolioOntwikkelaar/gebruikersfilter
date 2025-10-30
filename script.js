const result = document.getElementById('result');
const filter = document.getElementById('filter');
const clearBtn = document.getElementById('clearBtn');
let listItems = [];

// Background particle animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
createParticles(80);
animateParticles();

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles(num) {
  particles = [];
  for (let i = 0; i < num; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      color: `rgba(0,255,255,${Math.random()})`
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
  requestAnimationFrame(animateParticles);
}

// App logic
getData();

filter.addEventListener('input', e => {
  filterData(e.target.value);
  clearBtn.style.display = e.target.value ? 'block' : 'none';
});
clearBtn.addEventListener('click', () => {
  filter.value = '';
  clearBtn.style.display = 'none';
  filterData('');
});

async function getData() {
  try {
    const res = await fetch('https://randomuser.me/api?results=250');
    const { results } = await res.json();

    result.innerHTML = '';
    listItems = [];

    results.forEach((user, i) => {
      const li = document.createElement('li');
      li.style.animationDelay = `${i * 0.02}s`;
      li.innerHTML = `
        <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}">
        <div class="user-info">
          <h4>${user.name.first} ${user.name.last}</h4>
          <p>${user.location.city}, ${user.location.country}</p>
        </div>
      `;
      listItems.push(li);
      result.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    result.innerHTML = `<li><h3>⚠️ Kon geen data laden</h3></li>`;
  }
}

function filterData(searchTerm) {
  const term = searchTerm.toLowerCase();
  listItems.forEach(item => {
    const isVisible = item.innerText.toLowerCase().includes(term);
    item.classList.toggle('hide', !isVisible);
  });
}
