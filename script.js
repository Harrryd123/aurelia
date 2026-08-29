(function () {
  "use strict";

  /* ---------- SCROLL REVEAL ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  revealEls.forEach(function (el) {
    var delay = el.getAttribute("data-delay");
    if (delay) el.style.setProperty("--d", delay);
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- MOBILE MENU ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var navMobile = document.getElementById("navMobile");
  if (menuToggle && navMobile) {
    menuToggle.addEventListener("click", function () {
      var open = navMobile.classList.toggle("open");
      menuToggle.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navMobile.classList.remove("open");
        menuToggle.classList.remove("open");
      });
    });
  }

  /* ---------- SEARCH BAR ---------- */
  var searchToggle = document.getElementById("searchToggle");
  var searchBar = document.getElementById("searchBar");
  var searchClose = document.getElementById("searchClose");
  if (searchToggle && searchBar) {
    searchToggle.addEventListener("click", function () {
      searchBar.hidden = false;
      requestAnimationFrame(function () {
        searchBar.classList.add("open");
        var input = searchBar.querySelector("input");
        if (input) input.focus();
      });
    });
  }
  if (searchClose && searchBar) {
    searchClose.addEventListener("click", function () {
      searchBar.classList.remove("open");
      setTimeout(function () { searchBar.hidden = true; }, 400);
    });
  }

  /* ---------- FAVORITES CAROUSEL NAV ---------- */
  var favTrack = document.getElementById("favTrack");
  var favNext = document.getElementById("favNext");
  if (favTrack && favNext) {
    favNext.addEventListener("click", function () {
      var cardWidth = favTrack.firstElementChild
        ? favTrack.firstElementChild.getBoundingClientRect().width + 22
        : 260;
      favTrack.scrollBy({ left: cardWidth, behavior: "smooth" });
    });
  }

  /* ---------- TOAST ---------- */
  var toastEl = document.getElementById("toast");
  var toastTimer;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2400);
  }

  /* ---------- CART STATE ---------- */
  var cart = [];

  var cartToggle = document.getElementById("cartToggle");
  var cartDrawer = document.getElementById("cartDrawer");
  var cartOverlay = document.getElementById("cartOverlay");
  var cartClose = document.getElementById("cartClose");
  var cartItemsEl = document.getElementById("cartItems");
  var cartEmptyEl = document.getElementById("cartEmpty");
  var cartTotalEl = document.getElementById("cartTotal");
  var cartBadgeEl = document.getElementById("cartBadge");
  var cartCheckoutBtn = document.getElementById("cartCheckout");

  function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    cartToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    cartToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (cartToggle) cartToggle.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  function formatMoney(n) {
    return "$" + n.toFixed(2).replace(/\.00$/, "");
  }

  function renderCart() {
    cartItemsEl.querySelectorAll(".cart-item").forEach(function (n) { n.remove(); });

    if (cart.length === 0) {
      cartEmptyEl.hidden = false;
    } else {
      cartEmptyEl.hidden = true;
      cart.forEach(function (item) {
        var row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML =
          '<div class="cart-item-thumb"></div>' +
          '<div class="cart-item-info">' +
            "<h4>" + item.name + "</h4>" +
            '<span class="cart-item-price">' + formatMoney(item.price * item.qty) + "</span>" +
            '<div class="qty-row">' +
              '<button class="qty-btn" data-action="dec" data-id="' + item.id + '">−</button>' +
              '<span>' + item.qty + '</span>' +
              '<button class="qty-btn" data-action="inc" data-id="' + item.id + '">+</button>' +
              '<button class="cart-item-remove" data-action="remove" data-id="' + item.id + '">Remove</button>' +
            "</div>" +
          "</div>";
        cartItemsEl.appendChild(row);
      });
    }

    var total = cart.reduce(function (sum, i) { return sum + i.price * i.qty; }, 0);
    var count = cart.reduce(function (sum, i) { return sum + i.qty; }, 0);
    cartTotalEl.textContent = formatMoney(total);
    if (count > 0) {
      cartBadgeEl.hidden = false;
      cartBadgeEl.textContent = count;
    } else {
      cartBadgeEl.hidden = true;
    }
  }

  function addToCart(id, name, price) {
    var existing = cart.find(function (i) { return i.id === id; });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: id, name: name, price: price, qty: 1 });
    }
    renderCart();
    showToast(name + " added to your bag");
  }

  document.querySelectorAll(".product-add").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var id = btn.getAttribute("data-id");
      var name = btn.getAttribute("data-name");
      var price = parseFloat(btn.getAttribute("data-price"));
      addToCart(id, name, price);
    });
  });

  cartItemsEl.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) return;
    var id = btn.getAttribute("data-id");
    var action = btn.getAttribute("data-action");
    var item = cart.find(function (i) { return i.id === id; });
    if (!item) return;

    if (action === "inc") item.qty += 1;
    if (action === "dec") {
      item.qty -= 1;
      if (item.qty <= 0) cart = cart.filter(function (i) { return i.id !== id; });
    }
    if (action === "remove") cart = cart.filter(function (i) { return i.id !== id; });

    renderCart();
  });

  /* ---------- CHECKOUT (with COD) ---------- */
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener("click", function () {
      if (cart.length === 0) {
        showToast("Your bag is empty");
        return;
      }
      var paymentInput = document.querySelector('input[name="payment"]:checked');
      var method = paymentInput ? paymentInput.value : "prepaid";

      cart = [];
      renderCart();

      if (method === "cod") {
        showToast("Order placed — pay by Cash on Delivery");
      } else {
        showToast("Order placed — confirmation sent to your email");
      }
      setTimeout(closeCart, 900);
    });
  }

  renderCart();

  /* ---------- NEWSLETTER FORM ---------- */
  var ctaForm = document.getElementById("ctaForm");
  var ctaSuccess = document.getElementById("ctaSuccess");
  if (ctaForm) {
    ctaForm.addEventListener("submit", function (e) {
      e.preventDefault();
      ctaForm.hidden = true;
      ctaSuccess.hidden = false;
    });
  }

  /* ---------- FOOTER YEAR ---------- */
  var footerYear = document.getElementById("footerYear");
  if (footerYear) {
    footerYear.textContent = "© " + new Date().getFullYear() + " AURELIA. All rights reserved.";
  }
})();
