


import React, { useState, useEffect } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Container, 
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import axios from "axios";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:3001/posts");
        setBlogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/delete/${id}`);
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // Open edit dialog
  const handleEditOpen = (blog) => {
    setEditingBlog({...blog});
  };

  // Close edit dialog
  const handleEditClose = () => {
    setEditingBlog(null);
  };

  // Handle input change in edit dialog
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingBlog(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save edited blog
  const handleEditSave = async () => {
    try {
      const { _id, title, content, img_url } = editingBlog;
      
      // Update blog
      const response = await axios.put(`http://localhost:3001/update/${_id}`, {
        title,
        content,
        img_url
      });

      // Update blogs list
      setBlogs(blogs.map(blog => 
        blog._id === _id ? response.data.blog : blog
      ));

      // Close dialog
      handleEditClose();
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  // Fallback image function
  const getFallbackImage = (blog) => {
    return blog.img_url || 'https://via.placeholder.com/350x200';
  };

  if (loading) return (
    <Container maxWidth="lg">
      <CircularProgress />
    </Container>
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Blog Posts
      </Typography>
      <Grid container spacing={2}>
        {blogs.map(blog => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Card sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%' 
            }}>
              <CardMedia
                component="img"
                height="200"
                image={getFallbackImage(blog)}
                alt={blog.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div">
                  {blog.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {blog.content.length > 100 
                    ? blog.content.substring(0, 100) + '...' 
                    : blog.content}
                </Typography>
              </CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                p: 2 
              }}>
                <Button 
                  variant="contained" 
                  color="error" 
                  size="small"
                  onClick={() => handleDelete(blog._id)}
                >
                  Delete
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="small"
                  onClick={() => handleEditOpen(blog)}
                >
                  Update
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      {editingBlog && (
        <Dialog 
          open={!!editingBlog} 
          onClose={handleEditClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Blog Post</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Title"
              name="title"
              value={editingBlog.title}
              onChange={handleEditChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Content"
              name="content"
              multiline
              rows={4}
              value={editingBlog.content}
              onChange={handleEditChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Image URL"
              name="img_url"
              value={editingBlog.img_url || ''}
              onChange={handleEditChange}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Home;
