import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut as authSignOut,
  User,
  deleteUser as authDeleteUser,
} from 'firebase/auth';
import { auth } from '../firebase.config';
import { addNewUserIfNotFound } from '../db';
import { useMutation, useQueryClient } from 'react-query';
import { signInAnon } from '.';

export const useFirebaseAuth = () => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clear = () => {
    setAuthUser(null);
    setIsLoading(false);
  };

  const authStateChanged = async (user: User | null) => {
    setIsLoading(true);
    if (!user) {
      clear();
      return;
    }
    setAuthUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    });

    addNewUserIfNotFound(user);
    setIsLoading(false);
  };

  const signOut = async () => {
    try {
      await authSignOut(auth);
      clear();
    } catch (e) {
      console.error('Error loggin out: ', e);
    }
  };

  const deleteAuthUser = async () => {
    const currentuser = auth.currentUser as User;
    try {
      await authDeleteUser(currentuser);
    } catch (e) {
      console.error('Error deleting user: ', e);
    }
  };

  // Listen for Firebase Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    isLoading,
    signOut,
    deleteAuthUser,
  };
};

// Sign in Anonymously
export const useSignInAnon = () => {
  const queryClient = useQueryClient();
  return useMutation(signInAnon, {
    onSuccess: () => {
      // ✅ refetch lists after mutation is successfull
      queryClient.invalidateQueries(['users']);
    },
  });
};
