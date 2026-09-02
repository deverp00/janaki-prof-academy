/* ============================================================
   toggle.js — Hamburger menu + mobile navigation toggle
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.querySelector('.header-hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  var body = document.body;

  if (!hamburger || !mobileNav) {
    return;
  }

  function openMobileNav() {
    mobileNav.classList.add('mobile-nav--open');
    hamburger.classList.add('header-hamburger--open');
    hamburger.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('mobile-nav--open');
    hamburger.classList.remove('header-hamburger--open');
    hamburger.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }

  function toggleMobileNav() {
    var isOpen = mobileNav.classList.contains('mobile-nav--open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  hamburger.addEventListener('click', toggleMobileNav);

  /* Close mobile nav whenever a nav link is tapped */
  var mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* Close mobile nav on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--open')) {
      closeMobileNav();
    }
  });

  /* Close mobile nav if window is resized past the mobile breakpoint */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024 && mobileNav.classList.contains('mobile-nav--open')) {
      closeMobileNav();
    }
  });

  /* ===== User Dropdown Toggle (desktop header) ===== */
  var userTrigger = document.querySelector('.header-user');
  var userDropdown = document.querySelector('.header-user__dropdown');

  if (userTrigger && userDropdown) {
    userTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      userDropdown.classList.toggle('header-user__dropdown--open');
    });

    document.addEventListener('click', function (e) {
      if (!userTrigger.contains(e.target)) {
        userDropdown.classList.remove('header-user__dropdown--open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        userDropdown.classList.remove('header-user__dropdown--open');
      }
    });
  }

  /* ===== Generic Tab Toggle (used across consolidated pages) ===== */
  var tabGroups = document.querySelectorAll('.tabs');
  tabGroups.forEach(function (tabGroup) {
    var tabItems = tabGroup.querySelectorAll('.tabs__item');
    var panelContainer = tabGroup.parentElement;

    tabItems.forEach(function (tabItem) {
      tabItem.addEventListener('click', function () {
        var target = tabItem.getAttribute('data-tab-target');
        if (!target) return;

        tabItems.forEach(function (t) {
          t.classList.remove('tabs__item--active');
        });
        tabItem.classList.add('tabs__item--active');

        var panels = panelContainer.querySelectorAll('.tab-panel');
        panels.forEach(function (panel) {
          panel.classList.toggle('tab-panel--active', panel.getAttribute('data-tab-panel') === target);
        });
      });
    });
  });
});
