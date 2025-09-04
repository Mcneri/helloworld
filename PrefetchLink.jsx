import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { prefetchPage, prefetchData } from "./utils/prefetch";

export default function PrefetchLink({ 
  to, 
  children, 
  prefetchOn = "hover", // "hover", "viewport", "immediate", "none"
  prefetchData: shouldPrefetchData = false,
  className,
  ...props 
}) {
  const linkRef = useRef(null);
  const [hasPrefetched, setHasPrefetched] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);

  const handlePrefetch = () => {
    if (hasPrefetched) return;
    
    try {
      // Prefetch the page component
      prefetchPage(to);
      
      // Optionally prefetch data for the page
      if (shouldPrefetchData) {
        prefetchData(to);
      }
      
      setHasPrefetched(true);
    } catch (error) {
      console.warn("Prefetch failed for:", to, error);
    }
  };

  // Hover-based prefetching
  const handleMouseEnter = () => {
    if (prefetchOn === "hover") {
      handlePrefetch();
    }
  };

  // Viewport-based prefetching using Intersection Observer
  useEffect(() => {
    if (prefetchOn !== "viewport" || !linkRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInViewport) {
            setIsInViewport(true);
            handlePrefetch();
          }
        });
      },
      {
        rootMargin: "100px", // Start prefetching 100px before the link enters viewport
        threshold: 0.1
      }
    );

    observer.observe(linkRef.current);

    return () => {
      if (linkRef.current) {
        observer.unobserve(linkRef.current);
      }
    };
  }, [prefetchOn, isInViewport]);

  // Immediate prefetching
  useEffect(() => {
    if (prefetchOn === "immediate") {
      // Delay immediate prefetching slightly to not block initial page load
      const timer = setTimeout(handlePrefetch, 100);
      return () => clearTimeout(timer);
    }
  }, [prefetchOn]);

  return (
    <Link
      ref={linkRef}
      to={to}
      onMouseEnter={handleMouseEnter}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}