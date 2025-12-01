import * as motion from "motion/react-client";

export default function PageTransition({ children }) {
  return (
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.45, ease: "easeOut" }}
>

      {children}
    </motion.div>
  );
}
