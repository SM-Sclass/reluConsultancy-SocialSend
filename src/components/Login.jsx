// src/components/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  // FacebookAuthProvider
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { Eye, EyeOff } from "lucide-react";
import { signUpApi } from './Signup';
import { auth, db } from '../lib/firebase/config';
import { Checkbox } from './ui/checkbox';
import googleIcon from '../assets/google-icon.svg';
import { Input } from './ui/input';
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from './ui/form';
import { Button } from './ui/button';

// Zod schema for form validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});


const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const saveUserToFirestore = async (userData) => {
    try {
      if (!userData || !userData.uid) {
        console.error('Invalid user object:', user);
        return;
      }

      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, userData, { merge: true }); // Using merge to update existing data without overwriting
    } catch (err) {
      setError(err.message || 'Failed to save user data. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await signInWithEmailAndPassword(auth, data.email, data.password);

      navigate('/Social-Accounts'); // Redirect to dashboard after successful login
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
      const user = googleAuthResponse.user;

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        const body = {
          email: user.email,
          username: user.displayName
        }
        const apiResponse = await signUpApi(body);
        if (apiResponse.error && apiResponse.error.status !== 400) {
          throw apiResponse.error;
        }
        const userData = {
          user_id: apiResponse?.error?.response?.data?.user_id || '',
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL || '',
          loginType: 'google',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await saveUserToFirestore(userData);
      }
      else {
        const existingUserData = userDoc.data();
        if (existingUserData.loginType === 'emailAndPassword') {
          // Update the existing entry with photoURL and displayName
          await setDoc(
            userRef,
            {
              displayName: user.displayName || existingUserData.displayName || '',
              photoURL: user.photoURL || existingUserData.photoURL || '',
              loginType: 'google', // Update the loginType to Google
              updatedAt: serverTimestamp(),
            },
            { merge: true } // Merge with existing data
          );
        }
      }

      navigate('/Social-Accounts');
    } catch (err) {
      // console.error('Google sign-in error:', err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const handleFacebookSignIn = async () => {
  //   try {
  //     setLoading(true);
  //     setError('');
  //     const provider = new FacebookAuthProvider();
  //     const facebookAuthResponse = await signInWithPopup(auth, provider);
  //     const user = facebookAuthResponse.user;

  //     const userRef = doc(db, 'users', user.uid);
  //     const userDoc = await getDoc(userRef);
  //     if (!userDoc.exists()) {
  //       const body = {
  //         email: user.email,
  //         username: user.displayName
  //       }
  //       const response = await signUpApi(body);
  //       const userData = {
  //         user_id: response.user_id,
  //         uid: user.uid,
  //         email: user.email || '',
  //         displayName: user.displayName || '',
  //         photoURL: user.photoURL || '',
  //         lastLogin: serverTimestamp(),
  //         updatedAt: serverTimestamp()
  //       };
  //       await saveUserToFirestore(userData);
  //     }

  //     navigate('/dashboard');
  //   } catch (err) {
  //     console.error('Facebook sign-in error:', err);
  //     setError(err.message || 'Failed to sign in with Facebook. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="max-w-md w-full bg-background p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Welcome Back!</h2>
        {/* <p className="text-primary mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> */}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    className={` ${form.formState.errors.email ? 'border-red-500' : ''}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4 relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`${form.formState.errors.password ? 'border-red-500' : ''}`}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-1 top-0 text-primary bg-transparent hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </Button>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between mb-6">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormControl>
                    <Checkbox
                      id="rememberMe"
                      className={`mr-2 cursor-pointer ${form.formState.errors.agreeToTerms ? 'border-red-500' : ''}`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel htmlFor="rememberMe" className="text-sm text-gray-500">Remember me</FormLabel>
                </div>
                <FormMessage className="text-start"/>
              </FormItem>
            )}
          />
            <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white cursor-pointer rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>
      <div className="text-center my-4">Or</div>

      <div className="space-y-3">
        {/* <button
          type="button"
          onClick={handleFacebookSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-muted border border-muted py-3 rounded-md hover:bg-secondary transition-colors"
        >
          <span className="text-blue-600">f</span>
          <span>Login with Facebook</span>
        </button> */}

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2 cursor-pointer rounded-md transition-colors"
        >
          <img
            src={googleIcon}
            className="w-5 h-5"
            alt="Google Icon"
          />
          <span className='text-primary'>Login with Google</span>
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-primary">
          Don't have an account? <a href="/auth/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;