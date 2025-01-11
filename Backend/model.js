const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'], 
    trim: true 
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'], 
    trim: true 
  },
  img_url: { 
    type: String, 
    default: 'https://via.placeholder.com/350x200',
    validate: {
      validator: function(v) {
        // Optional URL validation
        return v === '' || /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(v);
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  }
}, { 
  timestamps: true 
});

const BlogModel = mongoose.model("Blog", blogSchema);
module.exports = BlogModel;