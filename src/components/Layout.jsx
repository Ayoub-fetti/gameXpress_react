import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const {isAuthenticated, logout, hasRole } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            E-Commerce
          </Typography>
          {isAuthenticated ? (
            <>
              {hasRole(['super_admin', 'product_manager']) ? (
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
              ) : null}
              {hasRole(['super_admin', 'product_manager']) ? (
                <Button color="inherit" component={Link} to="/categories">
                  Categories
                </Button>
              ) : null}
              {hasRole(['super_admin', 'product_manager']) ? (
                <Button color="inherit" component={Link} to="/products">
                  Products
                </Button>
              ) : null}
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;