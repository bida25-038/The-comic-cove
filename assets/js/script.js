
const tabs = document.querySelectorAll('.tab');
const eventLists = document.querySelectorAll('[data-event-list]');
if (tabs.length) {
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    eventLists.forEach(list => {
      list.hidden = list.dataset.eventList !== target;
    });
  }));
}

const addButtons = document.querySelectorAll('[data-add-to-cart]');
const countEls = document.querySelectorAll('.cart-count');
const cartPageCount = document.querySelector('.cart-items-count');
const cartMessage = document.querySelector('.cart-message');
const checkoutBtn = document.querySelector('#checkout-btn');
const searchBtn = document.querySelector('.search-btn');
const cartViewBtn = document.querySelector('.cart-view-btn');
let cartCount = parseInt(localStorage.getItem('comicCoveCartCount') || '0', 10);
const renderCount = () => countEls.forEach(el => el.textContent = String(cartCount));
const renderCartPage = () => {
  if (cartPageCount) {
    cartPageCount.textContent = String(cartCount);
  }
  if (cartMessage) {
    cartMessage.textContent = cartCount
      ? `You have ${cartCount} item${cartCount === 1 ? '' : 's'} in your cart.`
      : 'Your cart is empty. Add something from the store to get started.';
  }
  if (checkoutBtn) {
    if (cartCount > 0) {
      checkoutBtn.removeAttribute('aria-disabled');
      checkoutBtn.classList.remove('disabled');
      checkoutBtn.href = 'checkout.html';
    } else {
      checkoutBtn.setAttribute('aria-disabled', 'true');
      checkoutBtn.classList.add('disabled');
      checkoutBtn.href = '#';
    }
  }
};
renderCount();
renderCartPage();

const catalogueItems = document.querySelectorAll('.catalogue-grid .comic-thumb');
const categoryFilters = document.querySelectorAll('.filters input[data-filter="category"]');
const formatFilters = document.querySelectorAll('.filters input[data-filter="format"]');
const priceFilters = document.querySelectorAll('.filters input[data-filter="price"]');
const applyFiltersButton = document.querySelector('#apply-filters');
const sortSelect = document.querySelector('#sort');

const catalogueMetadata = {
  'demon-slayer': { category: 'Manga', format: 'Comic Book' },
  'the-walking-dead': { category: 'Horror', format: 'Comic Book' },
  'x-men-gold': { category: 'Superhero', format: 'Comic Book' },
  'saga-volume-1': { category: 'Sci-Fi', format: 'Graphic Novel' },
  'hellboy': { category: 'Horror', format: 'Comic Book' },
  'batman-detective': { category: 'Superhero', format: 'Comic Book' },
  'ant-man': { category: 'Superhero', format: 'Comic Book' },
  'black-panther': { category: 'Superhero', format: 'Comic Book' },
  'invincible': { category: 'Superhero', format: 'Comic Book' },
  'blue-lock': { category: 'Manga', format: 'Graphic Novel' },
  'chainsaw-man': { category: 'Manga', format: 'Comic Book' },
  'deadly-class': { category: 'Horror', format: 'Comic Book' },
  'dragon-ball': { category: 'Manga', format: 'Comic Book' },
  'hajime-no-ippo': { category: 'Manga', format: 'Comic Book' },
  'jujutsu-kaisen': { category: 'Manga', format: 'Comic Book' },
  'my-hero-academia': { category: 'Manga', format: 'Graphic Novel' },
  'naruto': { category: 'Manga', format: 'Comic Book' },
  'one-piece': { category: 'Manga', format: 'Comic Book' },
  'deadpool': { category: 'Superhero', format: 'Comic Book' },
  'aquaman': { category: 'Superhero', format: 'Comic Book' },
  'harley-quinn': { category: 'Superhero', format: 'Comic Book' },
  'iron-man': { category: 'Superhero', format: 'Comic Book' },
  'moon-knight': { category: 'Superhero', format: 'Comic Book' },
  'spider-man-into-the-spider-verse': { category: 'Superhero', format: 'Graphic Novel' },
  'stranger-things': { category: 'Sci-Fi', format: 'Collectible' },
  'avengers-doomsday': { category: 'Superhero', format: 'Hardcover' },
  'captain-america-civil-war': { category: 'Superhero', format: 'Hardcover' },
  'doctor-strange-multiverse': { category: 'Superhero', format: 'Comic Book' },
  'guardians-galaxy-vol3': { category: 'Superhero', format: 'Comic Book' },
  'punisher-vengeance': { category: 'Superhero', format: 'Comic Book' },
  'venom-lethal-protector': { category: 'Superhero', format: 'Comic Book' },
  'deathstroke-borgia-plague': { category: 'Superhero', format: 'Comic Book' },
  'justice-league-unlimited-vol6': { category: 'Superhero', format: 'Hardcover' },
  'robin-tim-drake': { category: 'Superhero', format: 'Comic Book' },
  'shazam-new-beginning': { category: 'Superhero', format: 'Comic Book' },
  'superman-graphical-novel': { category: 'Superhero', format: 'Hardcover' },
  'flash-fastest-man-alive': { category: 'Superhero', format: 'Comic Book' },
  'wonder-woman': { category: 'Superhero', format: 'Comic Book' },
  'feverknights': { category: 'Fantasy', format: 'Graphic Novel' },
  'hitgirl-issue-nine': { category: 'Superhero', format: 'Comic Book' },
  'nights-with-great-power': { category: 'Fantasy', format: 'Hardcover' },
  'scrapper-issue-4': { category: 'Sci-Fi', format: 'Comic Book' },
  'my-hero-academia-graphic-novel-16': { category: 'Manga', format: 'Graphic Novel' },
  'dandadan-vol1': { category: 'Manga', format: 'Comic Book' },
  'peter-packer': { category: 'Fantasy', format: 'Comic Book' }
};

const parsePrice = (item) => {
  const priceText = item.querySelector('.product-price')?.textContent || '0';
  return Number(priceText.replace(/[^0-9\.]/g, '')) || 0;
};

const getSelectedValues = (inputs) => Array.from(inputs)
  .filter((input) => input.checked)
  .map((input) => input.value);

const getSelectedPrice = (inputs) => {
  const selected = Array.from(inputs).find((input) => input.checked);
  return selected ? selected.value : 'all';
};

const applyCatalogueFilters = () => {
  if (!catalogueItems.length) return;

  const selectedCategories = getSelectedValues(categoryFilters);
  const selectedFormats = getSelectedValues(formatFilters);
  const selectedPriceRange = getSelectedPrice(priceFilters);

  catalogueItems.forEach((item) => {
    const metadata = catalogueMetadata[item.dataset.product] || {};
    const priceValue = parsePrice(item);
    const categoryMatch = !selectedCategories.length || selectedCategories.includes(metadata.category);
    const formatMatch = !selectedFormats.length || selectedFormats.includes(metadata.format);
    const priceMatch = selectedPriceRange === 'all'
      || (selectedPriceRange === 'under-10' && priceValue < 10)
      || (selectedPriceRange === '10-plus' && priceValue >= 10);

    item.hidden = !(categoryMatch && formatMatch && priceMatch);
  });
};

const sortCatalogueItems = () => {
  if (!sortSelect || !catalogueItems.length) return;

  const container = document.querySelector('.catalogue-grid');
  if (!container) return;

  const order = sortSelect.value;
  const sortedItems = Array.from(catalogueItems);

  if (order === 'Price Low to High') {
    sortedItems.sort((a, b) => parsePrice(a) - parsePrice(b));
  } else if (order === 'Price High to Low') {
    sortedItems.sort((a, b) => parsePrice(b) - parsePrice(a));
  } else if (order === 'Newest') {
    sortedItems.sort((a, b) => Number(b.dataset.originalIndex || 0) - Number(a.dataset.originalIndex || 0));
  } else {
    sortedItems.sort((a, b) => Number(a.dataset.originalIndex || 0) - Number(b.dataset.originalIndex || 0));
  }

  container.append(...sortedItems);
};

if (catalogueItems.length) {
  catalogueItems.forEach((item, index) => {
    item.dataset.originalIndex = String(index);
  });
}

if (applyFiltersButton) {
  applyFiltersButton.addEventListener('click', (event) => {
    event.preventDefault();
    applyCatalogueFilters();
    sortCatalogueItems();
  });
}

categoryFilters.forEach((input) => input.addEventListener('change', applyCatalogueFilters));
formatFilters.forEach((input) => input.addEventListener('change', applyCatalogueFilters));
priceFilters.forEach((input) => input.addEventListener('change', applyCatalogueFilters));
if (sortSelect) {
  sortSelect.addEventListener('change', sortCatalogueItems);
}

applyCatalogueFilters();
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const query = prompt('Search The Comic Cove');
    if (!query) return;
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return;

    const searchableSelectors = [
      'main h1',
      'main h2',
      'main h3',
      'main h4',
      'main p',
      'main a',
      'main .product-title',
      'main .event-meta h3',
      'main .community-card h3'
    ];
    const results = Array.from(document.querySelectorAll(searchableSelectors.join(',')))
      .map(el => el.textContent.trim())
      .filter(text => text.toLowerCase().includes(normalizedQuery));

    if (results.length) {
      const uniqueResults = [...new Set(results)].slice(0, 6);
      alert(`Search results for "${query}":\n- ${uniqueResults.join('\n- ')}`);
    } else {
      alert(`No results found for "${query}" on this page.`);
    }
  });
}

if (cartViewBtn) {
  cartViewBtn.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });
}

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');

if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      contactStatus.textContent = 'Please complete all fields before sending your message.';
      contactStatus.className = 'form-status error';
      return;
    }

    const subject = encodeURIComponent(`Comic Cove inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailtoHref = `mailto:info@thecomiccove.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoHref;
    contactStatus.textContent = 'Your email app has been opened with your message ready to send.';
    contactStatus.className = 'form-status success';
    contactForm.reset();
  });
}

const subscriptionStatus = document.querySelector('#subscription-status');
const subscriptionButtons = document.querySelectorAll('[data-subscribe-plan]');

if (subscriptionButtons.length && subscriptionStatus) {
  subscriptionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const plan = button.dataset.subscribePlan;
      subscriptionStatus.textContent = `${plan} subscription selected. This demo currently shows a confirmation message until a full checkout flow is added.`;
    });
  });
}

addButtons.forEach(btn => btn.addEventListener('click', () => {
  cartCount += 1;
  localStorage.setItem('comicCoveCartCount', String(cartCount));
  renderCount();

  btn.textContent = 'ADDED';

  // ensure the cart count updates immediately even if multiple buttons are clicked quickly
  requestAnimationFrame(() => renderCount());

  // update cart page UI (if user is on cart page)
  renderCartPage();

  setTimeout(() => btn.textContent = 'ADD TO CART', 1200);
}));
