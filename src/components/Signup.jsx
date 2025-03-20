// src/components/SignupForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  // updateProfile,
  // sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
  // FacebookAuthProvider
} from 'firebase/auth';
import { setDoc, doc, getDoc,serverTimestamp } from 'firebase/firestore';
import { Eye, EyeOff } from "lucide-react";
import bcrypt from 'bcryptjs';
import { api } from '@/Services/Api';
import { auth, db } from '../lib/firebase/config';
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
    return response.data;
  } catch (error) {
    console.error(error.response.data.result);
    throw error;
  }
}

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      await setDoc(userRef, userData); // Using merge to update existing data without overwriting
    } catch (err) {
      console.error('Error saving user data to Firestore:', err);
      setError(err.message || 'Failed to save user data. Please try again.');
      // Don't throw error here to avoid blocking the authentication flow
    }
    finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      // Create user with email and password
      const body = {
        email: data.email,
        username: data.username,
      }
      const response = await signUpApi(body);

      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      
      // Update profile with username
      await updateProfile(user, {
          displayName: data.username
      });

      // // Send email verification
      // await sendEmailVerification(user);

      const hashedPassword = await bcrypt.hash(data.password, 10);
      // Store additional user data in Firestore
      const userData = {
        user_id: response?.user_id || '',
        uid: user.uid,
        email: data.email,
        displayName: data.username,
        password: hashedPassword,
        loginType:'emailAndPassword',
        createdAt: serverTimestamp(),

        // Add any other fields you want to store 67dae45d6bc65459e42fedc4
      };
      await saveUserToFirestore(userData);

      navigate('/Social-Accounts');
    } catch (err) {
      // console.error('Signup error:', err);
      setError(err.response.data.result || 'Failed to create account. Please try again.');
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

      // Store user data in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        const body = {
          email: user.email,
          username: user.displayName
        }
        const response = await signUpApi(body);
        const userData = {
          user_id: response?.user_id || '',
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL || '',
          loginType:'google',
          createdAt: serverTimestamp(),
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
      // console.error('Google sign-up error:', err);
      setError(err.message || 'Failed to sign up with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const handleFacebookSignup = async () => {
  //   try {
  //     setLoading(true);
  //     setError('');
  //     const provider = new FacebookAuthProvider();
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;

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

  //     navigate('/Social-Accounts');
  //   } catch (err) {
  //     console.error('Facebook sign-up error:', err);
  //     setError(err.message || 'Failed to sign up with Facebook. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="max-w-md w-full bg-secondary p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-primary mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
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
            className={`w-full p-3 border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-500'}`}
            {...register('username')}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-500'}`}
            {...register('email')}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`w-full p-3 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-500'}`}
            {...register('password')}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
            <label htmlFor="agreeToTerms" className="text-sm text-primary">
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
        {/* <button
          type="button"
          onClick={handleFacebookSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-muted border border-muted py-3 rounded-md hover:bg-secondary transition-colors"
        >
          <span className="text-blue-600">f</span>
          <span>Signup with Facebook</span>
        </button> */}

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-muted border border-muted py-3 rounded-md hover:bg-secondary transition-colors"
        >
          <span className="text-red-500">G</span>
          <span>Signup with Google</span>
        </button>
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