import React, { useState, useEffect, useRef } from 'react';
import { ChevronDoubleUpIcon } from '@heroicons/react/24/outline';

function FloatingButtonForScrollTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Get the custom scrollbar container
    scrollContainerRef.current = document.querySelector('.custom-scrollbar');

    const handleScroll = (e) => {
      const scrolled = e.target.scrollTop;
      setShowScrollTop(scrolled > 50);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-12 p-3
        bg-blue-400 hover:bg-blue-500
        text-white rounded-xl shadow-lg
        transition-all duration-300 transform
        hover:shadow-blue-500/50 hover:-translate-y-1
        z-[9999]
        ${showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
      `}
    >
      <ChevronDoubleUpIcon className="h-6 w-6" />
    </button>
  );
}

export default FloatingButtonForScrollTop;
