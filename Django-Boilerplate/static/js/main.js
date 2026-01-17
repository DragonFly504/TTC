// js/main.js
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function () {
      mainNav.classList.toggle('active');
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  }

  .dark-mode {
  --bg: #0b1c2c;
  --brand-dark: #e0f2ff;
  --muted: #94a3b8;
  --surface: #1e293b;
  --accent: #38bdf8;
  color-scheme: dark;
}

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
  }

  // Skip link focus
  const skip = document.querySelector('.skip-link');
  if (skip) {
    skip.addEventListener('click', function () {
      const main = document.getElementById('main-content');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
      }
    });
  }

  // Leaflet map preview
  const mapEl = document.getElementById('map-preview');
  if (mapEl && typeof L !== 'undefined') {
    const map = L.map('map-preview').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    const route = [
      [40.7128, -74.0060],
      [51.5074, -0.1278]
    ];
    L.polyline(route, { color: '#007bff', weight: 3, opacity: 0.8, dashArray: '10,10' }).addTo(map);
    L.marker(route[0]).addTo(map).bindPopup('Origin');
    L.marker(route[1]).addTo(map).bindPopup('Destination');
  }

  // Tracking form with Axios
  document.getElementById('tracking-number-display').textContent = trackingNumber || 'Not provided';
  if (trackForm) {
    trackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const q = trackForm.querySelector('input[name="q"]')?.value?.trim();
      if (!q) return;

      const submitBtn = trackForm.querySelector('button[type="submit"]');
      const prevText = submitBtn?.textContent;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Searching...'; }

      axios.get(`/api/track/?q=${encodeURIComponent(q)}`)
        .then(response => {
          const data = response.data;
          if (!data || !data.events || data.events.length === 0) {
            trackingOutput.innerHTML = `<div class="step-card"><strong>No events found</strong><p class="muted">Please check the tracking number and try again.</p></div>`;
          } else {
            trackingOutput.innerHTML = data.events.map(ev => `
              <div class="step-card">
                <strong>${ev.status}</strong>
                <small>${ev.time}</small>
                <p>${ev.location || ''}</p>
                <p class="muted">${ev.details || ''}</p>
              </div>
            `).join('');
          }
        })
        .catch(() => {
          trackingOutput.innerHTML = `<div class="step-card"><strong>Error</strong><p class="muted">Unable to fetch tracking details. Try again later.</p></div>`;
        })
        .finally(() => {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = prevText; }
        });
    });
  }
});
