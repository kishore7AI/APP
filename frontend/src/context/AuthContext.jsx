import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '../auth';
import { authApi } from '../api/client';

const SAVED_ACCOUNTS_KEY = 'nxtlearnn_saved_accounts';
const ACTIVE_USER_KEY = 'nxtlearnn_active_user';

export const getSavedAccounts = () => {
  try {
    const raw = localStorage.getItem(SAVED_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveAccountToDevice = (account) => {
  if (!account || !account.email) return;
  try {
    const existing = getSavedAccounts();
    const cleanAccount = {
      id: account.id || account.email,
      name: account.name || account.email.split('@')[0],
      email: account.email.toLowerCase(),
      image: account.image || null,
      role: account.role || (account.email.startsWith('admin@') ? 'admin' : 'student'),
      lastLogin: new Date().toISOString(),
    };
    const updated = [
      cleanAccount,
      ...existing.filter((a) => a.email.toLowerCase() !== cleanAccount.email),
    ];
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated.slice(0, 5)));
    return cleanAccount;
  } catch (e) {
    console.warn('Failed to save account to device:', e);
  }
};

export const removeAccountFromDevice = (email) => {
  try {
    const existing = getSavedAccounts();
    const updated = existing.filter((a) => a.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to remove account from device:', e);
    return [];
  }
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check active Neon Better Auth session or active device session
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const result = await authClient.getSession();
        if (isMounted && result?.data?.session && result?.data?.user) {
          setSession(result.data.session);
          setUser(result.data.user);
          saveAccountToDevice(result.data.user);
          localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(result.data.user));

          // Ensure backend JWT token is synced for API calls
          const userEmail = result.data.user.email;
          if (userEmail) {
            authApi.syncSession({
              email: userEmail,
              full_name: result.data.user.name || result.data.user.full_name,
              avatar_url: result.data.user.image || result.data.user.avatar_url,
            })
              .then((res) => { if (res?.access_token) localStorage.setItem('nxtlearnn_token', res.access_token); })
              .catch((err) => console.warn('Token sync notice:', err?.message));
          }
          return;
        }

        // If no server session cookie, check if there is an active local user session
        const storedActive = localStorage.getItem(ACTIVE_USER_KEY);
        if (storedActive && isMounted) {
          const parsed = JSON.parse(storedActive);
          if (parsed && parsed.email) {
            setUser(parsed);
            setSession({ user: parsed, expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() });

            // Ensure backend JWT token is synced
            authApi.syncSession({
              email: parsed.email,
              full_name: parsed.name || parsed.full_name,
              avatar_url: parsed.image || parsed.avatar_url,
            })
              .then((res) => { if (res?.access_token) localStorage.setItem('nxtlearnn_token', res.access_token); })
              .catch((err) => console.warn('Token sync notice:', err?.message));
          }
        }
      } catch (err) {
        console.warn('Neon Better Auth: session check notice', err?.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Programmatic Email + Password Signup
  const signupWithEmail = async (fullName, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const result = await authClient.signUp.email({
      name: fullName || cleanEmail.split('@')[0] || 'Student',
      email: cleanEmail,
      password,
    });

    if (result?.error) {
      throw new Error(result.error.message || 'Signup failed');
    }

    // Refresh session state
    const sessionResult = await authClient.getSession();
    const newUser = sessionResult?.data?.user || result?.data?.user || {
      name: fullName,
      email: cleanEmail,
      role: 'student',
    };

    // Sync with FastAPI backend API
    try {
      const backendRes = await authApi.signup({
        email: cleanEmail,
        password,
        full_name: fullName || cleanEmail.split('@')[0] || 'Student',
      });
      if (backendRes?.access_token) {
        localStorage.setItem('nxtlearnn_token', backendRes.access_token);
      }
    } catch (e) {
      console.warn('Backend signup sync notice:', e?.message);
    }

    setSession(sessionResult?.data?.session || { user: newUser });
    setUser(newUser);
    saveAccountToDevice(newUser);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newUser));

    return newUser;
  };

  // Programmatic Email + Password Login (For first time on device or new account)
  const loginWithEmail = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const result = await authClient.signIn.email({
      email: cleanEmail,
      password,
    });

    if (result?.error) {
      throw new Error(result.error.message || 'Login failed');
    }

    // Sync with FastAPI backend to receive JWT token
    try {
      const backendRes = await authApi.login({ email: cleanEmail, password });
      if (backendRes?.access_token) {
        localStorage.setItem('nxtlearnn_token', backendRes.access_token);
      }
    } catch (e) {
      console.warn('Backend login sync notice:', e?.message);
    }

    // Refresh session state
    const sessionResult = await authClient.getSession();
    const loggedInUser = sessionResult?.data?.user || result?.data?.user || {
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: cleanEmail.startsWith('admin@') ? 'admin' : 'student',
    };

    setSession(sessionResult?.data?.session || { user: loggedInUser });
    setUser(loggedInUser);
    saveAccountToDevice(loggedInUser);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(loggedInUser));

    return loggedInUser;
  };

  // Passwordless 1-Click Login for an account already verified/saved on this device
  const loginWithSavedAccount = async (savedAccount) => {
    if (!savedAccount || !savedAccount.email) {
      throw new Error('Invalid account details');
    }

    const cleanAccount = {
      ...savedAccount,
      email: savedAccount.email.toLowerCase(),
      lastLogin: new Date().toISOString(),
    };

    // Ensure backend token is available for the account
    if (cleanAccount.email) {
      try {
        const backendRes = await authApi.syncSession({
          email: cleanAccount.email,
          full_name: cleanAccount.name,
          avatar_url: cleanAccount.image,
        });
        if (backendRes?.access_token) {
          localStorage.setItem('nxtlearnn_token', backendRes.access_token);
        }
      } catch (e) {
        console.warn('Saved account token sync notice:', e?.message);
      }
    }

    setUser(cleanAccount);
    setSession({
      user: cleanAccount,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    });
    saveAccountToDevice(cleanAccount);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(cleanAccount));

    return cleanAccount;
  };

  // Social Sign-in (Google / GitHub) via Neon Better Auth
  // Note: For Google, we pass additionalParams: { prompt: 'select_account' } so that
  // Google ALWAYS displays the account selection prompt instead of automatically signing in.
  const signInWithSocial = async (provider, callbackPath = '/dashboard') => {
    const callbackURL = `${window.location.origin}${callbackPath}`;
    const payload = {
      provider, // 'google' | 'github'
      callbackURL,
    };

    if (provider === 'google') {
      payload.additionalParams = {
        prompt: 'select_account',
      };
    }

    const result = await authClient.signIn.social(payload);

    if (result?.error) {
      throw new Error(result.error.message || `Failed to sign in with ${provider}`);
    }

    return result;
  };

  // Sign out: clears active server & local session, but keeps device-remembered accounts list
  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (e) {
      console.warn('Neon Better Auth signout notice:', e);
    } finally {
      localStorage.removeItem(ACTIVE_USER_KEY);
      localStorage.removeItem('nxtlearnn_token');
      setSession(null);
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin =
    user?.role === 'admin' ||
    user?.email?.startsWith('admin@') ||
    user?.email?.toLowerCase() === 'kishoresabari007@gmail.com';
  const isStudent = !isAdmin;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isStudent,
        login: loginWithEmail,
        loginWithSavedAccount,
        signup: signupWithEmail,
        signInWithSocial,
        logout,
        getSavedAccounts,
        saveAccountToDevice,
        removeAccountFromDevice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

