import { useEffect, useRef } from 'react';

const useAutoScroll = (triggerDistance = 100) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.boundingClientRect.top <= triggerDistance) {
          window.scrollBy({ top: -100, behavior: 'smooth' });
        }
      });
    };

    const observer = new IntersectionObserver(handleScroll, {
      root: null,
      threshold: 0.1,
    });

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => {
      if (scrollRef.current) {
        observer.unobserve(scrollRef.current);
      }
    };
  }, [triggerDistance]);

  return scrollRef;
};

export default useAutoScroll;
