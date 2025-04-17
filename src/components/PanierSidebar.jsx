import { Box, Typography, Drawer, IconButton, List, ListItem, ListItemText, Divider, Button, TextField } from '@mui/material';
import { ShoppingCart, Close, Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const PanierSidebar = () => {
  const { 
    cartItems, 
    cartOpen, 
    setCartOpen, 
    removeFromCart, 
    updateQuantity,
    getCartTotal,
    cartTotals,
    applyPromoCode  // Import the new function
  } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  // Handle promo code submission
  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    const result = await applyPromoCode(promoCode);
    setPromoMessage({
      text: result.message,
      type: result.success ? 'success' : 'error'
    });
    
    // Clear the message after a few seconds
    setTimeout(() => {
      setPromoMessage(null);
    }, 5000);
  };

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

            {/* Promo Code Section */}
            <Box mt={3} mb={2}>
              <Typography variant="subtitle1">Promo Code</Typography>
              <Box display="flex" mt={1}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  sx={{ mr: 1 }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleApplyPromoCode}
                  disabled={!promoCode.trim()}
                >
                  Apply
                </Button>
              </Box>
              {promoMessage && (
                <Typography 
                  color={promoMessage.type === 'success' ? 'success.main' : 'error.main'} 
                  variant="body2" 
                  mt={1}
                >
                  {promoMessage.text}
                </Typography>
              )}
            </Box>

            <Box mt={3}>
              {/* Order Summary Section with Tax Information */}
              <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>
              
              <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(cartTotals.subtotal || getCartTotal())}
                  </Typography>
                </Box>
                
                {cartTotals.discount > 0 && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Discount:</Typography>
                    <Typography variant="body2" fontWeight="medium" color="error.main">
                      -{formatCurrency(cartTotals.discount)}
                    </Typography>
                  </Box>
                )}
                
                {cartTotals.tax > 0 && (
                  <>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Tax ({cartTotals.tax_rate}%):</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(cartTotals.tax)}
                      </Typography>
                    </Box>
                  </>
                )}
                
                <Divider sx={{ my: 1 }} />
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {formatCurrency(cartTotals.total || getCartTotal())}
                  </Typography>
                </Box>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
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