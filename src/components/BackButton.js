import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
const BackButton = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
        // Small delay to ensure navigation completes before scrolling
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    };
    return (_jsxs("button", { onClick: handleBack, className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back"] }));
};
export default BackButton;
