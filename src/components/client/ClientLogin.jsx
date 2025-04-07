// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import {
//   EyeIcon,
//   EyeSlashIcon,
//   ArrowPathIcon,
// } from '@heroicons/react/24/outline';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import api from '../lib/api';
// import { useClientAuth } from '../compulsory/client/contexts/ClientAuthContext';

// function ClientLogin() {
//   const navigate = useNavigate();
//   const { setIsAuthenticated } = useClientAuth();
//   const [formData, setFormData] = useState({
//     login: '', // This will handle both username or email
//     password: '',
//     remember_me: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [signinButtonActive, setSigninButtonActive] = useState(false);

//   useEffect(() => {
//     if (formData.login && formData.password) {
//       setSigninButtonActive(true);
//     } else {
//       setSigninButtonActive(false);
//     }
//   }, [formData]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));

//     // Clear error when user types
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: '',
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrors({});

//     try {
//       await api.post('/api/client/login', formData);
//       setIsAuthenticated(true);
//       toast.success('Login successful!', {
//         onClose: () => navigate('/dashboard'),
//       });
//     } catch (error) {
//       // Handle validation error
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       }

//       // Handle verification error
//       if (error.response?.data?.errors?.verification) {
//         toast.error(error.response.data.errors.verification);
//       } else {
//         toast.error('Login failed. Please check your credentials.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-hero-texture">
//         <div className="fixed top-0 left-0 right-0 z-50">
//           <div className="backdrop-blur-md bg-white/80 shadow-sm border-b border-gray-200">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex items-center justify-between h-16">
//                 {/* Logo Section */}
//                 <div className="flex items-center space-x-2">
//                   <svg
//                     className="h-8 w-8 text-blue-600"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
//                   </svg>
//                   <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent transition-all duration-300 hover:from-blue-500 hover:to-blue-300">
//                     AutoWriteX
//                   </span>
//                 </div>

//                 {/* Center Content */}
//                 <div className="flex-1 flex justify-center">
//                   <div className="relative">
//                     <h2 className="text-2xl font-bold text-gray-900">
//                       Welcome Back
//                       <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
//                     </h2>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <Link
//                     to="/client/register"
//                     className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
//                   >
//                     Need an account?
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Username or Email
//                 </label>
//                 <input
//                   type="text"
//                   name="login"
//                   value={formData.login}
//                   onChange={handleInputChange}
//                   className={`
//                     mt-1
//                     block
//                     w-full
//                     px-4
//                     py-2.5
//                     rounded-lg
//                     border
//                     outline-none
//                     transition-all
//                     duration-200
//                     appearance-none
//                     ${
//                       errors.login
//                         ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
//                         : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'
//                     }
//                     focus:ring-4
//                     focus:ring-opacity-50
//                   `}
//                   required
//                 />
//                 {errors.login && (
//                   <p className="mt-2 text-sm text-red-600">{errors.login}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className={`
//                       mt-1
//                       block
//                       w-full
//                       px-4
//                       py-2.5
//                       rounded-lg
//                       border
//                       outline-none
//                       transition-all
//                       duration-200
//                       appearance-none
//                       ${
//                         errors.password
//                           ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
//                           : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'
//                       }
//                       focus:ring-4
//                       focus:ring-opacity-50
//                     `}
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <EyeSlashIcon className="h-5 w-5 text-gray-400" />
//                     ) : (
//                       <EyeIcon className="h-5 w-5 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="mt-2 text-sm text-red-600">{errors.password}</p>
//                 )}
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     id="remember_me"
//                     name="remember_me"
//                     type="checkbox"
//                     checked={formData.remember_me}
//                     onChange={handleInputChange}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label
//                     htmlFor="remember_me"
//                     className="ml-2 block text-sm text-gray-900"
//                   >
//                     Remember me
//                   </label>
//                 </div>

//                 <div className="text-sm">
//                   <Link
//                     to="/client/forgot-password"
//                     className="font-medium text-blue-600 hover:text-blue-500"
//                   >
//                     Forgot your password?
//                   </Link>
//                 </div>
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   disabled={!signinButtonActive || isLoading}
//                   className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
//                     !signinButtonActive || isLoading
//                       ? 'bg-blue-400 cursor-not-allowed'
//                       : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
//                   }`}
//                 >
//                   {/* {isLoading ? (
//                     <svg
//                       className="animate-spin h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                   ) : (
//                     'Sign in'
//                   )} */}

//                   {isLoading ? (
//                     <div className="flex items-center gap-2">
//                       <ArrowPathIcon className="h-5 w-5 animate-spin" />
//                       <span>Signing...</span>
//                     </div>
//                   ) : (
//                     'Sign in'
//                   )}
//                 </button>
//               </div>
//             </form>
//             {errors.verification && (
//               <p className="mt-2 text-sm text-red-600">{errors.verification}</p>
//             )}
//           </div>
//         </div>
//       </div>
//       <ToastContainer
//         position="top-right"
//         autoClose={1500}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </>
//   );
// }

// export default ClientLogin;

import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../lib/api';
import { useClientAuth } from '../compulsory/client/contexts/ClientAuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

function ClientLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useClientAuth();
  const [formData, setFormData] = useState({
    login: '', // This will handle both username or email
    password: '',
    remember_me: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoginLoading, setSocialLoginLoading] = useState('');
  const [signinButtonActive, setSigninButtonActive] = useState(false);

  // Check for social login redirect callback
  useEffect(() => {
    // Parse URL parameters for a social login callback
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const provider = params.get('provider');
    const error = params.get('error');

    if (success === 'true' && provider) {
      // Handle successful social login with cookie-based auth
      setIsAuthenticated(true);
      toast.success(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`
      );

      // Clean up the URL and redirect to dashboard
      navigate('/dashboard', { replace: true });
    } else if (error) {
      // Handle social login errors
      toast.error(decodeURIComponent(error));

      // Clean up the URL
      navigate('/client/login', { replace: true });
    }
  }, [location, navigate, setIsAuthenticated]);

  // Handle form input changes
  useEffect(() => {
    if (formData.login && formData.password) {
      setSigninButtonActive(true);
    } else {
      setSigninButtonActive(false);
    }
  }, [formData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await api.post('/api/client/login', formData);

      // Store the token if your API returns one
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }

      setIsAuthenticated(true);
      toast.success('Login successful!');

      // Use setTimeout to allow the toast to show before redirecting
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      // Handle validation error
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      // Handle verification error
      if (error.response?.data?.errors?.verification) {
        toast.error(error.response.data.errors.verification);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google login handler
  const handleGoogleLogin = () => {
    setSocialLoginLoading('google');
    window.location.href = 'http://127.0.0.1:8000/api/client/login/google';
  };

  // Facebook login handler
  const handleFacebookLogin = () => {
    setSocialLoginLoading('facebook');
    window.location.href = 'http://127.0.0.1:8000/api/client/login/facebook';
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 custom-scrollbar">
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="backdrop-blur-md bg-white/80 shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent transition-all duration-300 hover:from-blue-500 hover:to-blue-300">
                    AutoWriteX
                  </span>
                </div>

                {/* Center Content */}
                <div className="flex-1 flex justify-center">
                  <div className="relative group">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Welcome Back
                    </h2>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/client/register"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Need an account?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
            {/* Social Login Section */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading || socialLoginLoading !== ''}
                  className="group relative flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {socialLoginLoading === 'google' ? (
                    <ArrowPathIcon className="h-5 w-5 text-gray-600 animate-spin" />
                  ) : (
                    <span className="flex items-center">
                      <FcGoogle className="h-5 w-5" />
                      <span className="ml-2 text-gray-700 text-sm font-medium">
                        Google
                      </span>
                    </span>
                  )}
                  <span className="absolute inset-0 overflow-hidden rounded-lg">
                    <span className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-blue-50 to-transparent group-hover:w-full group-hover:transition-all duration-500"></span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={isLoading || socialLoginLoading !== ''}
                  className="group relative flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {socialLoginLoading === 'facebook' ? (
                    <ArrowPathIcon className="h-5 w-5 text-gray-600 animate-spin" />
                  ) : (
                    <span className="flex items-center">
                      <FaFacebook className="h-5 w-5 text-[#1877F2]" />
                      <span className="ml-2 text-gray-700 text-sm font-medium">
                        Facebook
                      </span>
                    </span>
                  )}
                  <span className="absolute inset-0 overflow-hidden rounded-lg">
                    <span className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-blue-50 to-transparent group-hover:w-full group-hover:transition-all duration-500"></span>
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Regular login form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username or Email
                </label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  className={`
                    mt-1 
                    block 
                    w-full 
                    px-4 
                    py-2.5
                    rounded-lg
                    border
                    outline-none
                    transition-all
                    duration-200
                    appearance-none
                    ${
                      errors.login
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                    }
                    focus:ring-4
                    focus:ring-opacity-50
                  `}
                  required
                />
                {errors.login && (
                  <p className="mt-2 text-sm text-red-600">{errors.login}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`
                      mt-1 
                      block 
                      w-full 
                      px-4 
                      py-2.5
                      rounded-lg
                      border
                      outline-none
                      transition-all
                      duration-200
                      appearance-none
                      ${
                        errors.password
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                      }
                      focus:ring-4
                      focus:ring-opacity-50
                    `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    checked={formData.remember_me}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/client/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={
                    !signinButtonActive ||
                    isLoading ||
                    socialLoginLoading !== ''
                  }
                  className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    !signinButtonActive ||
                    isLoading ||
                    socialLoginLoading !== ''
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            {errors.verification && (
              <p className="mt-2 text-sm text-red-600">{errors.verification}</p>
            )}

            {/* Terms of Service notice */}
            <div className="mt-6">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      By signing in, you agree to our Terms of Service and
                      Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign up CTA */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/client/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default ClientLogin;
