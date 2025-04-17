import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Divider,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Alert
} from '@mui/material';
import {
    ShoppingBag,
    ArrowBackIos,
    LocalShipping,
    CreditCard,
    CheckCircleOutline
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CheckoutPreview = () => {

    const { user } = useAuth();
    const navigate = useNavigate();
    const {cartItems , cartTotals} = useCart();




    useEffect(() => {

    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };


    const handleProceedToPayment = () => {
        navigate('/checkout/payment');
    };

    if (cartItems.length === 0) {
        return null; // Will redirect via useEffect
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                    Checkout
                </Typography>
                <Typography color="text.secondary">
                    Review your order before payment
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Left side - Cart items */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <ShoppingBag sx={{ mr: 1 }} />
                            <Typography variant="h6">Order Summary</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <List disablePadding>
                            {cartItems.map((item) => (
                                <React.Fragment key={item.id}>
                                    <ListItem sx={{ py: 2, px: 1 }}>
                                        <ListItemAvatar>
                                            <Avatar
                                                variant="rounded"
                                                src={item.image}
                                                alt={item.name}
                                                sx={{ width: 80, height: 80, mr: 1, borderRadius: 1 }}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={`Quantity: ${item.quantity}`}
                                            primaryTypographyProps={{ fontWeight: 'medium' }}
                                            sx={{ ml: 1 }}
                                        />
                                        <Typography variant="body1" fontWeight="medium">
                                            {formatCurrency(item.price * item.quantity)}
                                        </Typography>
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))}
                        </List>

                        <Box display="flex" mt={3}>
                            <Button
                                startIcon={<ArrowBackIos />}
                                component={Link}
                                to="/"
                                sx={{ textTransform: 'none' }}
                            >
                                Continue Shopping
                            </Button>
                        </Box>
                    </Paper>

                    {/* Shipping info */}
                    {user && (
                        <Paper sx={{ p: 3 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <LocalShipping sx={{ mr: 1 }} />
                                <Typography variant="h6">Shipping Information</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="body1">
                                {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {user.email}
                            </Typography>
                            {/* Add shipping address fields if available */}
                            <Typography variant="body2" color="text.secondary">
                                Shipping address will be requested at the next step.
                            </Typography>
                        </Paper>
                    )}
                </Grid>

                {/* Right side - Order summary */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Total
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body1">Subtotal</Typography>
                            <Typography variant="body1">
                                {formatCurrency(cartTotals.subtotal)}
                            </Typography>
                        </Box>

                        {cartTotals.tax && (
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body1">Tax</Typography>
                                <Typography variant="body1">
                                    {formatCurrency(cartTotals.tax)}
                                </Typography>
                            </Box>
                        )}

                        {cartTotals.discount > 0 && (
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body1">Discount</Typography>
                                <Typography variant="body1" color="success.main">
                                    -{formatCurrency(cartTotals.discount)}
                                </Typography>
                            </Box>
                        )}

                        <Box display="flex" justifyContent="space-between" mt={2} mb={3}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6" fontWeight="bold">
                                {formatCurrency(cartTotals.total)}
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            startIcon={<CreditCard />}
                            onClick={handleProceedToPayment}
                            sx={{ mb: 2 }}
                        >
                            Proceed to Payment
                        </Button>

                        <Alert severity="info" icon={<CheckCircleOutline />} sx={{ mt: 2 }}>
                            Your order is eligible for free shipping.
                        </Alert>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CheckoutPreview;