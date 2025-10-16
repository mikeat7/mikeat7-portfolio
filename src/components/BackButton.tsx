*** src/components/BackButton.tsx
@@
-import React from 'react';
-import { useNavigate } from 'react-router-dom';
-import { ArrowLeft } from 'lucide-react';
+import React from "react";
+import { useNavigate } from "react-router-dom";
+import { ArrowLeft } from "lucide-react";
 
-const BackButton: React.FC = () => {
+type Props = {
+  /** Route to navigate to if there's no prior history (fresh load). */
+  fallback?: string;
+  className?: string;
+  label?: string;
+};
+
+const BackButton: React.FC<Props> = ({ fallback, className, label = "Back" }) => {
   const navigate = useNavigate();
 
   const handleBack = () => {
-    navigate(-1);
+    if (window.history.length > 1) {
+      navigate(-1);
+    } else if (fallback) {
+      navigate(fallback);
+    } else {
+      // No history and no fallback → do nothing (matches current behavior)
+      return;
+    }
     // Small delay to ensure navigation completes before scrolling
     setTimeout(() => {
       window.scrollTo(0, 0);
     }, 100);
   };
 
   return (
     <button
       onClick={handleBack}
-      className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition"
+      className={
+        className ??
+        "flex items-center text-sm text-blue-600 hover:text-blue-800 transition"
+      }
     >
       <ArrowLeft className="w-4 h-4 mr-1" />
-      Back
+      {label}
     </button>
   );
 };
 
 export default BackButton;

