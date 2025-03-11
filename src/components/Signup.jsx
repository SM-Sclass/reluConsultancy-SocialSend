// src/components/SignupForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/config';
import { useNavigate } from 'react-router-dom';

// Zod schema for form validation
const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and privacy policy' })
  })
});

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      agreeToTerms: false
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      // Update profile with username
      await updateProfile(user, {
        displayName: data.username
      });
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: data.username,
        email: data.email,
        createdAt: new Date().toISOString(),
        // Add any other fields you want to store
      });
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: user.displayName || '',
        email: user.email,
        createdAt: new Date().toISOString(),
        authProvider: 'google'
      }, { merge: true });
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Google sign-up error:', err);
      setError(err.message || 'Failed to sign up with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignup = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: user.displayName || '',
        email: user.email,
        createdAt: new Date().toISOString(),
        authProvider: 'facebook'
      }, { merge: true });
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Facebook sign-up error:', err);
      setError(err.message || 'Failed to sign up with Facebook. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-gray-600 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className={`w-full p-3 border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            {...register('username')}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

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

        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeToTerms"
              className={`mr-2 ${errors.agreeToTerms ? 'border-red-500' : ''}`}
              {...register('agreeToTerms')}
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
              I agree to the social send privacy <a href="/agreement" className="text-blue-600 hover:underline">agreement</a>.
            </label>
          </div>
          {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {loading ? 'Creating Account...' : 'Signup'}
        </button>
      </form>

      <div className="text-center my-4">Or</div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleFacebookSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span className="text-blue-600">f</span>
          <span>Signup with Facebook</span>
        </button>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span className="text-red-500">G</span>
          <span>Signup with Google</span>
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an Account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;