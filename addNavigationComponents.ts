import { db } from "./db";
import { components, categories } from "@shared/schema";
import { eq } from "drizzle-orm";

async function addNavigationComponents() {
  console.log("Adding navigation components...");

  // Find the navigation category
  const [navCategory] = await db.select().from(categories).where(eq(categories.name, "Navigation"));
  
  if (!navCategory) {
    console.log("Navigation category not found");
    return;
  }

  const navigationComponents = [
    {
      name: "Sticky Top Navigation",
      description: "Fixed navigation bar that stays at the top",
      categoryId: navCategory.id,
      html: `<nav class="sticky-nav">
  <div class="nav-container">
    <div class="nav-logo">
      <a href="#" class="logo">BrandName</a>
    </div>
    <ul class="nav-menu">
      <li><a href="#home" class="nav-link active">Home</a></li>
      <li><a href="#about" class="nav-link">About</a></li>
      <li><a href="#services" class="nav-link">Services</a></li>
      <li><a href="#contact" class="nav-link">Contact</a></li>
    </ul>
    <div class="nav-toggle">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>
  </div>
</nav>`,
      css: `.sticky-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: #007bff;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background-color: #007bff;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.bar {
  width: 25px;
  height: 3px;
  background-color: #333;
  margin: 3px 0;
  transition: 0.3s;
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    left: -100%;
    top: 70px;
    flex-direction: column;
    background-color: white;
    width: 100%;
    text-align: center;
    transition: 0.3s;
    box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
    padding: 2rem 0;
  }

  .nav-menu.active {
    left: 0;
  }

  .nav-toggle {
    display: flex;
  }
}`,
      js: `// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  
  // Animate hamburger
  const bars = navToggle.querySelectorAll('.bar');
  bars[0].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(-5px, 6px)' : '';
  bars[1].style.opacity = navMenu.classList.contains('active') ? '0' : '';
  bars[2].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(-5px, -6px)' : '';
});

// Close menu when clicking links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    const bars = navToggle.querySelectorAll('.bar');
    bars.forEach(bar => bar.style.transform = '');
    bars[1].style.opacity = '';
  });
});

// Add scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.sticky-nav');
  if (window.scrollY > 100) {
    nav.style.background = 'rgba(255, 255, 255, 0.98)';
    nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    nav.style.background = 'rgba(255, 255, 255, 0.95)';
    nav.style.boxShadow = 'none';
  }
});`,
      tags: ["sticky", "responsive", "mobile", "top"]
    },
    {
      name: "Modern Navigation Bar",
      description: "Clean modern navigation with hover effects",
      categoryId: navCategory.id,
      html: `<nav class="modern-nav">
  <div class="nav-wrapper">
    <div class="nav-brand">
      <h2>Modern</h2>
    </div>
    <ul class="nav-items">
      <li><a href="#" class="nav-item">Home</a></li>
      <li><a href="#" class="nav-item">Products</a></li>
      <li><a href="#" class="nav-item">About</a></li>
      <li><a href="#" class="nav-item">Contact</a></li>
    </ul>
    <div class="nav-actions">
      <button class="btn-outline">Login</button>
      <button class="btn-primary">Sign Up</button>
    </div>
  </div>
</nav>`,
      css: `.modern-nav {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h2 {
  color: white;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.nav-items {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.btn-outline {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
}

.btn-primary {
  background: white;
  border: none;
  color: #667eea;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .nav-items {
    display: none;
  }
  
  .nav-actions {
    gap: 0.5rem;
  }
  
  .btn-outline,
  .btn-primary {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }
}`,
      js: `// Add smooth scroll for navigation links
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Remove active class from all links
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to clicked link
    this.classList.add('active');
    
    // Add pulse effect
    this.style.animation = 'pulse 0.3s ease';
    setTimeout(() => {
      this.style.animation = '';
    }, 300);
  });
});

// Add CSS for active state and pulse animation
const style = document.createElement('style');
style.textContent = \`
  .nav-item.active {
    background: rgba(255, 255, 255, 0.3) !important;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
\`;
document.head.appendChild(style);`,
      tags: ["modern", "gradient", "buttons", "responsive"]
    },
    {
      name: "Sidebar Navigation",
      description: "Collapsible sidebar navigation menu",
      categoryId: navCategory.id,
      html: `<div class="sidebar-nav">
  <div class="sidebar-toggle">
    <button class="toggle-btn">☰</button>
  </div>
  <nav class="sidebar">
    <div class="sidebar-header">
      <h3>Menu</h3>
    </div>
    <ul class="sidebar-menu">
      <li><a href="#" class="sidebar-link"><span class="icon">🏠</span> Dashboard</a></li>
      <li><a href="#" class="sidebar-link"><span class="icon">👥</span> Users</a></li>
      <li><a href="#" class="sidebar-link"><span class="icon">📊</span> Analytics</a></li>
      <li><a href="#" class="sidebar-link"><span class="icon">⚙️</span> Settings</a></li>
      <li><a href="#" class="sidebar-link"><span class="icon">💬</span> Messages</a></li>
      <li><a href="#" class="sidebar-link"><span class="icon">🚪</span> Logout</a></li>
    </ul>
  </nav>
  <div class="content-area">
    <h2>Main Content Area</h2>
    <p>This area shows how the sidebar navigation works with your main content.</p>
  </div>
</div>`,
      css: `.sidebar-nav {
  display: flex;
  min-height: 400px;
  position: relative;
}

.sidebar-toggle {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
}

.toggle-btn {
  background: #333;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
}

.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  transition: transform 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
  transform: translateX(-100%);
}

.sidebar.active {
  transform: translateX(0);
}

.sidebar-header {
  padding: 2rem 1rem 1rem;
  border-bottom: 1px solid #34495e;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: white;
  text-decoration: none;
  transition: background 0.3s ease;
  border-bottom: 1px solid #34495e;
}

.sidebar-link:hover {
  background: #34495e;
}

.sidebar-link .icon {
  margin-right: 1rem;
  font-size: 1.2rem;
}

.content-area {
  flex: 1;
  padding: 4rem 2rem 2rem;
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

.sidebar.active ~ .content-area {
  margin-left: 250px;
}

@media (max-width: 768px) {
  .sidebar.active ~ .content-area {
    margin-left: 0;
  }
}`,
      js: `// Sidebar toggle functionality
const toggleBtn = document.querySelector('.toggle-btn');
const sidebar = document.querySelector('.sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  
  // Change toggle button text
  toggleBtn.textContent = sidebar.classList.contains('active') ? '✕' : '☰';
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
      sidebar.classList.remove('active');
      toggleBtn.textContent = '☰';
    }
  }
});

// Add active state to menu items
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Remove active class from all links
    document.querySelectorAll('.sidebar-link').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to clicked link
    this.classList.add('active');
  });
});

// Add CSS for active state
const style = document.createElement('style');
style.textContent = \`
  .sidebar-link.active {
    background: #3498db !important;
  }
\`;
document.head.appendChild(style);`,
      tags: ["sidebar", "collapsible", "mobile", "dashboard"]
    }
  ];

  // Insert components
  const insertedComponents = await db.insert(components).values(navigationComponents).returning();
  console.log(`Added ${insertedComponents.length} navigation components`);

  // Update category component count
  const navComponents = await db.select().from(components)
    .where(eq(components.categoryId, navCategory.id))
    .where(eq(components.isActive, true));
  
  await db.update(categories)
    .set({ componentCount: navComponents.length })
    .where(eq(categories.id, navCategory.id));

  console.log("Navigation components added successfully!");
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addNavigationComponents().catch(console.error);
}

export { addNavigationComponents };