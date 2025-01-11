import React, { useState } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper,
  Snackbar,
  Alert,
  Card,
  CardMedia
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    img_url: "",
  });

  // State for image preview and validation
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  // Input handler with image URL validation
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));

    // Special handling for image URL
    if (name === 'img_url') {
      validateImageUrl(value);
    }
  };

  // Image URL validation
  const validateImageUrl = (url) => {
    // If URL is empty, reset preview
    if (!url) {
      setImagePreview('');
      return;
    }

    // Create an image to test URL
    const img = new Image();
    img.onload = () => {
      setImagePreview(url);
    };
    img.onerror = () => {
      setImagePreview('');
      setError({
        open: true,
        message: 'Invalid or unreachable image URL',
        severity: 'error'
      });
    };
    img.src = url;
  };

  // Close error snackbar
  const handleCloseError = () => {
    setError({ open: false, message: '', severity: 'error' });
  };

  // Submit handler
  const addData = async () => {
    // Validate required fields
    if (!inputs.title || !inputs.content) {
      setError({
        open: true,
        message: 'Title and content are required',
        severity: 'error'
      });
      return;
    }

    try {
      // Prepare blog data
      const blogData = {
        title: inputs.title,
        content: inputs.content,
        img_url: imagePreview || 'https://via.placeholder.com/350x200'
      };

      // Submit to backend
      const response = await axios.post("http://localhost:3001/add", blogData);
      
      // Success handling
      setError({
        open: true,
        message: 'Blog added successfully',
        severity: 'success'
      });

      // Navigate after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      console.error("Error adding blog:", err);
      setError({
        open: true,
        message: err.response?.data?.message || 'Failed to add blog post',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Add New Blog Post
          </Typography>

          {/* Title Input */}
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            name="title"
            value={inputs.title}
            onChange={inputHandler}
            sx={{ mb: 2 }}
            required
          />

          {/* Content Input */}
          <TextField
            fullWidth
            label="Content"
            variant="outlined"
            name="content"
            multiline
            rows={4}
            value={inputs.content}
            onChange={inputHandler}
            sx={{ mb: 2 }}
            required
          />

          {/* Image URL Input */}
          <TextField
            fullWidth
            label="Image URL (Optional)"
            variant="outlined"
            name="img_url"
            value={inputs.img_url}
            onChange={inputHandler}
            sx={{ mb: 2 }}
            placeholder="https://example.com/image.jpg"
          />

          {/* Image Preview */}
          {imagePreview && (
            <Card sx={{ mb: 2, maxWidth: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image={imagePreview}
                alt="Image Preview"
              />
            </Card>
          )}

          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={addData}
          >
            Submit Blog Post
          </Button>
        </Paper>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={error.open}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity={error.severity} 
          sx={{ width: '100%' }}
        >
          {error.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Add;