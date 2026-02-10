// ==========================================
// NEWS PAGE JAVASCRIPT
// ==========================================

const NEWS_API_KEY = '9c36343cf59649f4be41deb18b7a3976'; // Free NewsAPI key

// Philippine News Sources (domain names for NewsAPI)
const PH_NEWS_SOURCES = [
  'rappler.com',
  'philstar.com', 
  'inquirer.net',
  'abs-cbn.com',
  'gmanetwork.com',
  'manilatimes.net'
];

// ==========================================
// FETCH NEWS BY CATEGORY
// ==========================================
async function fetchNews(category, containerId, keyword = 'Philippines') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="news-loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading ${category} news...</p>
    </div>
  `;

  try {
    // Use NewsAPI with Philippines keyword
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&language=en&sortBy=publishedAt&pageSize=9&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.articles || data.articles.length === 0) {
      throw new Error('No articles found');
    }

    // Filter for Philippine sources when possible
    let articles = data.articles.filter(article => 
      article.title && 
      article.description && 
      article.url &&
      article.title !== '[Removed]'
    );

    // Limit to 9 articles
    articles = articles.slice(0, 9);

    displayNews(articles, container);
    console.log(`✅ ${category} news loaded: ${articles.length} articles`);

  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    container.innerHTML = `
      <div class="news-error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Unable to load news. Please try again later.</p>
      </div>
    `;
  }
}

// ==========================================
// DISPLAY NEWS ARTICLES
// ==========================================
function displayNews(articles, container) {
  container.innerHTML = articles.map(article => {
    const imageUrl = article.urlToImage || '';
    const source = article.source.name || 'News Source';
    const title = article.title || 'Untitled';
    const description = article.description || 'No description available.';
    const url = article.url;
    const publishedDate = article.publishedAt ? formatDate(article.publishedAt) : 'Recently';

    return `
      <a href="${url}" target="_blank" rel="noopener" class="news-article">
        ${imageUrl ? 
          `<img src="${imageUrl}" alt="${title}" class="news-image" loading="lazy" onerror="this.parentElement.querySelector('.news-image').outerHTML='<div class=\\'news-image placeholder\\'>📰</div>'">` 
          : 
          `<div class="news-image placeholder">📰</div>`
        }
        
        <div class="news-content">
          <span class="news-source">${source}</span>
          <h3 class="news-title">${title}</h3>
          <p class="news-description">${description}</p>
          
          <div class="news-meta">
            <span class="news-date">
              <i class="fas fa-clock"></i>
              ${publishedDate}
            </span>
            <span class="news-read-more">
              Read more <i class="fas fa-arrow-right"></i>
            </span>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

// ==========================================
// FORMAT DATE
// ==========================================
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

// ==========================================
// FETCH SPECIFIC CATEGORIES
// ==========================================
async function loadBreakingNews() {
  await fetchNews('Breaking', 'breakingNewsGrid', 'Philippines news');
}

async function loadNationalNews() {
  await fetchNews('National', 'nationalNewsGrid', 'Philippines politics Manila');
}

async function loadBusinessNews() {
  await fetchNews('Business', 'businessNewsGrid', 'Philippines economy business stock market');
}

async function loadRegionalNews(region = 'all') {
  const keywords = {
    'all': 'Philippines regions Luzon Visayas Mindanao',
    'luzon': 'Luzon Manila NCR Metro Manila',
    'visayas': 'Visayas Cebu Iloilo',
    'mindanao': 'Mindanao Davao Zamboanga'
  };
  
  await fetchNews('Regional', 'regionalNewsGrid', keywords[region] || keywords['all']);
}

async function loadSportsNews() {
  await fetchNews('Sports', 'sportsNewsGrid', 'Philippines sports basketball Gilas PBA');
}

// ==========================================
// REGION TABS FUNCTIONALITY
// ==========================================
function initializeRegionTabs() {
  const tabs = document.querySelectorAll('.region-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Load news for selected region
      const region = tab.dataset.region;
      loadRegionalNews(region);
    });
  });
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
// AUTO-REFRESH NEWS
// ==========================================
function startAutoRefresh() {
  // Refresh news every 30 minutes
  setInterval(() => {
    console.log('🔄 Auto-refreshing news...');
    loadBreakingNews();
    loadNationalNews();
    loadBusinessNews();
    loadRegionalNews('all');
    loadSportsNews();
  }, 1800000); // 30 minutes
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('📰 News page initializing...');
  
  // Initialize all features
  initializeSidebar();
  initializeDarkMode();
  initializeScrollToTop();
  initializeSmoothScroll();
  initializeRegionTabs();
  
  // Load all news categories
  loadBreakingNews();
  loadNationalNews();
  loadBusinessNews();
  loadRegionalNews('all');
  loadSportsNews();
  
  // Start auto-refresh
  startAutoRefresh();
  
  console.log('✅ News page loaded successfully!');
  console.log('📰 Real-time news from Philippines');
  console.log('🔄 Auto-refresh every 30 minutes');
  
  // Initialize dark mode for news page
  initializeNewsDarkMode();
});

// ==========================================
// DARK MODE FOR NEWS PAGE
// ==========================================
function initializeNewsDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  if (!darkModeToggle) {
    console.warn('Dark mode toggle not found');
    return;
  }

  // Check localStorage and apply saved preference
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
    console.log('🌙 Dark mode enabled from localStorage');
  }

  // Toggle dark mode on button click
  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
      darkModeToggle.textContent = '☀️';
      localStorage.setItem('darkMode', 'enabled');
      console.log('🌙 Dark mode enabled');
    } else {
      darkModeToggle.textContent = '🌙';
      localStorage.setItem('darkMode', 'disabled');
      console.log('☀️ Light mode enabled');
    }
  });
}