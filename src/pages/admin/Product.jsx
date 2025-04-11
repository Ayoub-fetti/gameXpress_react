import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import {Container,Typography,Box,Button,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TextField,FormControl,InputLabel,Select,MenuItem,Grid,CircularProgress,IconButton,Chip} from '@mui/material';
import { Add, Edit, Delete, CloudUpload } from '@mui/icons-material';

const API_URL = '/v1/admin/products';
const CATEGORIES_URL = '/v1/admin/categories';

// validation with yup
const productSchema = Yup.object().shape({
  name: Yup.string().required('Le nom est obligatoire'),
  slug: Yup.string().required('Le slug est obligatoire'),
  price: Yup.number().required('Le prix est obligatoire').min(0, 'Le prix doit être positif'),
  stock: Yup.number().integer('Le stock doit être un nombre entier').min(0, 'Le stock doit être positif').required('Le stock est obligatoire'),
  status: Yup.string().oneOf(['available', 'out_of_stock'], 'Statut invalide').required('Le statut est obligatoire'),
  category_id: Yup.number().required('La catégorie est obligatoire'),
});

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    onDrop: acceptedFiles => {
      const newFiles = acceptedFiles.map(file => 
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
      setImageFiles(prev => [...prev, ...newFiles]);
    }
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      price: '',
      stock: '',
      status: 'available',
      category_id: '',
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      
      try {
        const formData = new FormData();
        
        // Ajouter les valeurs du formulaire au FormData
        Object.keys(values).forEach(key => {
          formData.append(key, values[key]);
        });
        
        // Ajouter l'image principale
        if (imageFiles.length > 0) {
          formData.append('image', imageFiles[primaryImageIndex]);
        }
        
        if (isEditing) {
          // Mise à jour d'un produit existant
          await api.post(`${API_URL}/${currentProductId}?_method=PUT`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          toast.success('Produit mis à jour avec succès');
        } else {
          // Création d'un nouveau produit
          await api.post(API_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          toast.success('Produit créé avec succès');
        }
        
        // Réinitialiser le formulaire et l'état
        formik.resetForm();
        setImageFiles([]);
        setIsEditing(false);
        setCurrentProductId(null);
        fetchProducts();
      } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        toast.error(error.response?.data?.message || 'Erreur lors de la soumission du formulaire');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Chargement initial des données
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get(API_URL);
      console.log('Product API response:', response.data);
      
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setProducts([]);
        toast.error('Format de données inattendu');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      toast.error('Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get(CATEGORIES_URL);
      
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        console.error('Unexpected categories format:', response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      toast.error('Impossible de charger les catégories');
    }
  };

  const handleEdit = async (productId) => {
    try {
      const response = await api.get(`${API_URL}/${productId}`);
      const product = response.data;
      
      formik.setValues({
        name: product.name,
        slug: product.slug,
        price: product.price,
        stock: product.stock,
        status: product.status,
        category_id: product.category_id,
      });
      
      if (product.images && product.images.length > 0) {
        setProductImages(product.images);
      }
      
      setIsEditing(true);
      setCurrentProductId(productId);
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      toast.error('Impossible de charger les détails du produit');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try {
        await api.delete(`${API_URL}/${productId}`);
        fetchProducts();
        toast.success('Produit supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Impossible de supprimer le produit');
      }
    }
  };

  // Gestion des thumbnails d'images
  const renderThumbnails = () => {
    const allImages = [
      ...imageFiles.map(file => ({ type: 'new', src: file.preview })),
      ...productImages.map(img => ({ type: 'existing', src: img.image_url, id: img.id }))
    ];

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
        {allImages.map((image, idx) => (
          <Box
            key={idx}
            sx={{position: 'relative',border: 1,borderColor: idx === primaryImageIndex ? 'primary.main' : 'grey.300',
              borderRadius: 1,
              p: 0.5,
              bgcolor: idx === primaryImageIndex ? 'primary.50' : 'transparent'
            }}
          >
            <Box
              component="img"
              src={image.src}
              alt={`Thumbnail ${idx}`}
              sx={{ height: 80, width: 80, objectFit: 'cover' }}
            />
            <Box sx={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => setPrimaryImageIndex(idx)}
                title="Définir comme image principale"
                sx={{ width: 24, height: 24, fontSize: '0.65rem' }}
              >
                P
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  if (image.type === 'new') {
                    setImageFiles(prev => prev.filter((_, i) => i !== idx));
                  } else {
                    setProductImages(prev => prev.filter(img => img.id !== image.id));
                  }
                }}
                title="Supprimer l'image"
                sx={{ width: 24, height: 24, fontSize: '0.65rem' }}
              >
                X
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    );
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
            {isEditing ? 'Modifier un produit' : 'Ajouter un produit'}
          </Typography>
        </Box>

        {/* Formulaire pour ajouter/modifier un produit */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Nom"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="slug"
                  name="slug"
                  label="Slug"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.slug && Boolean(formik.errors.slug)}
                  helperText={formik.touched.slug && formik.errors.slug}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  label="Prix"
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="stock"
                  name="stock"
                  label="Stock"
                  type="number"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.stock && Boolean(formik.errors.stock)}
                  helperText={formik.touched.stock && formik.errors.stock}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Statut</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                    label="Statut"
                  >
                    <MenuItem value="available">Disponible</MenuItem>
                    <MenuItem value="out_of_stock">Rupture de stock</MenuItem>
                  </Select>
                  {formik.touched.status && formik.errors.status && (
                    <Typography color="error" variant="caption">{formik.errors.status}</Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="category-label">Catégorie</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category_id"
                    name="category_id"
                    value={formik.values.category_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.category_id && Boolean(formik.errors.category_id)}
                    label="Catégorie"
                  >
                    <MenuItem value="">
                      <em>Sélectionnez une catégorie</em>
                    </MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                  {formik.touched.category_id && formik.errors.category_id && (
                    <Typography color="error" variant="caption">{formik.errors.category_id}</Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Images du produit</Typography>
                <Paper
                  {...getRootProps()}
                  variant="outlined"
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUpload color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography>Glissez-déposez des images ici, ou cliquez pour sélectionner des fichiers</Typography>
                  <Typography variant="caption" color="textSecondary">Formats acceptés: JPG, JPEG, PNG, GIF (max: 2MB)</Typography>
                </Paper>
                
                {/* Affichage des miniatures d'images */}
                {(imageFiles.length > 0 || productImages.length > 0) && renderThumbnails()}
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              {isEditing && (
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => {
                    formik.resetForm();
                    setIsEditing(false);
                    setCurrentProductId(null);
                    setImageFiles([]);
                    setProductImages([]);
                  }}
                  sx={{ mr: 2 }}
                >
                  Annuler
                </Button>
              )}
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </Box>
          </Box>
        </Paper>
        
        {/* Tableau des produits existants */}
        <Typography variant="h5" component="h2" gutterBottom>
          Liste des produits
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Prix</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length > 0 ? (
                products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price}€</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.status === 'available' ? 'Disponible' : 'Rupture de stock'}
                        color={product.status === 'available' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(product.id)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(product.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Aucun produit trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Product;