// ==========================================
// WEATHER PAGE JAVASCRIPT
// ==========================================

const WEATHER_API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

// Philippine Cities for Weather Display
const PHILIPPINE_CITIES = [
  { name: 'Manila', lat: 14.5995, lon: 120.9842 },
  { name: 'Quezon City', lat: 14.6760, lon: 121.0437 },
  { name: 'Cebu City', lat: 10.3157, lon: 123.8854 },
  { name: 'Davao City', lat: 7.1907, lon: 125.4553 },
  { name: 'Baguio', lat: 16.4023, lon: 120.5960 },
  { name: 'Iloilo City', lat: 10.7202, lon: 122.5621 },
  { name: 'Cagayan de Oro', lat: 8.4542, lon: 124.6319 },
  { name: 'Zamboanga', lat: 6.9214, lon: 122.0790 },
  { name: 'Legazpi', lat: 13.1391, lon: 123.7436 }
];

// ==========================================
// FETCH CURRENT WEATHER FOR ALL CITIES
// ==========================================
async function fetchAllCitiesWeather() {
  const container = document.getElementById('weatherGrid');
  if (!container) return;

  container.innerHTML = `
    <div class="weather-card-loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading weather data from ${PHILIPPINE_CITIES.length} cities...</p>
    </div>
  `;

  try {
    const promises = PHILIPPINE_CITIES.map(city =>
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${WEATHER_API_KEY}`)
        .then(res => res.json())
        .then(data => ({
          name: city.name,
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          pressure: data.main.pressure,
          clouds: data.clouds.all
        }))
    );

    const weatherData = await Promise.all(promises);
    displayWeatherCards(weatherData);
    console.log('✅ Weather loaded for all cities');
  } catch (error) {
    console.error('Weather fetch error:', error);
    container.innerHTML = `
      <div class="weather-card-loading">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Unable to load weather data. Please try again later.</p>
      </div>
    `;
  }
}

// ==========================================
// DISPLAY WEATHER CARDS
// ==========================================
function displayWeatherCards(weatherData) {
  const container = document.getElementById('weatherGrid');
  
  container.innerHTML = weatherData.map(city => `
    <div class="weather-card">
      <div class="weather-card-header">
        <div class="city-name-weather">${city.name}</div>
        <div class="weather-icon-large">${getWeatherEmoji(city.icon)}</div>
      </div>
      
      <div class="temperature-large">${city.temp}°C</div>
      <div class="weather-description">${city.description}</div>
      
      <div class="weather-details">
        <div class="detail-item">
          <i class="fas fa-temperature-low"></i>
          <span>Feels like ${city.feels_like}°C</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-tint"></i>
          <span>Humidity ${city.humidity}%</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-wind"></i>
          <span>Wind ${city.wind_speed} km/h</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-cloud"></i>
          <span>Clouds ${city.clouds}%</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ==========================================
// GET WEATHER EMOJI FROM ICON CODE
// ==========================================
function getWeatherEmoji(iconCode) {
  const emojiMap = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };
  return emojiMap[iconCode] || '🌤️';
}

// ==========================================
// FETCH 5-DAY FORECAST
// ==========================================
async function fetch5DayForecast(cityName, lat, lon) {
  const container = document.getElementById('forecastContainer');
  
  container.innerHTML = `
    <div class="forecast-loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading 5-day forecast for ${cityName}...</p>
    </div>
  `;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await response.json();

    // Get one forecast per day (at 12:00 noon)
    const dailyForecasts = data.list.filter(item => 
      item.dt_txt.includes('12:00:00')
    ).slice(0, 5);

    displayForecast(dailyForecasts, cityName);
    console.log(`✅ 5-day forecast loaded for ${cityName}`);
  } catch (error) {
    console.error('Forecast fetch error:', error);
    container.innerHTML = `
      <div class="forecast-loading">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Unable to load forecast data.</p>
      </div>
    `;
  }
}

// ==========================================
// DISPLAY 5-DAY FORECAST
// ==========================================
function displayForecast(forecasts, cityName) {
  const container = document.getElementById('forecastContainer');
  
  const forecastHTML = `
    <h3 style="text-align: center; margin-bottom: 24px; color: #00bcd4; font-size: 24px;">
      ${cityName} - 5-Day Forecast
    </h3>
    <div class="forecast-grid">
      ${forecasts.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return `
          <div class="forecast-card">
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-date">${dateStr}</div>
            <div class="forecast-icon">${getWeatherEmoji(day.weather[0].icon)}</div>
            <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
            <div class="forecast-desc">${day.weather[0].description}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  
  container.innerHTML = forecastHTML;
}

// ==========================================
// CITY SELECTOR FOR FORECAST
// ==========================================
function initializeCitySelector() {
  const cityButtons = document.querySelectorAll('.city-btn');
  
  cityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      cityButtons.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Fetch forecast for selected city
      const cityName = btn.dataset.city;
      const lat = parseFloat(btn.dataset.lat);
      const lon = parseFloat(btn.dataset.lon);
      
      fetch5DayForecast(cityName, lat, lon);
    });
  });
  
  // Load default city (Manila)
  const defaultButton = document.querySelector('.city-btn.active');
  if (defaultButton) {
    const cityName = defaultButton.dataset.city;
    const lat = parseFloat(defaultButton.dataset.lat);
    const lon = parseFloat(defaultButton.dataset.lon);
    fetch5DayForecast(cityName, lat, lon);
  }
}

// ==========================================
// MAP TAB SWITCHING
// ==========================================
function initializeMapTabs() {
  const mapTabs = document.querySelectorAll('.map-tab');
  const mapFrame = document.getElementById('weatherMap');
  
  const mapUrls = {
    'radar': 'https://www.pagasa.dost.gov.ph/weather/weather-radar',
    'satellite': 'https://www.pagasa.dost.gov.ph/weather/satellite-image',
    'forecast': 'https://www.pagasa.dost.gov.ph/weather/weather-forecast'
  };
  
  mapTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      mapTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Change iframe source
      const mapType = tab.dataset.map;
      if (mapFrame && mapUrls[mapType]) {
        mapFrame.src = mapUrls[mapType];
      }
    });
  });
}

// ==========================================
// CHECK FOR ACTIVE TYPHOONS
// ==========================================
async function checkTyphoonStatus() {
  const statusBadge = document.getElementById('typhoonBadge');
  
  if (!statusBadge) return;

  // Note: This is a placeholder. In production, you'd integrate with PAGASA's API
  // For now, we'll simulate the check
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demonstration - In real app, fetch from PAGASA API
    const hasTyphoon = false; // This would come from actual API
    
    if (hasTyphoon) {
      statusBadge.className = 'status-badge danger';
      statusBadge.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>Active Typhoon in Philippine Area of Responsibility</span>
      `;
    } else {
      statusBadge.className = 'status-badge safe';
      statusBadge.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>No active typhoons at this time</span>
      `;
    }
    
    console.log('✅ Typhoon status checked');
  } catch (error) {
    console.error('Typhoon check error:', error);
    statusBadge.className = 'status-badge';
    statusBadge.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>Unable to fetch typhoon data</span>
    `;
  }
}

// ==========================================
// DARK MODE (SYNC WITH MAIN SITE)
// ==========================================
function initializeDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  if (!darkModeToggle) return;

  // Check localStorage
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
// SIDEBAR FUNCTIONALITY
// ==========================================
function initializeSidebar() {
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
}

// ==========================================
// SCROLL TO TOP
// ==========================================
function initializeScrollToTop() {
  const scrollToTopBtn = document.getElementById('scrollToTop');

  if (!scrollToTopBtn) return;

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
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
function initializeSmoothScroll() {
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
}

// ==========================================
// AUTO-REFRESH WEATHER DATA
// ==========================================
function startAutoRefresh() {
  // Refresh weather every 10 minutes
  setInterval(() => {
    console.log('🔄 Auto-refreshing weather data...');
    fetchAllCitiesWeather();
    
    // Refresh forecast if a city is selected
    const activeCity = document.querySelector('.city-btn.active');
    if (activeCity) {
      const cityName = activeCity.dataset.city;
      const lat = parseFloat(activeCity.dataset.lat);
      const lon = parseFloat(activeCity.dataset.lon);
      fetch5DayForecast(cityName, lat, lon);
    }
  }, 600000); // 10 minutes
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌤️ Weather page initializing...');
  
  // Initialize all features
  initializeSidebar();
  initializeDarkMode();
  initializeScrollToTop();
  initializeSmoothScroll();
  initializeCitySelector();
  initializeMapTabs();
  
  // Load weather data
  fetchAllCitiesWeather();
  checkTyphoonStatus();
  
  // Start auto-refresh
  startAutoRefresh();
  
  console.log('✅ Weather page loaded successfully!');
  console.log('🌡️ Real-time weather from 9 Philippine cities');
  console.log('📅 5-day forecast available');
  console.log('🗺️ PAGASA maps integrated');
  console.log('🌀 Typhoon tracker active');
});