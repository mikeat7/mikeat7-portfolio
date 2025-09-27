import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import TestingSuite from '@/components/TestingSuite';
import BackButton from '@/components/BackButton';
const TestingPage = () => {
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [_jsx(BackButton, {}), _jsx(TestingSuite, {})] }) }));
};
export default TestingPage;
