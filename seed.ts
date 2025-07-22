import { db } from "./db";
import { categories, components } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedDatabase() {
  console.log("Seeding database...");

  // Check if categories already exist
  const existingCategories = await db.select().from(categories);
  
  if (existingCategories.length === 0) {
    // Insert default categories
    const defaultCategories = [
      { name: "Buttons", icon: "fas fa-hand-pointer", description: "Interactive button components" },
      { name: "Headings", icon: "fas fa-heading", description: "Typography and heading styles" },
      { name: "Sections", icon: "fas fa-layer-group", description: "Layout sections and containers" },
      { name: "Navigation", icon: "fas fa-bars", description: "Navigation bars and menus" },
      { name: "Sliders", icon: "fas fa-images", description: "Image carousels and sliders" },
      { name: "Footers", icon: "fas fa-shoe-prints", description: "Footer sections and layouts" },
      { name: "GSAP Animations", icon: "fas fa-magic", description: "GSAP powered animations" },
    ];

    const insertedCategories = await db.insert(categories).values(defaultCategories).returning();
    console.log(`Created ${insertedCategories.length} categories`);

    // Insert sample components
    const sampleComponents = [
      {
        name: "Primary Button",
        description: "Modern primary action button",
        categoryId: insertedCategories[0].id, // Buttons
        html: `<button class="btn-primary">Get Started</button>`,
        css: `.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}`,
        js: `document.querySelector('.btn-primary').addEventListener('click', function() {
  this.style.transform = 'scale(0.95)';
  setTimeout(() => {
    this.style.transform = 'translateY(-2px)';
  }, 150);
});`,
        tags: ["primary", "gradient", "hover"]
      },
      {
        name: "Glass Button",
        description: "Glassmorphism style button",
        categoryId: insertedCategories[0].id, // Buttons
        html: `<button class="btn-glass">Glass Effect</button>`,
        css: `.btn-glass {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}`,
        js: `// Add ripple effect
document.querySelector('.btn-glass').addEventListener('click', function(e) {
  const ripple = document.createElement('span');
  const rect = this.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  ripple.classList.add('ripple');
  
  this.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});`,
        tags: ["glass", "glassmorphism", "modern"]
      },
      {
        name: "Gradient Title",
        description: "Eye-catching gradient headline",
        categoryId: insertedCategories[1].id, // Headings
        html: `<h1 class="gradient-title">Amazing Title</h1>`,
        css: `.gradient-title {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}`,
        js: `// Add typing effect
const title = document.querySelector('.gradient-title');
const text = title.textContent;
title.textContent = '';

let i = 0;
function typeWriter() {
  if (i < text.length) {
    title.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 100);
  }
}
typeWriter();`,
        tags: ["gradient", "animation", "typing"]
      }
    ];

    const insertedComponents = await db.insert(components).values(sampleComponents).returning();
    console.log(`Created ${insertedComponents.length} sample components`);

    // Update category component counts
    await db.update(categories)
      .set({ componentCount: 2 })
      .where(eq(categories.id, insertedCategories[0].id));

    await db.update(categories)
      .set({ componentCount: 1 })
      .where(eq(categories.id, insertedCategories[1].id));

    console.log("Database seeding completed!");
  } else {
    console.log("Database already seeded, skipping...");
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };