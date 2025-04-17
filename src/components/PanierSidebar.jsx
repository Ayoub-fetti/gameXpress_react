import { Box, Typography, Drawer, IconButton, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { ShoppingCart, Close, Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { Link as RouterLink } from 'react-router-dom';

const PanierSidebar = () => {
  const { 
    cartItems, 
    cartOpen, 
    setCartOpen, 
    removeFromCart, 
    updateQuantity,
    getCartTotal 
  } = useCart();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  return (
    <Drawer
      anchor="right"
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2" display="flex" alignItems="center">
            <ShoppingCart sx={{ mr: 1 }} />
            Your Cart
          </Typography>
          <IconButton onClick={() => setCartOpen(false)} aria-label="close cart">
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {cartItems.length === 0 ? (
          <Box textAlign="center" my={4}>
            <Typography>Your cart is empty</Typography>
            <Button 
              variant="contained" 
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => setCartOpen(false)}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ mb: 2 }}>
              {cartItems.map((item) => (
                <Box key={item.id}>
                  <ListItem sx={{ py: 2, px: 0 }}>
                    <Box 
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{ width: 60, height: 60, objectFit: 'cover', mr: 2, borderRadius: 1 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <ListItemText 
                        primary={item.name}
                        secondary={formatCurrency(item.price)}
                      />
                      <Box display="flex" alignItems="center" mt={1}>
                        <IconButton 
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1, minWidth: 30, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          color="error"
                          onClick={() => removeFromCart(item.id)}
                          sx={{ ml: 'auto' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>

            <Box mt={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1">Subtotal:</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {formatCurrency(getCartTotal())}
                </Typography>
              </Box>
              
              <Button
                component={RouterLink}
                to="/checkout"
                variant="contained" 
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                onClick={() => setCartOpen(false)}
              >
                Checkout
              </Button>
              
              <Button 
                variant="outlined"
                fullWidth
                size="large"
                sx={{ mt: 1 }}
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default PanierSidebar;