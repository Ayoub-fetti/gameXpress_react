import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Chip, Button, CircularProgress, ImageList, ImageListItem, TextField } from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import axios from 'axios'; 
import { useCart } from '../../context/CartContext';

const API_BASE_URL = 'http://localhost:8000';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Get cart functions from context
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Use direct axios request without auth headers
        const response = await axios.get(`${API_BASE_URL}/api/v1/admin/products/${id}`);
        setProduct(response.data);
        
        if (response.data.category_id) {
          try {
            const categoryResponse = await axios.get(`${API_BASE_URL}/api/v1/admin/categories/${response.data.category_id}`);
            setCategory(categoryResponse.data);
          } catch (categoryErr) {
            console.error('Error fetching category:', categoryErr);
          }
        }
        
        if (response.data.images && response.data.images.length > 0) {
          const imageUrl = response.data.images[0].image_url;
          setSelectedImage(imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Unable to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };
  
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button component={Link} to="/" startIcon={<ArrowBack />}>
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Product not found
          </Typography>
          <Button component={Link} to="/" startIcon={<ArrowBack />}>
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBack />} 
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Main image */}
              <Box 
                component="img"
                src={selectedImage || '/placeholder-image.jpg'} 
                alt={product.name}
                sx={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: 400,
                  objectFit: 'contain',
                  mb: 2
                }}
              />
              
              {product.images && product.images.length > 0 && (
                <ImageList 
                  sx={{ width: '100%', maxHeight: 100 }} 
                  cols={product.images.length > 4 ? 4 : product.images.length} 
                  rowHeight={80}
                >
                  {product.images.map((image, index) => (
                    <ImageListItem 
                      key={index}
                      onClick={() => setSelectedImage(image.image_url.startsWith('http') 
                        ? image.image_url 
                        : `${API_BASE_URL}${image.image_url}`)}
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedImage === (image.image_url.startsWith('http') 
                          ? image.image_url 
                          : `${API_BASE_URL}${image.image_url}`) ? '2px solid #1976d2' : 'none',
                        borderRadius: 1
                      }}
                    >
                      <img
                        src={image.image_url.startsWith('http') ? image.image_url : `${API_BASE_URL}${image.image_url}`}
                        alt={`${product.name} - ${index}`}
                        loading="lazy"
                        style={{ height: 70, objectFit: 'contain' }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Paper>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              
              <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <Chip 
                  label={product.status === 'available' ? 'In Stock' : 'Out of Stock'} 
                  color={product.status === 'available' ? 'success' : 'error'}
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2">
                  Stock: {product.stock} units
                </Typography>
              </Box>

              <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                {formatCurrency(product.price)}
              </Typography>

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Category: {category ? category.name : 'Uncategorized'}
              </Typography>
              {/* Add quantity input field */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Quantity:
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  InputProps={{ inputProps: { min: 1, max: product.stock } }}
                  value={quantity}
                  onChange={handleQuantityChange}
                  sx={{ width: '80px' }}
                  disabled={product.status !== 'available' || product.stock === 0}
                />
              </Box>

              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<ShoppingCart />}
                disabled={product.status !== 'available'}
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetail;