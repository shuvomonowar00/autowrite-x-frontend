import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  DocumentTextIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../lib/api';
import { useSidebar } from '../../compulsory/client/contexts/ClientSidebarContext';

function ShowBulkArticleGenerationHistory() {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Render records
  useEffect(() => {
    setIsLoading(true);

    api
      .get(`/api/contents/articles/show?page=${currentPage}`)
      .then((response) => {
        setRecords(response.data.data);
        setTotalPages(response.data.last_page);
        setTotalRecords(response.data.total);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching records:', error);
        if (error.response?.status === 401) {
          // Handle unauthorized access
          navigate('/client/login');
        }
        // else {
        //   toast.error('Failed to fetch articles');
        //   console.log('Failed to fetch articles');
        // }

        setIsLoading(false);
      });
  }, [currentPage, navigate]);

  // Render pagination
  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`
          relative inline-flex items-center px-4 py-2 text-sm font-semibold
          ${
            currentPage === i
              ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
          }
        `}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{(currentPage - 1) * 6 + 1}</span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * 6, totalRecords)}
              </span>{' '}
              of <span className="font-medium">{totalRecords}</span> results
            </p>
          </div>

          <div className="inline-flex rounded-md shadow-sm isolate">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="Go to first page"
              className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <ChevronLeftIcon className="h-5 w-5 -ml-3" />
            </button>

            {pages}

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Go to last page"
              className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-5 w-5" />
              <ChevronRightIcon className="h-5 w-5 -ml-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Format the date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options).replace(',', '');
  };

  // Add truncate function
  const truncateArticleTitle = (title, maxLength = 60) => {
    if (title.length <= maxLength) return title;
    return `${title.substring(0, maxLength)}...`;
  };

  // Handle view button click
  const handleViewClick = (record) => {
    try {
      navigate(`/article-details/${record.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Update handleDeleteClick
  const handleDeleteClick = (recordId) => {
    setRecordToDelete(recordId);
    setDeleteModalOpen(true);
  };

  // Add confirmation handler
  const handleConfirmDelete = () => {
    if (recordToDelete) {
      api
        .delete(`/api/contents/articles/delete/${recordToDelete}`)
        .then(() => {
          // Update local state by filtering out deleted record
          setRecords((prevRecords) =>
            prevRecords.filter((record) => record.id !== recordToDelete)
          );
          setTotalRecords((prev) => prev - 1);

          // Close modal and show success message
          setDeleteModalOpen(false);
          setRecordToDelete(null);
          toast.success('Article deleted successfully');

          // If current page is empty after deletion, go to previous page
          if (records.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        })
        .catch((error) => {
          // console.error('Error deleting record:', error);
          if (error.response?.status === 401) {
            navigate('/client/login');
          } else {
            toast.error('Failed to delete article');
          }
        });
    }
  };

  // Add DeleteConfirmationModal component
  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    const { sidebarCollapsed } = useSidebar();

    return (
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 mt-[4rem] transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[6rem]' : 'ml-[21rem]'
        }`}
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <XMarkIcon className="h-8 w-8 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
          <h3 className="text-lg font-semibold mb-4">Delete Confirmation</h3>
          <p className="mb-6 text-gray-600">
            Are you sure you want to delete this article record?
          </p>
          <div className="flex justify-end gap-4 pb-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[91vh] w-full bg-white shadow-lg">
      <div className="relative">
        <div className="overflow-hidden">
          <div className="p-4">
            <h3 className="font-medium text-lg mb-4">All Created Posts</h3>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl border border-blue-100 shadow-md p-8 max-w-md w-full mx-auto">
                  <div className="flex flex-col items-center text-center">
                    {/* Modern animated loading spinner */}
                    <div className="relative mb-8">
                      {/* Outer glow effect */}
                      <div className="absolute inset-0 bg-blue-200 rounded-full opacity-20 blur-2xl scale-150 animate-pulse"></div>

                      {/* Inner spinning ring */}
                      <div className="relative">
                        {/* Background ring */}
                        <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>

                        {/* Spinning gradient arc */}
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-indigo-500 rounded-full animate-spin"></div>

                        {/* Pulsing center */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-pulse flex items-center justify-center">
                            <DocumentTextIcon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive dot animation */}
                    <div className="mb-6 flex items-center justify-center space-x-2">
                      <div
                        className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0s' }}
                      ></div>
                      <div
                        className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                    </div>

                    {/* Glass-style placeholder content */}
                    <div className="space-y-4 w-full">
                      {/* Title placeholder with shimmer effect */}
                      <div className="h-8 bg-gradient-to-r from-blue-50 to-white rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-blue-100 to-transparent -translate-x-full animate-shimmer"></div>
                      </div>

                      {/* Description placeholders */}
                      <div className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-gray-100 to-blue-50 rounded relative overflow-hidden w-full">
                          <div
                            className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-blue-50 to-transparent -translate-x-full animate-shimmer"
                            style={{ animationDelay: '0.1s' }}
                          ></div>
                        </div>
                        <div className="h-4 bg-gradient-to-r from-gray-100 to-blue-50 rounded relative overflow-hidden w-3/4">
                          <div
                            className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-blue-50 to-transparent -translate-x-full animate-shimmer"
                            style={{ animationDelay: '0.2s' }}
                          ></div>
                        </div>
                        <div className="h-4 bg-gradient-to-r from-gray-100 to-blue-50 rounded relative overflow-hidden w-5/6">
                          <div
                            className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-blue-50 to-transparent -translate-x-full animate-shimmer"
                            style={{ animationDelay: '0.3s' }}
                          ></div>
                        </div>
                      </div>

                      {/* Button placeholder with pulse */}
                      <div className="h-10 mt-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg relative overflow-hidden w-1/2 mx-auto">
                        <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Loading text with typewriter effect */}
                    <div className="mt-6 text-blue-600 font-medium">
                      Loading your articles...
                    </div>
                  </div>
                </div>
              </div>
            ) : records.length === 0 ? (
              // No records found state
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl border border-blue-100 shadow-md p-8 max-w-md w-full mx-auto">
                  <div className="flex flex-col items-center text-center">
                    {/* Decorative top element */}
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 blur-xl scale-150"></div>
                      <div className="relative bg-white p-5 rounded-full shadow-sm border border-blue-100">
                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-3 rounded-full">
                          <DocumentTextIcon className="h-10 w-10 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Main content */}
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                      No Articles Found
                    </h3>

                    <p className="text-gray-600 mb-6 max-w-xs">
                      You haven't created any articles yet. Start creating
                      content to see your articles here.
                    </p>

                    {/* Accent line with animation */}
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mb-6 animate-pulse"></div>

                    {/* Action button */}
                    <button
                      onClick={() => navigate('/bulk-article-generation')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm group"
                    >
                      <PencilIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">
                        Create Your First Article
                      </span>
                    </button>

                    {/* Help text */}
                    <p className="text-sm text-gray-500 mt-4">
                      Need help getting started?{' '}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View our guide
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Table for displaying the records */}
                <div className="overflow-x-auto rounded-lg shadow-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
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
                          Article Title
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
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {records.map((record) => (
                        <tr
                          key={record.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(record.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.article_type}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            title={record.article_heading}
                          >
                            {truncateArticleTitle(record.article_heading)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {record.article_status}
                            </span>
                          </td>
                          {/* Button Design Option 01 */}
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewClick(record)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
                              >
                                <EyeIcon className="h-5 w-5" />
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteClick(record.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
                              >
                                <TrashIcon className="h-5 w-5" />
                                Delete
                              </button>
                            </div>
                          </td> */}

                          {/* Button Design Option 02 */}
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleViewClick(record)}
                                className="flex flex-col items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 group"
                              >
                                <div className="p-1.5 bg-blue-600 text-white rounded-full group-hover:shadow-md group-hover:scale-110 transition-all">
                                  <EyeIcon className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-xs font-medium">
                                  View
                                </span>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(record.id)}
                                className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                              >
                                <div className="p-1.5 bg-gray-400 text-white rounded-full group-hover:bg-red-500 group-hover:shadow-md group-hover:scale-110 transition-all">
                                  <TrashIcon className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-xs font-medium">
                                  Delete
                                </span>
                              </button>
                            </div>
                          </td> */}

                          {/* Button Design Option 03 */}
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleViewClick(record)}
                                className="flex flex-col items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 group"
                              >
                                <div className="p-1.5 bg-blue-600 text-white rounded-full group-hover:shadow-md group-hover:scale-110 transition-all">
                                  <EyeIcon className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-xs font-medium">
                                  View
                                </span>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(record.id)}
                                className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                              >
                                <div className="p-1.5 bg-gray-400 text-white rounded-full group-hover:bg-red-500 group-hover:shadow-md group-hover:scale-110 transition-all">
                                  <TrashIcon className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-xs font-medium">
                                  Delete
                                </span>
                              </button>
                            </div>
                          </td> */}

                          {/* Button Design Option 04 */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewClick(record)}
                                className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all duration-200 ease-in-out hover:shadow-md"
                                title="View"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(record.id)}
                                className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-red-100 hover:text-red-700 transition-all duration-200 ease-in-out hover:shadow-md"
                                title="Delete"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>

      {/** Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setRecordToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast container */}
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
  );
}

export default ShowBulkArticleGenerationHistory;
