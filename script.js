// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Highlight active navigation based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

function highlightNavigation() {
  let scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.style.backgroundColor = '';
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.style.backgroundColor = 'rgba(255,255,255,0.2)';
        }
      });
    }
  });
}

// Add scroll event listener with throttling
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = window.requestAnimationFrame(highlightNavigation);
});

highlightNavigation();

// SEARCH FUNCTIONALITY
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

// Click outside to close search results
document.addEventListener('click', function(e) {
  if (searchInput && !searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.innerHTML = '';
  }
});

// DARK MODE TOGGLE
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

if (darkModeToggle) {
  // Check for saved dark mode preference
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

// SCROLL TO TOP BUTTON
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

// Add animation to cards on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all cards for animation
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card, .quick-card, .popular-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.03}s, transform 0.5s ease ${index * 0.03}s`;
    observer.observe(card);
  });
});

// Enhanced header shadow on scroll
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  } else {
    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
  }
  
  lastScroll = currentScroll;
});

// DROPDOWN MENU enhancement for mobile
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const dropdown = this.parentElement;
      const menu = dropdown.querySelector('.dropdown-menu');
      
      // Toggle display
      if (menu.style.display === 'block') {
        menu.style.display = 'none';
      } else {
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
        menu.style.display = 'block';
      }
    }
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.style.display = '';
    });
  }
});

// Console logs
console.log('✅ info.ph ENHANCED - All features loaded!');
console.log('📊 Total sections:', sections.length);
console.log('🔗 Total cards:', document.querySelectorAll('.card').length);
console.log('🎨 Features: Search, Dark Mode, Dropdowns, Widgets, Scroll to Top, Smooth Animations');