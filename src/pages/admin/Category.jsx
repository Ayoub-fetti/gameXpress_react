import { useState, useEffect } from 'react';
import {Container,Typography,Box,Button,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,Dialog,DialogActions,DialogContent,DialogTitle,TextField,CircularProgress,Alert,Snackbar} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../../api/axios';
import * as yup from 'yup';

const categorySchema = yup.object().shape({
  name: yup.string().required('Category name is required').min(3, 'Name must be at least 3 characters'),
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
});

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/admin/categories');
      console.log('API Response:', response);
      
      // Check if the response data is an array directly or nested in data property
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setCategories([]);
        setError('Received unexpected data format from server');
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setFormData({ 
        name: category.name, 
        slug: category.slug || '' 
      });
      setCurrentCategoryId(category.id);
      setIsEditing(true);
    } else {
      setFormData({ name: '', slug: '' });
      setIsEditing(false);
      setCurrentCategoryId(null);
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      name: value,
      // Only auto-generate slug if user hasn't modified it or it's empty
      slug: prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/\s+/g, '-') 
        ? value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') 
        : prev.slug
    }));
    
    if (formErrors.name) {
      setFormErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const validateForm = async () => {
    try {
      await categorySchema.validate(formData, { abortEarly: false });
      return true;
    } catch (err) {
      const errors = {};
      err.inner.forEach(error => {
        errors[error.path] = error.message;
      });
      setFormErrors(errors);
      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      if (isEditing) {
        await api.put(`/v1/admin/categories/${currentCategoryId}`, formData);
        setNotification({
          open: true,
          message: 'Category updated successfully',
          severity: 'success'
        });
      } else {
        await api.post('/v1/admin/categories', formData);
        setNotification({
          open: true,
          message: 'Category added successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Failed to save category',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await api.delete(`/v1/admin/categories/${id}`);
      setNotification({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      });
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Failed to delete category',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Categories Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => handleOpenDialog()}
          >
            Add Category
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug || 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenDialog(category)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(category.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Category Form Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                error={!!formErrors.slug}
                helperText={formErrors.slug || "URL-friendly identifier (auto-generated from name)"}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Category;