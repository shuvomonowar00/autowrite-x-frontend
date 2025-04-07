import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { FaWordpress, FaBlogger, FaMedium } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../lib/api';
import { useSidebar } from '../../compulsory/client/contexts/ClientSidebarContext';

const DetailsSpecificArticle = () => {
  const { id } = useParams();
  const [record, setRecord] = useState({});
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sidebarCollapsed } = useSidebar();
  const cardWidth = sidebarCollapsed ? 'md:w-[42rem]' : 'md:w-[34.4rem]';

  // Render the specific article
  useEffect(() => {
    api
      .get(`/api/contents/articles/show/${id}`)
      .then((response) => {
        setRecord(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error(error.message);
      });
  }, []);

  // Handle view button click
  const handleViewClick = (recordID) => {
    try {
      navigate(`/view-article/${recordID}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Publish Details Modal
  const PublishDetailsModal = ({ isOpen, onClose, platforms }) => {
    if (!isOpen) return null;

    const { sidebarCollapsed } = useSidebar();

    return (
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 mt-[4rem] transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[6rem]' : 'ml-[21rem]'
        }`}
      >
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl w-[60rem] p-8 transform transition-all scale-95">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8 border-b border-blue-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-xl">
                <GlobeAltIcon className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  Published Platforms
                </h3>
                <p className="text-gray-500">
                  View all your published article locations
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <XMarkIcon className="h-8 w-8 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-xl border border-blue-100">
            <table className="min-w-full divide-y divide-blue-100">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Sl
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold gray-blue-600 uppercase tracking-wider">
                    Platform Site
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold gray-blue-600 uppercase tracking-wider">
                    Published Date & Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-50">
                {platforms?.map((platform, index) => (
                  <tr
                    key={platform.id}
                    className="hover:bg-blue-50/50 transition-colors duration-150"
                  >
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FaWordpress className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {platform.platform_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <a
                        href={platform.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                      >
                        {platform.post_url}
                      </a>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-gray-700 rounded-full text-sm font-medium">
                        {format(
                          new Date(platform.created_at),
                          'MMM dd, yyyy hh:mm:ss a'
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="h-[91vh] w-full bg-white shadow-lg">
        {/* <div className="min-h-full bg-white shadow-2xl"> */}
        <div className="relative z-10">
          {/* <div className="bg-[rgba(245, 244, 243, 1)] pb-4 pt-8 shadow-2xl -z-10"> */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 px-6 pt-6">
            <div
              className={`w-full ${cardWidth} h-[30rem] bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6`}
            >
              <div className="flex items-center gap-3 mb-6">
                <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Post Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Post Type
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {record.article_type}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Article Status
                      </p>
                      <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-green-100 text-green-800">
                        {record.article_status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <ArrowPathIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Publish Status
                      </p>
                      <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                        {record.publish_status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <GlobeAltIcon className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">
                        Site URL
                      </p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
                        >
                          <EyeIcon className="h-5 w-5" />
                          View Published Sites
                        </button>
                      </div>
                    </div>
                  </div>

                  <PublishDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    platforms={record.article_platforms}
                  />
                </div>
              </div>
            </div>

            <div
              className={`w-full ${cardWidth} h-[30rem] bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6`}
            >
              <div className="flex items-center gap-3 mb-6">
                <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Given Options
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        GPT Version
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {record.gpt_version}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        AI Generated Title
                      </p>
                      <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-green-100 text-green-800">
                        {record.ai_generated_title}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <ArrowPathIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Article Language
                      </p>
                      <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                        {record.article_language}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <GlobeAltIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">FAQs</p>
                      <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                        {record.faqs}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 mx-4">
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Article Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Article Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Publish Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.article_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {record.article_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {record.publish_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
                        onClick={() => handleViewClick(record.id)}
                      >
                        <EyeIcon className="h-5 w-5" />
                        View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
      {/* Toast container */}
      <div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
};

export default DetailsSpecificArticle;
