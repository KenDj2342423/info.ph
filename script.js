// ==========================================
// SIDEBAR TOGGLE
// ==========================================
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const floatingSidebarBtn = document.getElementById('floatingSidebarBtn');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
  sidebar.classList.add('active');
  sidebarOverlay.classList.add('active');
}

function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
}

if (floatingSidebarBtn) {
  floatingSidebarBtn.addEventListener('click', openSidebar);
}

if (sidebarClose) {
  sidebarClose.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', closeSidebar);
}

// Close sidebar when clicking links
document.querySelectorAll('.sidebar-nav a').forEach(link => {
  link.addEventListener('click', closeSidebar);
});

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href.length === 1) return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const allCards = document.querySelectorAll('.card[data-keywords]');

if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm.length < 2) {
      searchResults.innerHTML = '';
      return;
    }
    
    const results = [];
    allCards.forEach(card => {
      const keywords = card.getAttribute('data-keywords').toLowerCase();
      const title = card.querySelector('h4').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      
      if (keywords.includes(searchTerm) || title.includes(searchTerm) || description.includes(searchTerm)) {
        results.push({
          title: card.querySelector('h4').textContent,
          description: card.querySelector('p').textContent,
          link: card.href
        });
      }
    });
    
    displaySearchResults(results);
  });
}

function displaySearchResults(results) {
  if (results.length === 0) {
    searchResults.innerHTML = '<div style="padding: 12px; text-align: center; color: #777;">No results found</div>';
    return;
  }
  
  let html = '';
  results.slice(0, 8).forEach(result => {
    html += `
      <div class="search-result-item" onclick="window.open('${result.link}', '_blank')">
        <strong>${result.title}</strong>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #777;">${result.description}</p>
      </div>
    `;
  });
  
  if (results.length > 8) {
    html += `<div style="padding: 12px; text-align: center; color: #777; font-size: 13px;">+${results.length - 8} more results</div>`;
  }
  
  searchResults.innerHTML = html;
}

// Close search on outside click
document.addEventListener('click', function(e) {
  if (searchInput && !searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.innerHTML = '';
  }
});

// ==========================================
// DARK MODE
// ==========================================
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

if (darkModeToggle) {
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
  }

  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
      darkModeToggle.textContent = '☀️';
      localStorage.setItem('darkMode', 'enabled');
    } else {
      darkModeToggle.textContent = '🌙';
      localStorage.setItem('darkMode', 'disabled');
    }
  });
}

// ==========================================
// SCROLL TO TOP
// ==========================================
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==========================================
// LIVE WEATHER (9 Cities)
// ==========================================
const WEATHER_API_KEY = 'bd5e378503939ddaee76f12ad7a97608';
const WEATHER_CITIES = [
  { name: 'Manila', lat: 14.5995, lon: 120.9842 },
  { name: 'Baguio', lat: 16.4023, lon: 120.5960 },
  { name: 'Legazpi', lat: 13.1391, lon: 123.7436 },
  { name: 'Cebu', lat: 10.3157, lon: 123.8854 },
  { name: 'Iloilo', lat: 10.7202, lon: 122.5621 },
  { name: 'Tacloban', lat: 11.2500, lon: 125.0000 },
  { name: 'Davao', lat: 7.1907, lon: 125.4553 },
  { name: 'CDO', lat: 8.4542, lon: 124.6319 },
  { name: 'Zamboanga', lat: 6.9214, lon: 122.0790 }
];

async function fetchWeather() {
  const container = document.getElementById('weatherCities');
  if (!container) return;
  
  container.innerHTML = '<div class="loading">Loading...</div>';
  
  try {
    const promises = WEATHER_CITIES.map(city =>
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${WEATHER_API_KEY}`)
        .then(res => res.json())
        .then(data => ({
          name: city.name,
          temp: Math.round(data.main.temp),
          condition: data.weather[0].description
        }))
    );
    
    const weatherData = await Promise.all(promises);
    
    container.innerHTML = weatherData.map(city => `
      <div class="weather-city">
        <div class="city-name">${city.name}</div>
        <div class="temperature">${city.temp}°C</div>
        <div class="condition">${city.condition}</div>
      </div>
    `).join('');
    
    console.log('✅ Weather loaded for 9 cities');
  } catch (error) {
    console.error('Weather error:', error);
    container.innerHTML = '<div class="loading">Failed to load</div>';
  }
}

// ==========================================
// LIVE CURRENCY
// ==========================================
async function fetchCurrency() {
  const container = document.getElementById('currencyRates');
  if (!container) return;
  
  container.innerHTML = '<div class="loading">Loading...</div>';
  
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/PHP');
    const data = await res.json();
    
    const usd = (1 / data.rates.USD).toFixed(2);
    const eur = (1 / data.rates.EUR).toFixed(2);
    const jpy = (1 / data.rates.JPY * 100).toFixed(2);
    
    container.innerHTML = `
      <div class="currency-item">
        <div class="currency-label">USD to PHP</div>
        <div class="currency-value">₱${usd}</div>
      </div>
      <div class="currency-item">
        <div class="currency-label">EUR to PHP</div>
        <div class="currency-value">₱${eur}</div>
      </div>
      <div class="currency-item">
        <div class="currency-label">100 JPY to PHP</div>
        <div class="currency-value">₱${jpy}</div>
      </div>
    `;
    
    console.log('✅ Currency rates loaded');
  } catch (error) {
    console.error('Currency error:', error);
    container.innerHTML = `
      <div class="currency-item">
        <div class="currency-label">USD to PHP</div>
        <div class="currency-value">₱56.50</div>
      </div>
    `;
  }
}

// ==========================================
// INTERACTIVE CALENDAR
// ==========================================
let currentDate = new Date();
let selectedDate = null;

function renderCalendar() {
  const container = document.getElementById('calendarContainer');
  if (!container) return;
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  let html = '<div class="calendar-grid">';
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(day => {
    html += `<div class="calendar-header">${day}</div>`;
  });
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    html += `<div class="calendar-day other-month">${day}</div>`;
  }
  
  // Current month days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = (day === today.getDate() && 
                     month === today.getMonth() && 
                     year === today.getFullYear());
    
    const isSelected = selectedDate && 
                       (day === selectedDate.getDate() && 
                        month === selectedDate.getMonth() && 
                        year === selectedDate.getFullYear());
    
    const classes = ['calendar-day'];
    if (isToday) classes.push('today');
    if (isSelected) classes.push('selected');
    
    html += `<div class="${classes.join(' ')}" data-date="${year}-${month}-${day}" onclick="selectDate(this)">${day}</div>`;
  }
  
  // Next month days
  const remainingDays = 42 - (firstDay + daysInMonth);
  for (let day = 1; day <= remainingDays; day++) {
    html += `<div class="calendar-day other-month">${day}</div>`;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

function selectDate(element) {
  const dateStr = element.getAttribute('data-date');
  if (!dateStr) return;
  
  const [year, month, day] = dateStr.split('-').map(Number);
  selectedDate = new Date(year, month, day);
  renderCalendar();
  
  console.log('Selected:', selectedDate.toLocaleDateString());
}

window.selectDate = selectDate;

// ==========================================
// DROPDOWN MENUS (Mobile)
// ==========================================
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const dropdown = this.parentElement;
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (menu.style.display === 'block') {
        menu.style.display = 'none';
      } else {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
        menu.style.display = 'block';
      }
    }
  });
});

document.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.style.display = '';
    });
  }
});

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Load live data
  fetchWeather();
  fetchCurrency();
  renderCalendar();
  
  // Calendar navigation
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }
  
  // Refresh data periodically
  setInterval(fetchWeather, 600000); // 10 min
  setInterval(fetchCurrency, 1800000); // 30 min
  
  console.log('✅ info.ph loaded!');
  console.log('🌤️ Weather: 9 cities');
  console.log('💱 Currency: Live rates');
  console.log('📅 Calendar: Interactive');
  console.log('☰ Sidebar: Always accessible');
});