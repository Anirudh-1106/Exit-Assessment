const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("./connection");
const BlogModel = require("./model");

const app = express();
var PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Ensure this matches your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// POST route with comprehensive error handling
app.post("/add", async (req, res) => {
  try {
    console.log("Received blog data:", req.body); // Logging incoming data

    const { title, content, img_url } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ 
        message: "Title and content are required" 
      });
    }

    // Create new blog with optional image
    const newBlog = new BlogModel({
      title, 
      content, 
      img_url: img_url || 'https://via.placeholder.com/350x200'
    });

    // Save blog to database
    const savedBlog = await newBlog.save();
    
    res.status(201).json({ 
      message: "Blog posted successfully", 
      blog: savedBlog 
    });
  } catch (error) {
    console.error("Error adding blog:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
});

// GET route for fetching blogs
app.get("/posts", async (req, res) => {
  try {
    const blogs = await BlogModel.find();
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ 
      message: "Error fetching blogs", 
      error: error.message 
    });
  }
});

// Delete route
app.delete("/delete/:id", async (req, res) => {
  try {
    const deletedBlog = await BlogModel.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ 
      message: "Error deleting blog", 
      error: error.message 
    });
  }
});


// Update route
app.put("/update/:id", async (req, res) => {
  try {
    console.log("Received update request:", req.params, req.body);

    const { id } = req.params;
    const { title, content, img_url } = req.body;

    // Validate required fields
    if (!title || !content) {
      console.error("Validation Error: Title and content are required");
      return res.status(400).json({ 
        message: "Title and content are required" 
      });
    }

    // Prepare update data
    const updateData = {
      title, 
      content, 
      img_url: img_url || 'https://via.placeholder.com/350x200'
    };

    // Find and update the blog post
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id, 
      updateData,
      { 
        new: true,  // Return the updated document
        runValidators: true // Run model validations
      }
    );

    // Check if blog was found and updated
    if (!updatedBlog) {
      console.error(`Blog not found with ID: ${id}`);
      return res.status(404).json({ message: "Blog not found" });
    }

    console.log("Blog updated successfully:", updatedBlog);

    res.json({ 
      message: "Blog updated successfully", 
      blog: updatedBlog 
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});