import React, { useState } from 'react';
import { Box,Button,Container,FormControl,IconButton,InputAdornment,InputLabel,OutlinedInput,Paper,Stack,TextField,Typography,Link,Avatar,Snackbar,Alert,CircularProgress,alpha,useTheme } from '@mui/material';
import { Visibility,VisibilityOff,PersonAdd as PersonAddIcon,Person as PersonIcon,Email as EmailIcon,Lock as LockIcon } from '@mui/icons-material';
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import db, { auth } from '../Components/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'error' });
  const theme = useTheme();

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return '📧 This email is already registered. Please use a different email or sign in.';
      case 'auth/invalid-email':
        return '📧 Please enter a valid email address.';
      case 'auth/weak-password':
        return '🔒 Password is too weak. Please use at least 6 characters.';
      case 'auth/operation-not-allowed':
        return '🚫 Email/password accounts are not enabled. Please contact support.';
      case 'auth/network-request-failed':
        return '🌐 Network error. Please check your internet connection and try again.';
      case 'auth/too-many-requests':
        return '🛑 Too many requests. Please wait a moment and try again.';
      case 'username-taken':
        return '👤 That username is already taken. Please choose a different username.';
      case 'firestore-error':
        return '💾 Error saving user data. Please try again.';
      default:
        return '❌ Something went wrong. Please try again or contact support if the problem persists.';
    }
  };

  const showToast = (message, severity = 'error') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userTaken = false;

      // Check if username is taken
      const querySnapshot = await getDocs(query(collection(db, 'Users')));
      querySnapshot.forEach((doc) => {
        if(doc.data().userName.toUpperCase() === name.toUpperCase()) {
          userTaken = true;
        }
      });

      if (userTaken) {
        showToast(getErrorMessage('username-taken'), 'error');
        setLoading(false);
        return;
      }

      // Create user account
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      
      if (user) {
        // Save user data to Firestore
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          userName: name
        });
        
        localStorage.setItem('loggedIn', name);
        showToast('🎉 Account created successfully! Welcome aboard!', 'success');
        
        setTimeout(() => {
          window.location.assign('/');
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      showToast(getErrorMessage(error.code || 'unknown'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 2, sm: 4 }
      }}
    >
      <Paper
        elevation={12}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          border: `1px solid ${alpha(theme.palette.success.main, 0.08)}`
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            color: 'white',
            py: 6,
            px: 4,
            textAlign: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.6
            }
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              bgcolor: alpha('#ffffff', 0.15),
              backdropFilter: 'blur(10px)',
              border: `2px solid ${alpha('#ffffff', 0.2)}`
            }}
          >
            <PersonAddIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              position: 'relative',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Join Us Today
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.9,
              position: 'relative'
            }}
          >
            Create your account to get started
          </Typography>
        </Box>

        {/* Form */}
        <Box sx={{ p: 5 }}>
          <Box 
            component="form" 
            onSubmit={handleSignUp}
            sx={{ mt: 1 }}
          >
            <Stack spacing={4}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.success.main,
                        borderWidth: 2,
                      }
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.success.main, 0.12)}`,
                    }
                  }
                }}
              />

              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.success.main,
                        borderWidth: 2,
                      }
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.success.main, 0.12)}`,
                    }
                  }
                }}
              />

              <FormControl 
                fullWidth 
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.success.main,
                        borderWidth: 2,
                      }
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.success.main, 0.12)}`,
                    }
                  }
                }}
              >
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            bgcolor: alpha(theme.palette.success.main, 0.04)
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #43a047 0%, #5cb860 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(76, 175, 80, 0.4)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                  '&:disabled': {
                    background: theme.palette.grey[300],
                    boxShadow: 'none',
                    transform: 'none'
                  }
                }}
              >
                {loading ? (
                  <Box display="flex" alignItems="center" gap={2}>
                    <CircularProgress size={20} color="inherit" />
                    Creating Account...
                  </Box>
                ) : (
                  'Create Account'
                )}
              </Button>
            </Stack>
          </Box>

          {/* Footer */}
          <Box 
            sx={{ 
              mt: 4, 
              pt: 3,
              borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link 
                href="/login" 
                sx={{ 
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  color: theme.palette.success.main,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: theme.palette.success.dark
                  }
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Security Note */}
        <Box 
          sx={{ 
            px: 4, 
            py: 3, 
            bgcolor: alpha(theme.palette.success.main, 0.04),
            borderTop: `1px solid ${alpha(theme.palette.success.main, 0.08)}`
          }}
        >
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontSize: '0.75rem',
              display: 'block',
              textAlign: 'center'
            }}
          >
            🔒 Your data is protected with Firebase security
          </Typography>
        </Box>
      </Paper>

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            borderRadius: 2
          }
        }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: 3,
            '& .MuiAlert-icon': {
              fontSize: '1.2rem'
            }
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}