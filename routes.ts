import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertComponentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Component routes
  app.get("/api/components", async (req, res) => {
    try {
      const { categoryId, search } = req.query;
      
      if (search && typeof search === 'string') {
        const components = await storage.searchComponents(search);
        res.json(components);
      } else if (categoryId) {
        const components = await storage.getComponentsByCategory(parseInt(categoryId as string));
        res.json(components);
      } else {
        const components = await storage.getComponents();
        res.json(components);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch components" });
    }
  });

  app.post("/api/components", async (req, res) => {
    try {
      const componentData = insertComponentSchema.parse(req.body);
      const component = await storage.createComponent(componentData);
      res.status(201).json(component);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid component data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create component" });
      }
    }
  });

  app.get("/api/components/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const component = await storage.getComponentById(id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      res.json(component);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch component" });
    }
  });

  app.put("/api/components/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const component = await storage.updateComponent(id, updates);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      res.json(component);
    } catch (error) {
      res.status(500).json({ message: "Failed to update component" });
    }
  });

  app.delete("/api/components/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteComponent(id);
      if (!success) {
        return res.status(404).json({ message: "Component not found" });
      }
      res.json({ message: "Component deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete component" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
