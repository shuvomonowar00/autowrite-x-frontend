import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CommandLineIcon,
  XMarkIcon,
  ArrowUturnLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  LinkIcon,
  LinkSlashIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { FaWordpress, FaBlogger, FaMedium } from 'react-icons/fa';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import {
  $getRoot,
  $isTextNode,
  $createParagraphNode,
  $createTextNode,
  FORMAT_TEXT_COMMAND,
} from 'lexical';
import { $isLinkNode } from '@lexical/link';
import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode } from '@lexical/rich-text';
import FloatingButtonForScrollTop from '../commonFeatures/FloatingButtonForScrollTop';
import api from '../../lib/api';
import { useSidebar } from '../../compulsory/client/contexts/ClientSidebarContext';

const EditSpecificArticle = () => {
  const { id } = useParams();
  const [record, setRecord] = useState({});
  const [isSticky, setIsSticky] = useState(false);
  const [isWordPressModalOpen, setIsWordPressModalOpen] = useState(false);
  const [wordpressData, setWordpressData] = useState({
    wpUrl: '',
    wpUsername: '',
    wpPassword: '',
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const navigate = useNavigate();
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [editor, setEditor] = useState(null);
  const [saveArticle, setSaveArticle] = useState(false);
  const [deleteArticle, setDeleteArticle] = useState(false);
  const [publishArticleToWordPress, setPublishArticleToWordPress] =
    useState(false);

  // Render the specific article
  useEffect(() => {
    api
      .get(`/api/contents/articles/show/${id}`)
      .then((response) => {
        setRecord(response.data);
        setSaveArticle(true);
        setDeleteArticle(true);
        setPublishArticleToWordPress(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error(error.message);
      });
  }, []);

  // Sticky the title of the article when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const titleElement = document.querySelector('.title-header');
      if (titleElement) {
        const position = titleElement.getBoundingClientRect();
        setIsSticky(position.top <= 64); // 4rem = 64px
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add nodes to editor config
  const editorConfig = {
    namespace: 'MyEditor',
    nodes: [HeadingNode, LinkNode],
    theme: {
      toolbar: 'flex gap-2 p-2 bg-gray-100 border-b',
      toolbarButton: 'p-2 rounded hover:bg-gray-200',
      toolbarButtonActive: 'bg-blue-500 text-white',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
      },
      link: 'text-blue-600 hover:text-blue-800 cursor-pointer',
    },
    onError(error) {
      console.error(error);
    },
  };

  // Create Toolbar Component
  // Tollbar Design 01
  // const Toolbar = () => {
  //   const [editor] = useLexicalComposerContext();

  //   const formatText = (format) => {
  //     editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  //   };

  //   const insertLink = (url) => {
  //     editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  //   };

  //   const removeLink = () => {
  //     editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  //   };

  //   return (
  //     <div className="flex gap-2 p-2 bg-gray-100 border-b">
  //       <button
  //         onClick={() => formatText('bold')}
  //         className="p-2 rounded hover:bg-gray-200"
  //       >
  //         <strong>B</strong>
  //       </button>
  //       <button
  //         onClick={() => formatText('italic')}
  //         className="p-2 rounded hover:bg-gray-200"
  //       >
  //         <em>I</em>
  //       </button>
  //       <button
  //         onClick={() => formatText('underline')}
  //         className="p-2 rounded hover:bg-gray-200"
  //       >
  //         <u>U</u>
  //       </button>
  //       <button
  //         onClick={() => setIsLinkModalOpen(true)}
  //         className="p-2 rounded hover:bg-gray-200"
  //         title="Insert Link"
  //       >
  //         <LinkIcon className="h-4 w-4" />
  //       </button>
  //       <button
  //         onClick={removeLink}
  //         className="p-2 rounded hover:bg-gray-200"
  //         title="Remove Link"
  //       >
  //         <LinkSlashIcon className="h-4 w-4" />
  //       </button>
  //       <LinkModal
  //         isOpen={isLinkModalOpen}
  //         onClose={() => setIsLinkModalOpen(false)}
  //         onSubmit={insertLink}
  //       />
  //     </div>
  //   );
  // };

  // Tollbar Design 02
  // Replace your current Toolbar component with this enhanced version
  const Toolbar = () => {
    const [editor] = useLexicalComposerContext();
    const [activeFormat, setActiveFormat] = useState({
      bold: false,
      italic: false,
      underline: false,
    });

    // Track active format
    useEffect(() => {
      const updateToolbar = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          // Check for bold, italic, underline
          const fontWeight = document.queryCommandState('bold');
          const fontStyle = document.queryCommandState('italic');
          const textDecoration = document.queryCommandState('underline');

          setActiveFormat({
            bold: fontWeight,
            italic: fontStyle,
            underline: textDecoration,
          });
        }
      };

      document.addEventListener('selectionchange', updateToolbar);
      return () =>
        document.removeEventListener('selectionchange', updateToolbar);
    }, []);

    const formatText = (format) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
      // Toggle state manually for better UX feedback
      setActiveFormat((prev) => ({
        ...prev,
        [format]: !prev[format],
      }));
    };

    const insertLink = (url, text) => {
      // If text is provided, we'll create a link with custom text
      if (text.trim()) {
        editor.update(() => {
          // Get the current selection
          const selection = $getSelection();

          if (selection) {
            // Delete any selected text (this will be replaced with our custom text)
            selection.removeText();

            // Create a text node with our custom text
            const textNode = $createTextNode(text);

            // Insert the text node at the current selection
            selection.insertNodes([textNode]);

            // Now select just this text node for the link
            textNode.select();

            // Apply the link to the newly inserted text
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
          }
        });

        // Apply the link with proper formatting
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
          url: url,
          target: '_blank', // Optional: opens links in new tab
          rel: 'noopener noreferrer', // Optional: security best practice for external links
        });
      } else {
        // Just create a link with the existing selected text
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
          url: url,
          target: '_blank',
          rel: 'noopener noreferrer',
        });
      }
    };

    const removeLink = () => {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    };

    // Apply heading format
    const formatHeading = (level) => {
      // Implementation depends on how your editor handles headings
      // For example with Lexical you might use $createHeadingNode
      console.log(`Format as h${level}`);
    };

    return (
      <div className="px-4 py-2 bg-white border-b border-gray-200 flex flex-wrap items-center gap-2">
        {/* Text formatting section */}
        <div className="flex items-center bg-gray-50 rounded-lg p-1 mr-2">
          <button
            onClick={() => formatText('bold')}
            className={`p-2 rounded-md hover:bg-gray-200 transition-all ${
              activeFormat.bold ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            title="Bold (Ctrl+B)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6.5 19.5h3v-1.5c0-1.5 1.5-3 3-3s3 1.5 3 3v1.5h3v-1.5a4.5 4.5 0 10-9 0v1.5z" />
            </svg>
          </button>
          <button
            onClick={() => formatText('italic')}
            className={`p-2 rounded-md hover:bg-gray-200 transition-all ${
              activeFormat.italic
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700'
            }`}
            title="Italic (Ctrl+I)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                d="M15 4.5H9M13.5 19.5h-6M15 4.5l-4.5 15M15 4.5h3M9 4.5H6m7.5 15H9m4.5 0h3m-7.5 0H6"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
          <button
            onClick={() => formatText('underline')}
            className={`p-2 rounded-md hover:bg-gray-200 transition-all ${
              activeFormat.underline
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700'
            }`}
            title="Underline (Ctrl+U)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                d="M5.25 3v10.125c0 3.037 2.463 5.5 5.5 5.5s5.5-2.463 5.5-5.5V3"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
              />
              <path
                fillRule="evenodd"
                d="M3.75 18.75h15a.75.75 0 000-1.5h-15a.75.75 0 000 1.5z"
              />
            </svg>
          </button>
        </div>

        {/* Heading formats */}
        <div className="flex items-center bg-gray-50 rounded-lg p-1 mr-2">
          <select
            onChange={(e) => formatHeading(e.target.value)}
            className="text-sm py-1.5 pl-3 pr-8 rounded border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            defaultValue=""
          >
            <option value="" disabled>
              Format
            </option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="p">Paragraph</option>
            <option value="quote">Blockquote</option>
          </select>
        </div>

        {/* Links section */}
        <div className="flex items-center bg-gray-50 rounded-lg p-1">
          <button
            onClick={() => setIsLinkModalOpen(true)}
            className="p-2 rounded-md hover:bg-gray-200 text-gray-700 transition-all"
            title="Insert Link"
          >
            <LinkIcon className="h-5 w-5" />
          </button>
          <button
            onClick={removeLink}
            className="p-2 rounded-md hover:bg-gray-200 text-gray-700 transition-all"
            title="Remove Link"
          >
            <LinkSlashIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Lists and indentation */}
        <div className="flex items-center bg-gray-50 rounded-lg p-1 ml-2">
          <button
            className="p-2 rounded-md hover:bg-gray-200 text-gray-700 transition-all"
            title="Bullet List"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="p-2 rounded-md hover:bg-gray-200 text-gray-700 transition-all"
            title="Numbered List"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M4 18h1M4 14h2v4"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Word count indicator - moved to toolbar for immediate feedback */}
        <div className="ml-auto flex items-center">
          <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <DocumentTextIcon className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-700">
              {wordCount} words
            </span>
          </div>
        </div>

        <LinkModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          onSubmit={insertLink}
        />
      </div>
    );
  };

  // Create initial editor state with formatted content
  const createInitialEditorState = (markdownContent) => {
    return (editor) => {
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        // Split content into lines
        const lines = markdownContent.split('\n');

        lines.forEach((line) => {
          const paragraph = $createParagraphNode();

          // Handle headers
          if (line.startsWith('#')) {
            const level = line.match(/^#+/)[0].length;
            const text = line.replace(/^#+\s/, '');
            const headingNode = $createTextNode(text);
            headingNode.setFormat('bold');
            paragraph.append(headingNode);
          }
          // Handle bold text
          else if (line.includes('**')) {
            const parts = line.split(/\*\*/);
            parts.forEach((part, index) => {
              const textNode = $createTextNode(part);
              if (index % 2 === 1) {
                // Bold text
                textNode.setFormat('bold');
              }
              paragraph.append(textNode);
            });
          }
          // Handle italic text
          else if (line.includes('*')) {
            const parts = line.split(/\*/);
            parts.forEach((part, index) => {
              const textNode = $createTextNode(part);
              if (index % 2 === 1) {
                // Italic text
                textNode.setFormat('italic');
              }
              paragraph.append(textNode);
            });
          }
          // Handle lists
          else if (line.startsWith('- ')) {
            const text = line.replace(/^-\s/, '');
            paragraph.append($createTextNode('• ' + text));
          }
          // Regular text
          else {
            paragraph.append($createTextNode(line));
          }

          root.append(paragraph);
        });
      });
    };
  };

  // Add LinkModal component
  // LinkModal Component Design 01
  // const LinkModal = ({ isOpen, onClose, onSubmit }) => {
  //   return isOpen ? (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  //       <div className="bg-white p-4 rounded-lg">
  //         <input
  //           type="text"
  //           placeholder="Enter URL"
  //           value={linkUrl}
  //           onChange={(e) => setLinkUrl(e.target.value)}
  //           className="border p-2 rounded"
  //         />
  //         <div className="flex gap-2 mt-4">
  //           <button
  //             onClick={() => {
  //               onSubmit(linkUrl);
  //               setLinkUrl('');
  //               onClose();
  //             }}
  //             className="px-4 py-2 bg-blue-500 text-white rounded"
  //           >
  //             Add Link
  //           </button>
  //           <button
  //             onClick={() => {
  //               setLinkUrl('');
  //               onClose();
  //             }}
  //             className="px-4 py-2 bg-gray-300 rounded"
  //           >
  //             Cancel
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   ) : null;
  // };

  // LinkModal Component Design 02
  const LinkModal = ({ isOpen, onClose, onSubmit }) => {
    const [url, setUrl] = useState(linkUrl);
    const [text, setText] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(false);
    const modalRef = useRef(null);
    const urlInputRef = useRef(null);
    const { sidebarCollapsed } = useSidebar();

    useEffect(() => {
      // Get selected text when modal opens
      if (isOpen) {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          setText(selection.toString());
        }

        // Focus the URL input field when modal opens
        setTimeout(() => {
          if (urlInputRef.current) {
            urlInputRef.current.focus();
          }
        }, 100);
      }
    }, [isOpen]);

    // Validate URL format
    useEffect(() => {
      try {
        // Simple validation for URL format
        setIsValidUrl(
          url.trim() !== '' && /^(https?:\/\/|www\.)[^\s]+\.[^\s]+/.test(url)
        );
      } catch (e) {
        setIsValidUrl(false);
      }
    }, [url]);

    // Close modal when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onClose]);

    // Handle keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (isOpen) {
          if (e.key === 'Escape') {
            onClose();
          } else if (e.key === 'Enter' && e.ctrlKey && isValidUrl) {
            handleSubmit();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isValidUrl, onClose]);

    const handleSubmit = () => {
      // Ensure both values get passed to the parent component
      onSubmit(url, text);
      setUrl(''); // Reset after submit
      setText(''); // Reset text field too
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 mt-[4rem] transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[6rem]' : 'ml-[21rem]'
        }`}
      >
        <div
          ref={modalRef}
          className="bg-white rounded-xl shadow-xl w-[32rem] transform transition-all duration-300 animate-fadeIn"
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-2 rounded-lg">
                <LinkIcon className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Insert Link
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-red-50 transition-colors group"
              aria-label="Close"
              title="Close (Esc)"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="linkUrl"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Link URL
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    id="linkUrl"
                    ref={urlInputRef}
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg 
                    appearance-none transition-all duration-200
                    hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                  />
                  {url.trim() !== '' && (
                    <span
                      className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isValidUrl ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {isValidUrl ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
                {url.trim() !== '' && !isValidUrl && (
                  <p className="mt-1.5 text-xs text-red-500">
                    Please enter a valid URL (e.g., https://example.com)
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="linkText"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Link Text{' '}
                  <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <input
                  id="linkText"
                  type="text"
                  placeholder="Display text for link"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg 
                  appearance-none transition-all duration-200
                  hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Leave empty to use the selected text or URL as display text
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValidUrl}
              className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                !isValidUrl
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              Insert Link
            </button>
          </div>

          {/* Keyboard shortcuts help */}
          <div className="absolute bottom-3 left-5 flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md">
              Ctrl+Enter
            </span>
            <span>to confirm</span>
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md">
              Esc
            </span>
            <span>to cancel</span>
          </div>
        </div>
      </div>
    );
  };

  // Add word counting function
  const calculateWordCount = (editorState) => {
    editorState.read(() => {
      const text = $getRoot().getTextContent();
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(words.length);
    });
  };

  // Save the updated content
  const handleSaveClick = () => {
    if (!editor) return;

    editor.read(() => {
      const root = $getRoot();
      let markdownContent = '';
      let isFirstParagraph = true;

      root.getChildren().forEach((paragraph) => {
        // Add newline between paragraphs, but not before first one
        if (!isFirstParagraph) {
          markdownContent += '\n';
        }
        isFirstParagraph = false;

        let paragraphContent = '';
        paragraph.getChildren().forEach((node) => {
          if ($isTextNode(node)) {
            const format = node.getFormat();
            let text = node.getTextContent();

            if (format & 1) text = `**${text}**`;
            if (format & 2) text = `*${text}*`;
            if (format & 4) text = `__${text}__`;

            paragraphContent += text;
          } else if ($isLinkNode(node)) {
            const url = node.getURL();
            const text = node.getTextContent();
            paragraphContent += `[${text}](${url})`;
          }
        });

        markdownContent += paragraphContent;
      });

      const finalContent = markdownContent.trim();

      api
        .put(`/api/contents/articles/update/${record.id}`, {
          article_content: finalContent,
        })
        .then((response) => {
          toast.success('Content updated successfully');
        })
        .catch((error) => {
          console.error('Error updating content:', error);
          toast.error('Failed to update content');
        });
    });
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
          toast.success('Article deleted successfully', {
            onClose: () => navigate('/all-post-history'),
          });
          setDeleteModalOpen(false);
          setRecordToDelete(null);
        })
        .catch((error) => {
          console.error('Error deleting record:', error);
          toast.error('Failed to delete article');
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
        <div className="bg-white rounded-lg p-6 w-[30rem]">
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

  // Add WordPress Modal Component
  const WordPressPublishModal = ({ isOpen, onClose, articleID }) => {
    const { sidebarCollapsed } = useSidebar();
    const [wordPressSites, setWordPressSites] = useState([]);
    const [currentWordPressSite, setCurrentWordPressSite] = useState({
      wpUrl: '',
      wpUsername: '',
      wpPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [WordPressPublishFormErrors, setWordPressPublishFormErrors] =
      useState({
        wpUrl: '',
        wpUsername: '',
        wpPassword: '',
      });
    const [isVerifying, setIsVerifying] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    if (!isOpen) return null;

    const handleFormInputDataChange = (e) => {
      setCurrentWordPressSite((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

    const handleVerify = async (e) => {
      e.preventDefault();

      setIsVerifying(true);
      setWordPressPublishFormErrors({
        wpUrl: '',
        wpUsername: '',
        wpPassword: '',
      });

      try {
        const response = await api.post(
          '/api/contents/articles/verify-wordpress-site',
          currentWordPressSite
        );
        if (response.data.success) {
          setWordPressSites((prev) => [...prev, currentWordPressSite]);
          setCurrentWordPressSite({
            wpUrl: '',
            wpUsername: '',
            wpPassword: '',
          });
          toast.success('WordPress site verified successfully!');
          setIsVerifying(false);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          const errorMessage = error.response.data.error;

          if (errorMessage.includes('username')) {
            setWordPressPublishFormErrors((prev) => ({
              ...prev,
              wpUsername: 'Invalid WordPress username',
            }));
          } else if (errorMessage.includes('password')) {
            setWordPressPublishFormErrors((prev) => ({
              ...prev,
              wpPassword: 'Invalid WordPress password',
            }));
          }
        }

        toast.error(error.response?.data?.error || 'Failed to verify site');
        setIsVerifying(false);
      }
    };

    const handleAddSite = (e) => {
      e.preventDefault();
      handleVerify(e);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsPublishing(true);

      try {
        const response = await api.post('/api/contents/articles/publish', {
          articleID: articleID,
          wordPressSites: wordPressSites,
        });

        toast.success(
          `Article published successfully ${response.data.success_count} of ${response.data.total_sites}!`
        );
        setIsPublishing(false);
        setWordPressSites([]);
        onClose();
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Failed to publish article'
        );
        setIsPublishing(false);
      }
    };

    return (
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 mt-[4rem] transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[6rem]' : 'ml-[21rem]'
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl w-[45rem] p-6 max-h-[40rem] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-row gap-2">
              <FaWordpress className="h-8 w-8 text-blue-500" />
              <h3 className="text-2xl font-semibold text-blue-500">
                Publish to WordPress Sites
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-50 rounded-xl"
            >
              <XMarkIcon className="h-8 w-8 text-gray-400 hover:text-red-500" />
            </button>
          </div>

          {/* Add New Site Form */}
          <div>
            <form onSubmit={handleAddSite} className="space-y-4">
              <div className="border px-4 py-6 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WordPress Site URL
                  </label>
                  <input
                    type="url"
                    name="wpUrl"
                    value={currentWordPressSite.wpUrl}
                    onChange={handleFormInputDataChange}
                    placeholder="https://your-site.com"
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl 
        appearance-none
        transition-all duration-200
        hover:border-blue-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="wpUsername"
                    value={currentWordPressSite.wpUsername}
                    onChange={handleFormInputDataChange}
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl 
        appearance-none
        transition-all duration-200
        hover:border-blue-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="wpPassword"
                      value={currentWordPressSite.wpPassword}
                      onChange={handleFormInputDataChange}
                      className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl 
        appearance-none
        transition-all duration-200
        hover:border-blue-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                {/* <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Site
                </button> */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className={`flex items-center justify-center gap-2 px-4 py-2 ${
                    isVerifying
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white rounded-lg transition-colors`}
                >
                  {isVerifying ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Add Site'
                  )}
                </button>
                {/* {wordPressSites.length > 0 && (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Publish to All Sites
                  </button>
                )} */}
              </div>
            </form>
          </div>

          {/* Added Sites Table */}
          <div className=" mt-4">
            <div className="mb-6 border p-4 rounded-lg">
              <div className="relative border rounded-lg overflow-hidden">
                {/* Fixed Header */}
                <table className="w-full table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-2/5 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Site URL
                      </th>
                      <th className="w-2/5 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Username
                      </th>
                      <th className="w-1/5 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                </table>

                {/* Scrollable Body */}
                <div className="max-h-[15rem] overflow-y-auto custom-scrollbar">
                  <table className="w-full table-fixed">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {wordPressSites.map((site, index) => (
                        <tr key={index}>
                          <td className="w-2/5 px-6 py-4 whitespace-nowrap text-sm">
                            <a
                              href={site.wpUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1"
                            >
                              {site.wpUrl}
                              <LinkIcon className="h-4 w-4" />
                            </a>
                            {/* <a
                              href={site.wpUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1"
                            >
                              {site.wpUrl}
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a> */}
                          </td>
                          <td className="w-2/5 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {site.wpUsername}
                          </td>
                          <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() =>
                                setWordPressSites((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex flex-row gap-2 px-4 py-2 text-red-400 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <ArrowUturnLeftIcon className="h-5 w-5" />
                Cancel
              </button>
              {/* {wordPressSites.length > 0 ? (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                >
                  Publish to All Sites
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg opacity-50 cursor-not-allowed"
                  title="Add at least one WordPress site to publish"
                >
                  Publish to All Sites
                </button>
              )} */}
              <div>
                {wordPressSites.length > 0 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isPublishing}
                    className={`flex items-center justify-center gap-2 px-4 py-2 ${
                      isPublishing
                        ? 'bg-green-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white rounded-lg transition-all duration-200`}
                  >
                    {isPublishing ? (
                      <>
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      'Publish Article'
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg opacity-50 cursor-not-allowed"
                    title="Add at least one WordPress site to publish"
                  >
                    Publish Article
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* Component's main return statement */
  return (
    <>
      <div className="h--full pb-4 w-full rounded-lg shadow-lg">
        <div className="min-h-full bg-white shadow-2xl">
          <div className="relative z-10">
            <div className="bg-[rgba(245, 244, 243, 1)] pb-4 pt-3 -z-10">
              {/* Action buttons */}
              <div className="mx-4 flex justify-start gap-2 border-2 border-blue-100 rounded-md bg-blue-50 px-4 py-4">
                <div className="flex flex-row gap-2">
                  <CommandLineIcon
                    className="h-8 w-8 text-gray-600 text-center my-auto"
                    title="Actions"
                  />
                  <div className="h-10 border-l-2 border-gray-300 mx-2 my-auto"></div>
                </div>
                <div className="flex flex-row gap-2">
                  <button
                    onClick={() => {
                      handleSaveClick();
                    }}
                    disabled={!saveArticle}
                    className={`flex flex-row gap-2 px-4 py-2 ${
                      !saveArticle
                        ? 'bg-gray-300 rounded-lg cursor-not-allowed'
                        : 'bg-blue-500 rounded-lg hover:bg-blue-600'
                    } text-white`}
                  >
                    <DocumentCheckIcon className="h-5 w-5" />
                    Save Article
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteClick(record.id);
                    }}
                    disabled={!deleteArticle}
                    className={`flex flex-row gap-2 px-4 py-2 ${
                      !deleteArticle
                        ? 'bg-gray-300 rounded-lg cursor-not-allowed'
                        : 'bg-blue-500 rounded-lg hover:bg-blue-600'
                    } text-white`}
                  >
                    <TrashIcon className="h-5 w-5" />
                    Delete Article
                  </button>
                  <button
                    onClick={() => setIsWordPressModalOpen(true)}
                    disabled={!publishArticleToWordPress}
                    className={`flex flex-row gap-2 px-4 py-2 ${
                      !publishArticleToWordPress
                        ? 'bg-gray-300 rounded-lg cursor-not-allowed'
                        : 'bg-blue-500 rounded-lg hover:bg-blue-600'
                    } text-white`}
                  >
                    <FaWordpress className="h-5 w-5" />
                    Publish to WordPress
                  </button>
                </div>
              </div>
              <div className="mt-4 mx-4">
                {record?.article_content ? (
                  <LexicalComposer
                    initialConfig={{
                      ...editorConfig,
                      editorState: createInitialEditorState(
                        record.article_content
                      ),
                      onError(error) {
                        console.error(error);
                      },
                    }}
                  >
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl border border-gray-200 transition-all duration-300">
                      {/* Toolbar Section */}
                      <div className="sticky top-[4rem] z-50 border-b border-gray-100 bg-white rounded-t-xl p-2 shadow-sm">
                        <Toolbar />
                      </div>

                      {/* Editor Content */}
                      <div className="px-8 py-6">
                        <RichTextPlugin
                          contentEditable={
                            <ContentEditable
                              className="min-h-[600px] max-w-none prose prose-lg prose-slate 
                focus:outline-none 
                prose-headings:font-bold 
                prose-h1:text-3xl prose-h1:mb-4
                prose-h2:text-2xl prose-h2:mb-3
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-blue-600 hover:prose-a:text-blue-700
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500
                prose-strong:text-gray-900
                prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:marker:text-blue-500"
                            />
                          }
                        />
                        <HistoryPlugin />
                        <LinkPlugin />
                        <OnChangePlugin
                          onChange={(editorState) => {
                            setEditor(editorState);
                            calculateWordCount(editorState);
                          }}
                        />
                      </div>

                      {/* Footer/Status Bar */}
                      <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="px-8 py-3 flex flex-wrap items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 flex items-center">
                              <DocumentTextIcon className="h-5 w-5 text-blue-400 mr-1.5" />
                              <span className="font-medium text-gray-700">
                                {wordCount}
                              </span>
                              <span className="text-gray-500 ml-1">words</span>
                            </span>

                            <div className="h-4 border-l border-gray-200 mx-1"></div>

                            <span className="text-xs text-gray-500">
                              Reading time: ~
                              {Math.max(1, Math.ceil(wordCount / 200))} min
                            </span>
                          </div>

                          <div className="flex items-center">
                            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                              <div
                                className={`w-2 h-2 rounded-full ${wordCount > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                              ></div>
                              <span className="text-xs font-medium text-blue-700">
                                {wordCount === 0
                                  ? 'No content'
                                  : wordCount < 300
                                    ? 'Short article'
                                    : wordCount < 800
                                      ? 'Medium article'
                                      : 'Long article'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Word count progress bar - shows visual indication of article length */}
                        <div className="h-1 w-full bg-gray-100">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300"
                            style={{
                              width: `${Math.min(100, (wordCount / 1000) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </LexicalComposer>
                ) : (
                  <div className="min-h-[600px] flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl border border-gray-200">
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full animate-spin"></div>
                      <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-500 rounded-full animate-spin-reverse"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <DocumentTextIcon className="h-8 w-8 text-blue-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Loading Article
                      </h3>
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      </div>
                      <p className="text-gray-500 mt-2">
                        Please wait while we fetch your content
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add FloatingButtonForScrollTop */}
      <FloatingButtonForScrollTop />
      {/* WordPress Publish Modal */}
      <WordPressPublishModal
        isOpen={isWordPressModalOpen}
        onClose={() => setIsWordPressModalOpen(false)}
        articleID={record.id}
      />
      {/** Delete Confirmation Modal */}
      <div>
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setRecordToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
      <div>
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
    </>
  );
};

export default EditSpecificArticle;
