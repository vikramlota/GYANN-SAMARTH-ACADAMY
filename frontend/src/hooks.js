import { useEffect, useState, useRef } from 'react';

// Hook to detect when element enters viewport
export const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

// Hook to animate numbers
export const useCounter = (end, duration = 1500) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useScrollReveal();
  const counted = useRef(false);

  useEffect(() => {
    if (isVisible && !counted.current) {
      counted.current = true;
      let start = 0;
      const stepTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [isVisible, end, duration]);

  return [ref, count];
};