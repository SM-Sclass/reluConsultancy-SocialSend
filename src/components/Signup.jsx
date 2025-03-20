import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Eye, EyeOff } from "lucide-react";
import bcrypt from 'bcryptjs';
import { api } from '@/Services/Api';
import { auth, db } from '../lib/firebase/config';
import googleIcon from '../assets/google-icon.svg';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Form, FormField, FormItem, FormControl, FormMessage } from './ui/form';
import { Button } from './ui/button';

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

export const signUpApi = async (data) => {
  try {
    const response = await api.post("/auth/user_login", data);
    return {
      response: response.data,
      error: null
    };
  } catch (error) {
    console.error(error.response?.data?.result || error.message);
    return {
      response: null,
      error: error
    }
  }
}

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      agreeToTerms: false
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const saveUserToFirestore = async (userData) => {
    try {
      if (!userData || !userData.uid) {
        console.error('Invalid user object:', userData);
        return;
      }

      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, userData, { merge: true }); // Using merge to update existing data without overwriting
    } catch (err) {
      setError(err.message || 'Failed to save user data. Please try again.');
      // Don't throw error here to avoid blocking the authentication flow
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // Prepare API request data
      const body = {
        email: data.email,
        username: data.username,
      };
      
      // Call API to register user
      const apiResponse = await signUpApi(body);
      if(apiResponse.error){
        throw apiResponse.error;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      // Update profile with username
      await updateProfile(user, {
        displayName: data.username
      });

      // Hash password for storage
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Store additional user data in Firestore
      const userData = {
        user_id: apiResponse?.response?.user_id || '',
        uid: user.uid,
        email: data.email,
        displayName: data.username,
        password: hashedPassword,
        loginType: 'emailAndPassword',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await saveUserToFirestore(userData);
      navigate('/Social-Accounts');
    } catch (err) {
      setError(err.response?.data?.result || err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      const googleAuthResponse = await signInWithPopup(auth, provider);
      const user = googleAuthResponse.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // New user - register with API and create Firestore document
        const body = {
          email: user.email,
          username: user.displayName
        };
        
        const apiResponse = await signUpApi(body);
        console.log(apiResponse);
        if(apiResponse.error.status !== 400){
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
      } else {
        // Existing user - update information
        const existingUserData = userDoc.data();
        if (existingUserData.loginType === 'emailAndPassword') {
          // Update the existing entry with Google info
          await setDoc(
            userRef,
            {
              displayName: user.displayName || existingUserData.displayName || '',
              photoURL: user.photoURL || existingUserData.photoURL || '',
              loginType: 'google',
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      }

      navigate('/Social-Accounts');
    } catch (err) {
      setError(err.message || 'Failed to sign up with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-background p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-primary mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
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
            name="username"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Username"
                    className={` ${form.formState.errors.username ? 'border-red-500' : ''}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-start"/>
              </FormItem>
            )}
          />

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
                <FormMessage className="text-start"/>
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
                <FormMessage className="text-start"/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="mb-6">
                <div className="flex items-center">
                  <FormControl>
                    <Checkbox
                      id="agreeToTerms"
                      className={`mr-2 cursor-pointer ${form.formState.errors.agreeToTerms ? 'border-red-500' : ''}`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <label htmlFor="agreeToTerms" className="text-sm text-primary">
                    I agree to the social send privacy <a href="/agreement" className="text-blue-600 hover:underline">agreement</a>.
                  </label>
                </div>
                <FormMessage className="text-start"/>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white cursor-pointer py-3 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Creating Account...' : 'Signup'}
          </Button>
        </form>
      </Form>

      <div className="text-center my-4">Or</div>

      <div className="space-y-3">
        <Button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-md transition-colors cursor-pointer"
        >
          <img
            src={googleIcon}
            alt="Google Icon"
            className="w-5 h-5"
          />
          <span className='text-primary'>Signup with Google</span>
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-400">
          Already have an Account? <a href="/auth/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;