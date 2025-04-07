import React, { useState, useEffect, useRef } from 'react';
import { useClientAuth } from '../compulsory/client/contexts/ClientAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  CheckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import api from '../lib/api';

function ClientSettings() {
  const { user, refreshUserData } = useClientAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [usernameValid, setUsernameValid] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const usernameTimeoutRef = useRef(null);
  const [emailValid, setEmailValid] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [emailChecking, setEmailChecking] = useState(false);
  const emailTimeoutRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [usernameData, setUsernameData] = useState({
    username: '',
  });

  const [emailData, setEmailData] = useState({
    email: '',
    password: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState({});

  // Initialize form data from user object
  useEffect(() => {
    if (user) {
      setUsernameData({ username: user.username || '' });
      setEmailData({ email: user.email || '', password: '' });
    }
  }, [user]);

  // Username validation function
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
  };

  // Handle username change to include validation
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsernameData({ username: newUsername });

    // Clear any previous errors
    setErrors((prev) => ({ ...prev, username: null }));

    // Validate username format
    const isValid = validateUsername(newUsername);
    setUsernameValid(isValid);

    // Clear previous timeout to prevent multiple API calls
    if (usernameTimeoutRef.current) {
      clearTimeout(usernameTimeoutRef.current);
    }

    // Check if it's the same as current username
    if (newUsername === user?.username) {
      setUsernameAvailable(true);
      setUsernameChecking(false);
      return;
    }

    // Only check availability if username is valid and different from current
    if (isValid) {
      setUsernameChecking(true);
      usernameTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await api.post(
            '/api/client/settings/check-username',
            {
              username: newUsername,
            }
          );
          setUsernameAvailable(response.data.available);
        } catch (error) {
          console.error('Error checking username availability:', error);
          setUsernameAvailable(false);
        } finally {
          setUsernameChecking(false);
        }
      }, 500); // Debounce for 500ms
    } else {
      setUsernameChecking(false);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (usernameTimeoutRef.current) {
        clearTimeout(usernameTimeoutRef.current);
      }
    };
  }, []);

  // Handle username form
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.put('/api/client/settings/update-username', usernameData);
      await refreshUserData();
      // toast.success('Username updated successfully');
      setActiveSection(null);
    } catch (error) {
      console.error('Error updating username:', error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error(Object.values(error.response.data.errors)[0][0]);
      } else {
        toast.error(
          error.response?.data?.message || 'Failed to update username'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email form
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));

    // Clear any previous errors
    setErrors((prev) => ({ ...prev, [name]: null }));

    // Only proceed with availability check for the email field
    if (name === 'email') {
      const email = value;

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      setEmailValid(isValid);

      // Clear previous timeout to prevent multiple API calls
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current);
      }

      // Check if it's the same as current email
      if (email === user?.email) {
        setEmailAvailable(true);
        setEmailChecking(false);
        return;
      }

      // Only check availability if email is valid and different from current
      if (isValid) {
        setEmailChecking(true);
        emailTimeoutRef.current = setTimeout(async () => {
          try {
            const response = await api.post(
              '/api/client/settings/check-email',
              {
                email: email,
              }
            );
            setEmailAvailable(response.data.available);
          } catch (error) {
            console.error('Error checking email availability:', error);
            setEmailAvailable(false);
          } finally {
            setEmailChecking(false);
          }
        }, 500); // Debounce for 500ms
      } else {
        setEmailChecking(false);
      }
    }
  };

  // Clean up email timeout
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current);
      }
      if (usernameTimeoutRef.current) {
        clearTimeout(usernameTimeoutRef.current);
      }
    };
  }, []);

  // Handle email form submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.put('/api/client/settings/update-email', emailData);
      await refreshUserData();
      // toast.success('Email updated successfully');
      setActiveSection(null);
      setEmailData((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      console.error('Error updating email:', error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        // toast.error(Object.values(error.response.data.errors)[0][0]);
      } else {
        toast.error(error.response?.data?.message || 'Failed to update email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Clear any previous errors
    setErrors((prev) => ({ ...prev, [name]: null }));

    // Check for confirm password match
    if (name === 'confirm_password' && passwordData.new_password !== value) {
      setErrors((prev) => ({
        ...prev,
        confirm_password: ['Passwords do not match'],
      }));
    } else if (name === 'confirm_password') {
      setErrors((prev) => ({
        ...prev,
        confirm_password: null,
      }));
    }
  };

  // Password validation function
  const isValidPassword = (password) => {
    if (!password) return { isValid: false, errors: {} };

    const minLength = password.length >= 8;
    const maxLength = password.length <= 24;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        minLength &&
        maxLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSymbols,
      errors: {
        minLength: !minLength ? 'Password must be at least 8 characters' : '',
        maxLength: !maxLength ? 'Password must not exceed 24 characters' : '',
        hasUpperCase: !hasUpperCase
          ? 'Password must contain an uppercase letter'
          : '',
        hasLowerCase: !hasLowerCase
          ? 'Password must contain a lowercase letter'
          : '',
        hasNumbers: !hasNumbers ? 'Password must contain a number' : '',
        hasSymbols: !hasSymbols
          ? 'Password must contain a special character'
          : '',
      },
    };
  };

  // Handle password form submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      setErrors((prev) => ({
        ...prev,
        confirm_password: ['Passwords do not match'],
      }));
      // toast.error('Passwords do not match');
      return;
    }

    // Check password strength
    if (!isValidPassword(passwordData.new_password).isValid) {
      toast.error('Please create a stronger password');
      return;
    }

    setIsLoading(true);

    try {
      await api.put('/api/client/settings/update-password', {
        current_password: passwordData.current_password,
        password: passwordData.new_password,
        password_confirmation: passwordData.confirm_password,
      });

      toast.success('Password updated successfully');
      setActiveSection(null);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        // toast.error(Object.values(error.response.data.errors)[0][0]);
      } else {
        toast.error(
          error.response?.data?.message || 'Failed to update password'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel edit and reset form
  const cancelEdit = () => {
    if (activeSection === 'username') {
      setUsernameData({ username: user.username || '' });
    } else if (activeSection === 'email') {
      setEmailData({ email: user.email || '', password: '' });
    } else if (activeSection === 'password') {
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    }

    setErrors({});
    setActiveSection(null);
  };

  return (
    <div className="bg-white shadow-sm h-[95vh]">
      <div className="py-10 px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Username Section */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <UserCircleIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Username
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Your unique identifier on the platform
                    </p>
                  </div>
                </div>

                {activeSection !== 'username' && (
                  <button
                    onClick={() => setActiveSection('username')}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    Change
                  </button>
                )}
              </div>

              {activeSection === 'username' ? (
                <form onSubmit={handleUsernameSubmit} className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">@</span>
                        </div>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={usernameData.username}
                          onChange={handleUsernameChange}
                          className={`block w-full pl-8 pr-4 py-3 border ${
                            errors.username
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="your_username"
                          required
                        />
                      </div>
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <ExclamationCircleIcon className="h-4 w-4" />
                          {errors.username[0]}
                        </p>
                      )}
                      {/* Username feedback messages */}
                      {usernameData.username && !usernameValid && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <ExclamationCircleIcon className="h-4 w-4" />
                          Username must be 3-30 characters and contain only
                          letters, numbers, and underscores
                        </p>
                      )}

                      {usernameData.username &&
                        usernameValid &&
                        usernameData.username === user?.username && (
                          <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                            <ExclamationCircleIcon className="h-4 w-4" />
                            This is your current username
                          </p>
                        )}

                      {usernameData.username &&
                        usernameValid &&
                        usernameData.username !== user?.username &&
                        usernameChecking && (
                          <p className="mt-1 text-sm text-blue-600 flex items-center gap-1">
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            Checking username availability...
                          </p>
                        )}

                      {usernameData.username &&
                        usernameValid &&
                        usernameData.username !== user?.username &&
                        !usernameChecking &&
                        !usernameAvailable && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <ExclamationCircleIcon className="h-4 w-4" />
                            This username is already taken
                          </p>
                        )}

                      {usernameData.username &&
                        usernameValid &&
                        usernameData.username !== user?.username &&
                        !usernameChecking &&
                        usernameAvailable && (
                          <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                            <CheckIcon className="h-4 w-4" />
                            Username is available
                          </p>
                        )}

                      <p className="mt-2 text-sm text-gray-500">
                        Username can only contain letters, numbers, and
                        underscores (3-20 characters)
                      </p>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={
                          isLoading ||
                          !usernameValid ||
                          !usernameAvailable ||
                          usernameChecking ||
                          usernameData.username === '' ||
                          usernameData.username === user?.username
                        }
                        className={`px-4 py-2 text-sm font-medium text-white ${
                          isLoading ||
                          !usernameValid ||
                          !usernameAvailable ||
                          usernameChecking ||
                          usernameData.username === '' ||
                          usernameData.username === user?.username // Add this condition
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center gap-2`}
                      >
                        {isLoading ? (
                          <>
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mt-4 flex gap-2">
                  <div className="py-2 px-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium flex-1">
                    @{user?.username || 'username'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Section */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <EnvelopeIcon className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Email Address
                    </h3>
                    <p className="text-gray-500 text-sm">
                      We use this for communications and account recovery
                    </p>
                  </div>
                </div>

                {activeSection !== 'email' && (
                  <button
                    onClick={() => setActiveSection('email')}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    Change
                  </button>
                )}
              </div>

              {activeSection === 'email' ? (
                <form onSubmit={handleEmailSubmit} className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={emailData.email}
                          onChange={handleEmailChange}
                          className={`block w-full pl-10 pr-4 py-3 border ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <ExclamationCircleIcon className="h-4 w-4" />
                          {errors.email[0]}
                        </p>
                      )}

                      {/* Email feedback messages */}
                      {emailData.email && !emailValid && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <ExclamationCircleIcon className="h-4 w-4" />
                          Please enter a valid email address
                        </p>
                      )}

                      {emailData.email &&
                        emailValid &&
                        emailData.email === user?.email && (
                          <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                            <ExclamationCircleIcon className="h-4 w-4" />
                            This is your current email address
                          </p>
                        )}

                      {emailData.email &&
                        emailValid &&
                        emailData.email !== user?.email &&
                        emailChecking && (
                          <p className="mt-1 text-sm text-blue-600 flex items-center gap-1">
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            Checking email availability...
                          </p>
                        )}

                      {emailData.email &&
                        emailValid &&
                        emailData.email !== user?.email &&
                        !emailChecking &&
                        !emailAvailable && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <ExclamationCircleIcon className="h-4 w-4" />
                            This email address is already taken
                          </p>
                        )}

                      {emailData.email &&
                        emailValid &&
                        emailData.email !== user?.email &&
                        !emailChecking &&
                        emailAvailable && (
                          <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                            <CheckIcon className="h-4 w-4" />
                            Email address is available
                          </p>
                        )}
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm with Your Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <KeyIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={emailData.password}
                            onChange={handleEmailChange}
                            className={`block w-full pl-10 pr-4 py-3 border ${
                              errors.password
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Enter your current password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            required
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <ExclamationCircleIcon className="h-4 w-4" />
                          {errors.password[0]}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-gray-500">
                        We need your password to confirm this change for
                        security
                      </p>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={
                          isLoading ||
                          !emailValid ||
                          !emailAvailable ||
                          emailChecking ||
                          emailData.email === '' ||
                          emailData.email === user?.email ||
                          emailData.password === ''
                        }
                        className={`px-4 py-2 text-sm font-medium text-white ${
                          isLoading ||
                          !emailValid ||
                          !emailAvailable ||
                          emailChecking ||
                          emailData.email === '' ||
                          emailData.email === user?.email ||
                          emailData.password === ''
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center gap-2`}
                      >
                        {isLoading ? (
                          <>
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mt-4 flex gap-2">
                  <div className="py-2 px-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium flex-1">
                    {user?.email || 'your.email@example.com'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <ShieldCheckIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Password
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Keep your account secure with a strong password
                    </p>
                  </div>
                </div>

                {activeSection !== 'password' && (
                  <button
                    onClick={() => setActiveSection('password')}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    Change
                  </button>
                )}
              </div>

              {activeSection === 'password' ? (
                <form onSubmit={handlePasswordSubmit} className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="current_password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          id="current_password"
                          name="current_password"
                          value={passwordData.current_password}
                          onChange={handlePasswordChange}
                          className={`block w-full px-4 py-3 border ${
                            errors.current_password
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          required
                        >
                          {showCurrentPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.current_password && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <ExclamationCircleIcon className="h-4 w-4" />
                          {errors.current_password[0]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="new_password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id="new_password"
                          name="new_password"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                          className={`block w-full px-4 py-3 border ${
                            errors.password
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="Create a strong password"
                          required
                          minLength="8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          required
                        >
                          {showNewPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <ExclamationCircleIcon className="h-4 w-4" />
                          {errors.password[0]}
                        </p>
                      )}

                      {/* Password strength indicator */}
                      {passwordData.new_password && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="h-1 flex-1 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  isValidPassword(passwordData.new_password)
                                    .isValid
                                    ? 'bg-green-500 w-full'
                                    : Object.values(
                                          isValidPassword(
                                            passwordData.new_password
                                          ).errors
                                        ).filter((e) => !e).length >= 3
                                      ? 'bg-yellow-500 w-2/3'
                                      : 'bg-red-500 w-1/3'
                                }`}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {isValidPassword(passwordData.new_password)
                                .isValid
                                ? 'Strong'
                                : Object.values(
                                      isValidPassword(passwordData.new_password)
                                        .errors
                                    ).filter((e) => !e).length >= 3
                                  ? 'Medium'
                                  : 'Weak'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Password requirements */}
                      {passwordData.new_password && (
                        <div className="mt-4 space-y-2 text-sm">
                          <h4 className="font-medium text-gray-700">
                            Password requirements:
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            <div
                              className={`flex items-center gap-2 ${
                                passwordData.new_password.length >= 8
                                  ? 'text-green-600'
                                  : 'text-gray-500'
                              }`}
                            >
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  passwordData.new_password.length >= 8
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                }`}
                              />
                              <span>At least 8 characters long</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                /[A-Z]/.test(passwordData.new_password)
                                  ? 'text-green-600'
                                  : 'text-gray-500'
                              }`}
                            >
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  /[A-Z]/.test(passwordData.new_password)
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                }`}
                              />
                              <span>One uppercase letter</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                /[a-z]/.test(passwordData.new_password)
                                  ? 'text-green-600'
                                  : 'text-gray-500'
                              }`}
                            >
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  /[a-z]/.test(passwordData.new_password)
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                }`}
                              />
                              <span>One lowercase letter</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                /\d/.test(passwordData.new_password)
                                  ? 'text-green-600'
                                  : 'text-gray-500'
                              }`}
                            >
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  /\d/.test(passwordData.new_password)
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                }`}
                              />
                              <span>One number</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                /[!@#$%^&*(),.?":{}|<>]/.test(
                                  passwordData.new_password
                                )
                                  ? 'text-green-600'
                                  : 'text-gray-500'
                              }`}
                            >
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  /[!@#$%^&*(),.?":{}|<>]/.test(
                                    passwordData.new_password
                                  )
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                }`}
                              />
                              <span>
                                One special character (!@#$%^&*(),.?":{}
                                |&lt;&gt;)
                              </span>
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                passwordData.new_password.length <= 24
                                  ? 'text-green-600'
                                  : 'text-gray-500'
                              }`}
                            >
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  passwordData.new_password.length <= 24
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                }`}
                              />
                              <span>Maximum 24 characters</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="mt-2 text-sm text-gray-500">
                        Password must be at least 8 characters and include
                        letters and numbers
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirm_password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirm_password"
                          name="confirm_password"
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          className={`block w-full px-4 py-3 border ${
                            errors.confirm_password
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="Confirm your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          required
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.confirm_password && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <ExclamationCircleIcon className="h-4 w-4" />
                          {errors.confirm_password[0]}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={
                          isLoading ||
                          passwordData.new_password !==
                            passwordData.confirm_password ||
                          !isValidPassword(passwordData.new_password).isValid ||
                          !passwordData.current_password
                        }
                        className={`px-4 py-2 text-sm font-medium text-white ${
                          isLoading ||
                          passwordData.new_password !==
                            passwordData.confirm_password ||
                          !isValidPassword(passwordData.new_password).isValid ||
                          !passwordData.current_password
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center gap-2`}
                      >
                        {isLoading ? (
                          <>
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mt-4 flex gap-2">
                  <div className="py-2 px-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium flex-1">
                    ••••••••••••••••
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        limit={3} // Limit number of toasts
        preventDuplicates={true} // Add this line
      />
    </div>
  );
}

export default ClientSettings;
