import { useState } from 'react';
import api from '../lib/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResendEmailVerification = ({ email }) => {
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    try {
      setSending(true);
      await api.post('/api/client/resend-verification', { email });
      toast.success('Verification email sent successfully!');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to resend verification email'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 mb-2">
          Didn't receive the verification email?
        </p>
        <button
          onClick={handleResend}
          disabled={sending}
          className={`
          inline-flex items-center px-4 py-2 
          border border-transparent text-sm font-medium rounded-md 
          ${
            sending
              ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
              : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
          transition-colors duration-200
        `}
        >
          {sending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            'Resend Verification Email'
          )}
        </button>
      </div>
      <div>
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
      </div>
    </>
  );
};

export default ResendEmailVerification;
