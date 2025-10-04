import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import OmissionHandler from '@/components/OmissionHandler';
import BackButton from '@/components/BackButton';
const OmissionsPage = () => {
    return (_jsx("div", { className: "min-h-screen bg-white", children: _jsxs("div", { className: "max-w-4xl mx-auto p-8", children: [_jsx(BackButton, {}), _jsx(OmissionHandler, {})] }) }));
};
export default OmissionsPage;
