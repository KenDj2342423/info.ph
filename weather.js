// ==========================================
// WEATHER PAGE - DEMO VERSION (ALWAYS WORKS)
// ==========================================
// Use this if API keeps failing - shows realistic demo data

const DEMO_WEATHER_DATA = [
  { name: 'Manila', temp: 32, feels: 36, desc: 'Partly cloudy', humidity: 75, wind: 15, clouds: 40 },
  { name: 'Quezon City', temp: 31, feels: 35, desc: 'Mostly sunny', humidity: 72, wind: 12, clouds: 30 },
  { name: 'Cebu City', temp: 30, feels: 34, desc: 'Sunny', humidity: 70, wind: 18, clouds: 20 },
  { name: 'Davao City', temp: 29, feels: 33, desc: 'Partly cloudy', humidity: 78, wind: 10, clouds: 45 },
  { name: 'Baguio', temp: 22, feels: 24, desc: 'Cloudy', humidity: 85, wind: 8, clouds: 80 },
  { name: 'Iloilo City', temp: 31, feels: 35, desc: 'Sunny', humidity: 68, wind: 14, clouds: 15 },
  { name: 'Cagayan de Oro', temp: 30, feels: 34, desc: 'Partly cloudy', humidity: 73, wind: 16, clouds: 35 },
  { name: 'Zamboanga', temp: 31, feels: 36, desc: 'Mostly sunny', humidity: 76, wind: 13, clouds: 25 },
  { name: 'Legazpi', temp: 30, feels: 34, desc: 'Partly cloudy', humidity: 74, wind: 17, clouds: 40 }
];

const DEMO_FORECAST_DATA = {
  'Manila': [
    { day: 'Mon', date: 'Feb 12', temp: 32, desc: 'Partly cloudy' },
    { day: 'Tue', date: 'Feb 13', temp: 33, desc: 'Sunny' },
    { day: 'Wed', date: 'Feb 14', temp: 31, desc: 'Scattered showers' }
  ],
  'Cebu': [
    { day: 'Mon', date: 'Feb 12', temp: 30, desc: 'Sunny' },
    { day: 'Tue', date: 'Feb 13', temp: 31, desc: 'Partly cloudy' },
    { day: 'Wed', date: 'Feb 14', temp: 30, desc: 'Mostly sunny' }
  ],
  'Davao': [
    { day: 'Mon', date: 'Feb 12', temp: 29, desc: 'Partly cloudy' },
    { day: 'Tue', date: 'Feb 13', temp: 30, desc: 'Sunny' },
    { day: 'Wed', date: 'Feb 14', temp: 28, desc: 'Light rain' }
  ],
  'Baguio': [
    { day: 'Mon', date: 'Feb 12', temp: 22, desc: 'Cloudy' },
    { day: 'Tue', date: 'Feb 13', temp: 21, desc: 'Overcast' },
    { day: 'Wed', date: 'Feb 14', temp: 20, desc: 'Light rain' }
  ],
  'Iloilo': [
    { day: 'Mon', date: 'Feb 12', temp: 31, desc: 'Sunny' },
    { day: 'Tue', date: 'Feb 13', temp: 32, desc: 'Mostly sunny' },
    { day: 'Wed', date: 'Feb 14', temp: 30, desc: 'Partly cloudy' }
  ]
};

function getWeatherEmoji(text) {
  text = text.toLowerCase();
  if (text.includes('sunny') || text.includes('clear')) return '☀️';
  if (text.includes('partly cloudy')) return '⛅';
  if (text.includes('cloudy') || text.includes('overcast')) return '☁️';
  if (text.includes('rain') || text.includes('drizzle') || text.includes('shower')) return '🌧️';
  if (text.includes('thunder') || text.includes('storm')) return '⛈️';
  if (text.includes('snow')) return '❄️';
  if (text.includes('mist') || text.includes('fog')) return '🌫️';
  return '🌤️';
}

function showDemoNotice() {
  const notice = document.createElement('div');
  notice.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff3cd;
    border: 2px solid #ffc107;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    font-size: 14px;
    color: #856404;
  `;
  notice.innerHTML = `
    <strong>⚠️ Demo Mode:</strong> Showing sample weather data. 
    <a href="#" onclick="this.parentElement.remove()" style="margin-left: 10px; color: #856404; text-decoration: underline;">Dismiss</a>
  `;
  document.body.appendChild(notice);
  
  setTimeout(() => notice.remove(), 10000);
}

function fetchAllCitiesWeather() {
  const container = document.getElementById('weatherGrid');
  if (!container) return;

  console.log('📊 Loading demo weather data...');
  
  showDemoNotice();

  container.innerHTML = DEMO_WEATHER_DATA.map(city => `
    <div class="weather-card">
      <div class="weather-card-header">
        <div class="city-name-weather">${city.name}</div>
        <div class="weather-icon-large">${getWeatherEmoji(city.desc)}</div>
      </div>

      <div class="temperature-large">${city.temp}°C</div>
      <div class="weather-description">${city.desc}</div>

      <div class="weather-details">
        <div class="detail-item">
          <i class="fas fa-temperature-low"></i> 
          <span>Feels ${city.feels}°C</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-tint"></i> 
          <span>${city.humidity}% Humidity</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-wind"></i> 
          <span>${city.wind} km/h</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-cloud"></i> 
          <span>${city.clouds}% Clouds</span>
        </div>
      </div>
    </div>
  `).join('');

  console.log('✅ Demo weather loaded');
}

function fetch3DayForecast(cityName) {
  const container = document.getElementById('forecastContainer');
  if (!container) return;

  const forecastData = DEMO_FORECAST_DATA[cityName] || DEMO_FORECAST_DATA['Manila'];

  container.innerHTML = `
    <div class="forecast-grid">
      ${forecastData.map(day => `
        <div class="forecast-card">
          <div class="forecast-day">${day.day}</div>
          <div class="forecast-date">${day.date}</div>
          <div class="forecast-icon">${getWeatherEmoji(day.desc)}</div>
          <div class="forecast-temp">${day.temp}°C</div>
          <div class="forecast-desc">${day.desc}</div>
        </div>
      `).join('')}
    </div>
  `;

  console.log(`✅ Demo forecast loaded for ${cityName}`);
}

function initializeCitySelector() {
  const cityButtons = document.querySelectorAll('.city-btn');
  
  cityButtons.forEach(button => {
    button.addEventListener('click', () => {
      cityButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      fetch3DayForecast(button.dataset.city);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌤️ Weather page (DEMO MODE) initializing...');
  
  fetchAllCitiesWeather();
  initializeCitySelector();
  
  const defaultButton = document.querySelector('.city-btn.active');
  if (defaultButton) {
    fetch3DayForecast(defaultButton.dataset.city);
  }
  
  console.log('✅ Demo weather page loaded');
});