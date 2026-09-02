/* ============================================================
   script.js — Global / universal site-wide functionality
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initLogout();
  initAcademicSession();
  initToastSystem();
  initActiveNavHighlight();
  initFormValidationHelpers();
});

/* ============================================================
   LOGOUT — spinner state, prevent double-click, redirect
   ============================================================ */
function initLogout() {
  var logoutButtons = document.querySelectorAll('[data-action="logout"]');

  logoutButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      if (btn.classList.contains('header-logout--loading') || btn.disabled) {
        return;
      }

      btn.classList.add('header-logout--loading');
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');

      /* Phase 1: simulated logout process.
         Phase 2: replace with firebase.auth().signOut() */
      performLogout()
        .then(function () {
          window.location.href = 'login.html';
        })
        .catch(function () {
          btn.classList.remove('header-logout--loading');
          btn.disabled = false;
          showToast('Logout failed. Please try again.', 'error');
        });
    });
  });
}

function performLogout() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 600);
  });
}

/* ============================================================
   ACADEMIC SESSION — header badge
   ============================================================ */
function initAcademicSession() {
  var sessionEl = document.querySelector('[data-academic-session]');
  if (!sessionEl) return;

  /* Phase 1: static demo value.
     Phase 2: replace with a Firebase config/settings read. */
  var currentSession = getCurrentAcademicSession();
  sessionEl.textContent = currentSession;
}

function getCurrentAcademicSession() {
  return '2026 - 2027';
}

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function initToastSystem() {
  if (!document.querySelector('.toast-stack')) {
    var stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
}

function showToast(message, type) {
  type = type || 'info';
  var stack = document.querySelector('.toast-stack');
  if (!stack) return;

  var toast = document.createElement('div');
  toast.className = 'alert alert--' + type;
  toast.setAttribute('role', 'status');
  toast.textContent = message;

  stack.appendChild(toast);

  setTimeout(function () {
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.opacity = '0';
    setTimeout(function () {
      toast.remove();
    }, 300);
  }, 3500);
}

/* ============================================================
   ACTIVE NAV LINK HIGHLIGHT (desktop + mobile)
   ============================================================ */
function initActiveNavHighlight() {
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  var navLinks = document.querySelectorAll('.header-nav__link, .mobile-nav__link');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add(link.classList.contains('header-nav__link') ? 'header-nav__link--active' : 'mobile-nav__link--active');
    }
  });
}

/* ============================================================
   FORM VALIDATION HELPERS (shared by all module JS files)
   ============================================================ */
function initFormValidationHelpers() {
  var forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var isValid = validateForm(form);
      if (!isValid) {
        e.preventDefault();
      }
    });

    var fields = form.querySelectorAll('.form-control');
    fields.forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
      });
    });
  });
}

function validateForm(form) {
  var fields = form.querySelectorAll('.form-control[required]');
  var isValid = true;

  fields.forEach(function (field) {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  var errorEl = field.parentElement.querySelector('.form-error');
  var isEmpty = !field.value || !field.value.trim();

  if (field.hasAttribute('required') && isEmpty) {
    field.classList.add('form-control--error');
    if (errorEl) errorEl.textContent = 'This field is required.';
    return false;
  }

  if (field.type === 'email' && field.value) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(field.value)) {
      field.classList.add('form-control--error');
      if (errorEl) errorEl.textContent = 'Enter a valid email address.';
      return false;
    }
  }

  field.classList.remove('form-control--error');
  if (errorEl) errorEl.textContent = '';
  return true;
}

/* ============================================================
   SHARED HELPERS — used by module-specific JS files
   ============================================================ */
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

function formatDate(dateStr) {
  var date = new Date(dateStr);
  var options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}

function generateReceiptId(prefix) {
  var timestamp = Date.now().toString().slice(-6);
  var random = Math.floor(100 + Math.random() * 900);
  return (prefix || 'RCPT') + '-' + timestamp + random;
}

function debounce(fn, delay) {
  var timer;
  return function () {
    var args = arguments;
    var context = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay || 300);
  };
}
