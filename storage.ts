import { categories, components, type Category, type Component, type InsertCategory, type InsertComponent } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategoryComponentCount(categoryId: number, count: number): Promise<void>;

  // Component operations
  getComponents(): Promise<Component[]>;
  getComponentsByCategory(categoryId: number): Promise<Component[]>;
  getComponentById(id: number): Promise<Component | undefined>;
  createComponent(component: InsertComponent): Promise<Component>;
  updateComponent(id: number, component: Partial<Component>): Promise<Component | undefined>;
  deleteComponent(id: number): Promise<boolean>;
  searchComponents(query: string): Promise<Component[]>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private components: Map<number, Component>;
  private currentCategoryId: number;
  private currentComponentId: number;

  constructor() {
    this.categories = new Map();
    this.components = new Map();
    this.currentCategoryId = 1;
    this.currentComponentId = 1;
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default categories
    const defaultCategories = [
      { name: "Buttons", icon: "fas fa-hand-pointer", description: "Interactive button components" },
      { name: "Headings", icon: "fas fa-heading", description: "Typography and heading styles" },
      { name: "Sections", icon: "fas fa-layer-group", description: "Layout sections and containers" },
      { name: "Navigation", icon: "fas fa-bars", description: "Navigation bars and menus" },
      { name: "Sliders", icon: "fas fa-images", description: "Image carousels and sliders" },
      { name: "Footers", icon: "fas fa-shoe-prints", description: "Footer sections and layouts" },
      { name: "GSAP Animations", icon: "fas fa-magic", description: "GSAP powered animations" },
    ];

    defaultCategories.forEach(cat => {
      const id = this.currentCategoryId++;
      this.categories.set(id, { ...cat, id, componentCount: 0, description: cat.description });
    });

    // Add sample components for buttons category
    this.addSampleComponents();
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id, 
      componentCount: 0,
      description: insertCategory.description || null
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategoryComponentCount(categoryId: number, count: number): Promise<void> {
    const category = this.categories.get(categoryId);
    if (category) {
      category.componentCount = count;
      this.categories.set(categoryId, category);
    }
  }

  async getComponents(): Promise<Component[]> {
    return Array.from(this.components.values()).filter(c => c.isActive);
  }

  async getComponentsByCategory(categoryId: number): Promise<Component[]> {
    return Array.from(this.components.values()).filter(c => c.categoryId === categoryId && c.isActive);
  }

  async getComponentById(id: number): Promise<Component | undefined> {
    return this.components.get(id);
  }

  async createComponent(insertComponent: InsertComponent): Promise<Component> {
    const id = this.currentComponentId++;
    const component: Component = { 
      ...insertComponent, 
      id, 
      isActive: true,
      description: insertComponent.description || null,
      tags: insertComponent.tags || null
    };
    this.components.set(id, component);
    
    // Update category component count
    const categoryComponents = await this.getComponentsByCategory(component.categoryId);
    await this.updateCategoryComponentCount(component.categoryId, categoryComponents.length);
    
    return component;
  }

  async updateComponent(id: number, updates: Partial<Component>): Promise<Component | undefined> {
    const component = this.components.get(id);
    if (component) {
      const updated = { ...component, ...updates };
      this.components.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteComponent(id: number): Promise<boolean> {
    const component = this.components.get(id);
    if (component) {
      component.isActive = false;
      this.components.set(id, component);
      
      // Update category component count
      const categoryComponents = await this.getComponentsByCategory(component.categoryId);
      await this.updateCategoryComponentCount(component.categoryId, categoryComponents.length);
      
      return true;
    }
    return false;
  }

  async searchComponents(query: string): Promise<Component[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.components.values()).filter(c => 
      c.isActive && (
        c.name.toLowerCase().includes(searchTerm) ||
        c.description?.toLowerCase().includes(searchTerm) ||
        c.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    );
  }

  private addSampleComponents() {
    // Sample button components
    const buttonComponents = [
      {
        name: "Primary Button",
        description: "Modern primary action button",
        categoryId: 1,
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
        categoryId: 1,
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
        name: "Neon Button",
        description: "Cyberpunk neon glow button",
        categoryId: 1,
        html: `<button class="btn-neon">NEON</button>`,
        css: `.btn-neon {
  background: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px #00ffff;
}

.btn-neon:hover {
  background: #00ffff;
  color: #000;
  box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;
  text-shadow: 0 0 5px #000;
}`,
        js: `document.querySelector('.btn-neon').addEventListener('mouseenter', function() {
  this.style.animation = 'neonPulse 0.5s infinite alternate';
});

document.querySelector('.btn-neon').addEventListener('mouseleave', function() {
  this.style.animation = '';
});`,
        tags: ["neon", "cyberpunk", "glow"]
      }
    ];

    // Sample heading components
    const headingComponents = [
      {
        name: "Gradient Title",
        description: "Eye-catching gradient headline",
        categoryId: 2,
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

    // Add components to storage
    [...buttonComponents, ...headingComponents].forEach(comp => {
      const id = this.currentComponentId++;
      this.components.set(id, {
        ...comp,
        id,
        isActive: true,
        description: comp.description,
        tags: comp.tags
      });
    });

    // Update category counts
    this.updateCategoryComponentCount(1, buttonComponents.length);
    this.updateCategoryComponentCount(2, headingComponents.length);
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values({
        ...insertCategory,
        description: insertCategory.description || null
      })
      .returning();
    return category;
  }

  async updateCategoryComponentCount(categoryId: number, count: number): Promise<void> {
    await db
      .update(categories)
      .set({ componentCount: count })
      .where(eq(categories.id, categoryId));
  }

  async getComponents(): Promise<Component[]> {
    return await db.select().from(components).where(eq(components.isActive, true));
  }

  async getComponentsByCategory(categoryId: number): Promise<Component[]> {
    return await db
      .select()
      .from(components)
      .where(and(
        eq(components.categoryId, categoryId),
        eq(components.isActive, true)
      ));
  }

  async getComponentById(id: number): Promise<Component | undefined> {
    const [component] = await db.select().from(components).where(eq(components.id, id));
    return component || undefined;
  }

  async createComponent(insertComponent: InsertComponent): Promise<Component> {
    const [component] = await db
      .insert(components)
      .values({
        ...insertComponent,
        description: insertComponent.description || null,
        tags: insertComponent.tags || null
      })
      .returning();
    
    // Update category component count
    const categoryComponents = await this.getComponentsByCategory(component.categoryId);
    await this.updateCategoryComponentCount(component.categoryId, categoryComponents.length);
    
    return component;
  }

  async updateComponent(id: number, updates: Partial<Component>): Promise<Component | undefined> {
    const [component] = await db
      .update(components)
      .set(updates)
      .where(eq(components.id, id))
      .returning();
    return component || undefined;
  }

  async deleteComponent(id: number): Promise<boolean> {
    const component = await this.getComponentById(id);
    if (component) {
      await db
        .update(components)
        .set({ isActive: false })
        .where(eq(components.id, id));
      
      // Update category component count
      const categoryComponents = await this.getComponentsByCategory(component.categoryId);
      await this.updateCategoryComponentCount(component.categoryId, categoryComponents.length);
      
      return true;
    }
    return false;
  }

  async searchComponents(query: string): Promise<Component[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    const allComponents = await db.select().from(components).where(eq(components.isActive, true));
    
    return allComponents.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description?.toLowerCase().includes(query.toLowerCase()) ||
      c.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

// Use database storage when DATABASE_URL is available
export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemStorage();
