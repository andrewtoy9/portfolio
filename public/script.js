const sections = document.querySelectorAll('main section[id]');
const treeLinks = document.querySelectorAll('.feature-tree a');
const cube = document.querySelector('.cube');

// Track navigation clicks so that jumping to a section keeps that link active
let jumpedTo = '';
let jumpSeen = false;

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', () => {
    const target = document.getElementById(a.hash.slice(1));
    if (target && target.matches('main section[id]')) {
      jumpedTo = target.id;
      jumpSeen = false;
      select(target.id);
    }
  });
});

['wheel', 'touchmove'].forEach((name) => {
  window.addEventListener(name, () => {
    jumpedTo = '';
  }, { passive: true });
});

window.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
    jumpedTo = '';
  }
});

window.addEventListener('scroll', () => {
  if (!jumpedTo) return;
  const targetEl = document.getElementById(jumpedTo);
  if (!targetEl) return;
  const box = targetEl.getBoundingClientRect();
  if (box.bottom > 0 && box.top < window.innerHeight) {
    jumpSeen = true;
  } else if (jumpSeen) {
    jumpedTo = '';
  }
}, { passive: true });

function select(id) {
  id = jumpedTo || id;
  treeLinks.forEach((link) => {
    if (link.hash === '#' + id) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  if (cube) {
    cube.dataset.view = id;
  }
}

// Initial selection
select('home');

// Observer to spy on sections during normal scroll
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      select(entry.target.id);
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach((section) => spy.observe(section));

// When scrolled to the very bottom, ensure the last section is selected
window.addEventListener('scroll', () => {
  const last = sections[sections.length - 1];
  if (!last || window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 2) return;
  select(last.id);
}, { passive: true });

