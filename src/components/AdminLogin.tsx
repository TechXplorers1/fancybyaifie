import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// 1. Import Firebase Authentication function and the auth instance
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Assuming your firebase config is in src/firebase.ts

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState(''); // This will act as the email for Firebase
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleSubmit = async (e: React.FormEvent) => { // 2. Made handleSubmit async
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true); // Start loading

    // 3. Firebase Authentication Logic
    try {
      // In a real-world scenario, the username field would typically be an email address
      await signInWithEmailAndPassword(auth, username, password);
      // Successful login
      onLogin();
    } catch (err: any) {
      // Failed login
      console.error("Login error:", err);
      // Display a user-friendly error message based on the Firebase error code
      let errorMessage = 'Login failed. Please check your credentials.';

      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'The email address format is invalid.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Fancybyaifie Admin</CardTitle>
          <CardDescription className="text-center">
            Sign in to manage your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username (Email)</Label>
              <Input
                id="username"
                type="email" // Changed to 'email' type for better mobile keyboard and Firebase compatibility
                placeholder="Enter email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gray-900 text-white hover:bg-gray-800" 
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <p className="text-xs text-center text-gray-500 mt-4">
              {/* This demo message should be removed or updated for a real Firebase setup */}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}