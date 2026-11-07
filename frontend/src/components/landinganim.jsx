import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";


export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
    },
  },
};

export const fadeRight = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
    },
  },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

export const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* Per-element scroll variants */

// Soft rise for cards and headings.
export const scrollRise = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Stair step: slides in from the left. Pass `custom={index}` so each step waits its turn.
export const scrollStair = {
  hidden: {
    opacity: 0,
    x: -32,
  },
  visible: (index = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// Gentle pop for small chips, pills and dots.
export const scrollPop = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: (index = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: index * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* Keyframes for the assessment demo. Inject once with <style>{demoKeyframes}</style>. */

export const demoKeyframes = `
@keyframes factIn {
  from { opacity: 0; transform: translate3d(0, 14px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes factDot {
  from { opacity: 0; transform: scale(0.4); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes barFill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

/* -------------------------
   Reveal Component
--------------------------*/

export function Reveal({
  children,
  className = "",
  variants = fadeUp,
  delay = 0,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------
   ScrollReveal Component
   Plays every time the element enters the viewport and reverses when it leaves.
   Use `as="li"` for list items and `custom` for the stagger index.
--------------------------*/

export function ScrollReveal({
  as = "div",
  children,
  className = "",
  style,
  variants = scrollRise,
  custom,
  delay = 0,
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      ref={ref}
      className={className}
      style={style}
      variants={variants}
      custom={custom}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion || isInView ? "visible" : "hidden"}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Component>
  );
}


export function Floating({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}


export function useCountUp(target, { duration = 1000, start = false } = {}) {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef(null);

  useEffect(() => {
  
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!start) return;

    const targetStr = String(target);
    const match = targetStr.match(/^-?\d+(\.\d+)?/);

    if (!match) {
      setDisplay(targetStr);
      return;
    }

    const number = parseFloat(match[0]);
    const suffix = targetStr.replace(match[0], "");
    let startTime = null;

    function animate(time) {
      if (startTime === null) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${(number * eased).toFixed(1)}${suffix}`);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, start, duration]);

  return display;
}