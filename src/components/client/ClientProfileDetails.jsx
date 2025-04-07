import { useState, useEffect, useRef } from 'react';
import { useClientAuth } from '../compulsory/client/contexts/ClientAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  UserCircleIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import api from '../lib/api';

function ClientProfileDetails() {
  const { user, refreshUserData } = useClientAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const imagePopupRef = useRef(null);
  const [profileData, setProfileData] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  });

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsFetching(true);
        const response = await api.get('/api/client/profile/show');
        setProfileData(response.data?.profile);

        // Set form data based on API response
        setFormData({
          first_name: response.data?.profile?.first_name || '',
          last_name: response.data?.profile?.last_name || '',
        });

        // Set profile image if available
        if (response.data.profile.profile_photo) {
          setProfileImagePreview(response.data.profile.profile_photo);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfileData();
  }, []);

  // Fall back to AuthContext data if direct API call fails
  useEffect(() => {
    if (!isFetching && !profileData && user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
      if (user.profile_photo) {
        setProfileImagePreview(user.profile_photo);
      }
    }
  }, [user, isFetching, profileData]);

  // Close image popup when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        imagePopupRef.current &&
        !imagePopupRef.current.contains(event.target)
      ) {
        setShowImagePopup(false);
      }
    }

    if (showImagePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showImagePopup]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle name update separately
  const updateUserInfo = async () => {
    try {
      // Only update if values changed
      if (
        formData.first_name !== profileData?.first_name ||
        formData.last_name !== profileData?.last_name
      ) {
        await api.put('/api/client/profile/update/profile-info', {
          first_name: formData.first_name,
          last_name: formData.last_name,
        });

        return true;
      }
      return true;
    } catch (error) {
      console.error('Error updating name:', error);
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          const firstField = Object.keys(validationErrors)[0];
          toast.error(validationErrors[firstField][0]);
        } else {
          toast.error(error.response.data.message || 'Invalid name data');
        }
      } else {
        toast.error('Failed to update name information');
      }
      return false;
    }
  };

  // Handle profile photo update separately
  const updateProfilePhoto = async () => {
    if (!profileImage) return true;

    try {
      const photoData = new FormData();
      photoData.append('profile_photo', profileImage);

      await api.post('/api/client/profile/update/profile-photo', photoData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return true;
    } catch (error) {
      console.error('Error updating profile photo:', error);
      if (error.response?.status === 422) {
        if (error.response.data.errors?.profile_photo) {
          toast.error(error.response.data.errors.profile_photo[0]);
        } else {
          toast.error('Invalid image file');
        }
      } else {
        toast.error('Failed to update profile photo');
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update name info and photo separately
      const nameUpdated = await updateUserInfo();
      const photoUpdated = await updateProfilePhoto();

      // if (nameUpdated && photoUpdated) {
      if (nameUpdated && photoUpdated) {
        // Refresh data from both sources
        await refreshUserData();
        const response = await api.get('/api/client/profile/show');
        setProfileData(response.data?.profile);

        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setProfileImage(null); // Reset the selected file
      }
    } catch (error) {
      console.error('Error in profile update:', error);
      toast.error('Something went wrong during the update');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    // Restore from profileData first, then fall back to user context
    const dataSource = profileData || user || {};

    setFormData({
      first_name: dataSource.first_name || '',
      last_name: dataSource.last_name || '',
    });
    setProfileImagePreview(dataSource.profile_photo || null);
    setProfileImage(null);
    setIsEditing(false);
  };

  // Get data from API first, then fall back to Auth context
  const userData = profileData || user || {};

  // Get full name
  const fullName = userData
    ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
    : '';

  // Show loading state while fetching initial data
  if (isFetching) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[700px]">
        <div className="relative w-24 h-24 mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-500 rounded-full animate-spin-reverse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <UserIcon className="h-8 w-8 text-blue-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Profile Information
          </h3>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-sm h-[95vh]">
        {/* Profile Header */}
        <div className="relative">
          {/* Decorative Header Gradient */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600"></div>

          {/* Profile Image Overlay */}
          <div className="absolute inset-x-0 top-16 flex justify-center">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-full w-full text-gray-300" />
                )}
              </div>

              {/* Editable Image Overlay */}
              {isEditing ? (
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                  {/* Existing edit photo UI */}
                </label>
              ) : (
                profileImagePreview && (
                  <button
                    onClick={() => setShowImagePopup(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
                  >
                    <div className="flex flex-col items-center">
                      <EyeIcon className="h-8 w-8 text-white" />
                      <span className="text-white text-xs mt-1">
                        View photo
                      </span>
                    </div>
                  </button>
                )
              )}

              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                  <div className="flex flex-col items-center">
                    <CameraIcon className="h-8 w-8 text-white" />
                    <span className="text-white text-xs mt-1">
                      Change photo
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 px-8 pb-8">
          <div className="mb-8 text-center">
            {!isEditing && (
              <h2 className="text-2xl font-bold text-gray-800">
                {fullName || 'Your Name'}
              </h2>
            )}

            <p className="text-blue-600 font-medium mt-1">
              @{userData?.username || 'username'}
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit}>
              {/* Editable Fields Section */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Personal Information
                  </h3>

                  {/* Edit Controls */}
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          ) : (
                            <CheckIcon className="w-4 h-4" />
                          )}
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsEditing(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 border border-blue-500 text-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* First Name */}
                  <div className="form-control">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="Enter your first name"
                        required
                      />
                    ) : (
                      <div className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-800">
                        {userData?.first_name || 'Not set'}
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="form-control">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="Enter your last name"
                        required
                      />
                    ) : (
                      <div className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-800">
                        {userData?.last_name || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Non-editable Fields */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <LockClosedIcon className="w-5 h-5 text-gray-500" />
                  Account Information
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
                    Non-editable
                  </span>
                </h3>

                <div className="space-y-4">
                  {/* Username */}
                  <div className="form-control">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                      Username
                    </label>
                    <div className="p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
                      @{userData?.username || 'username'}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Username can change from settings.
                    </p>
                  </div>

                  {/* Email */}
                  <div className="form-control">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" />
                      Email Address
                    </label>
                    <div className="p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
                      {userData?.email || 'your.email@example.com'}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Email address can be update from settings.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Image Popup */}
      {showImagePopup && profileImagePreview && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 p-4">
          <div
            ref={imagePopupRef}
            className="relative bg-white rounded-xl p-4 w-[30rem] max-w-full"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setShowImagePopup(false)}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
              >
                <XMarkIcon className="h-6 w-6 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center">
              <img
                src={profileImagePreview}
                alt="Profile"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            <div className="mt-4 text-center text-gray-700 font-medium">
              {fullName || 'Your Profile Image'}
            </div>
          </div>
        </div>
      )}
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        // theme="colored"
      />
    </>
  );
}

export default ClientProfileDetails;
