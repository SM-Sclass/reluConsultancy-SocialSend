// src/components/LoginForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { useNavigate } from 'react-router-dom';

// Zod schema for form validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      const googleAuthResponse = await signInWithPopup(auth, provider);
      console.log('Google Auth Response:', googleAuthResponse);
      navigate('/Social-Accounts');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new FacebookAuthProvider();
      const facebookAuthResponse = await signInWithPopup(auth, provider);
      console.log('Facebook Auth Response:', facebookAuthResponse);
      navigate('/dashboard');
    } catch (err) {
      console.error('Facebook sign-in error:', err);
      setError(err.message || 'Failed to sign in with Facebook. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-secondary p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Welcome Back!</h2>
        {/* <p className="text-primary mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> */}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            {...register('email')}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4 relative">
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            {...register('password')}
          />
          <button 
            type="button" 
            className="absolute right-3 top-3 text-gray-400"
            onClick={() => {
              // Toggle password visibility logic would go here
            }}
          >
            👁️
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="mr-2"
              {...register('rememberMe')}
            />
            <label htmlFor="rememberMe" className="text-sm text-primary">Remember Me</label>
          </div>
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="text-center my-4">Or</div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleFacebookSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-muted border border-gray-300 py-3 rounded-md hover:bg-secondary transition-colors"
        >
          <span className="text-blue-600">f</span>
          <span>Login with Facebook</span>
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-muted border border-gray-300 py-3 rounded-md hover:bg-secondary transition-colors"
        >
          <span className="text-red-500">G</span>
          <span>Login with Google</span>
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-primary">
          Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;