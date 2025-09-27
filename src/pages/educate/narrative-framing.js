import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle, Eye } from 'lucide-react';
const NarrativeFraming = () => {
    const navigate = useNavigate();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [currentSection, setCurrentSection] = useState(0);
    const [showAnswers, setShowAnswers] = useState({});
    // Scroll to top when section changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentSection]);
    const sections = [
        {
            id: 'introduction',
            title: 'Understanding Narrative Framing',
            content: `Narrative framing refers to how facts or events are presented in a way that influences how we interpret them. It's not about what is said, but *how* it's said.

**How Framing Works:**
- Same facts can be presented in multiple ways
- The frame shapes our emotional response
- Framing influences what we remember and how we act
- Often used unconsciously, but can be deliberate manipulation

**The Power of Perspective:**
Framing is everywhere - in news headlines, political speeches, marketing copy, and even casual conversations. The frame becomes the lens through which we see reality.

**Key Insight:**
The frame is not the picture. Learning to recognize framing allows you to step outside of it and see the underlying facts more clearly.

**Example:**
- "Unemployment falls to 4%" (positive frame - improvement)
- "Millions still jobless as unemployment hits 4%" (negative frame - ongoing problem)
- "Unemployment steady at 4%" (neutral frame - status quo)

Same data, completely different emotional impact.`
        },
        {
            id: 'techniques',
            title: 'Common Framing Techniques',
            content: `**Emotional Framing:**
- **Crisis Language**: "Unemployment crisis continues"
- **Success Language**: "Job market recovery accelerates"
- **Neutral Language**: "Employment data released"

**Temporal Framing:**
- **Past Focus**: "Worst unemployment since 2008"
- **Present Focus**: "Current unemployment at 4%"
- **Future Focus**: "Unemployment trending toward full employment"

**Comparison Framing:**
- **Relative to Expectations**: "Unemployment higher than predicted"
- **Relative to History**: "Unemployment at historic lows"
- **Relative to Others**: "Unemployment lower than European average"

**Scope Framing:**
- **Individual Focus**: "John lost his job in the downturn"
- **Group Focus**: "Manufacturing workers face uncertainty"
- **System Focus**: "Economic restructuring affects labor markets"

**Causation Framing:**
- **Agency**: "Government policies reduce unemployment"
- **Natural Forces**: "Economic cycles drive employment changes"
- **External Factors**: "Global trends impact local jobs"`
        },
        {
            id: 'practice',
            title: 'Practice: Identifying Frames',
            content: 'Let\'s practice identifying different narrative frames. For each example, identify the framing technique and consider alternative ways the same information could be presented.',
            interactive: true
        },
        {
            id: 'defense',
            title: 'Defending Against Manipulative Framing',
            content: `**Frame Detection Strategies:**

**1. Ask the Frame Questions:**
- What's being emphasized in this presentation?
- What's being minimized or left out?
- What emotion is this trying to evoke?
- How else could this same information be framed?

**2. Look for Missing Context:**
- What's the historical context?
- How does this compare to similar situations?
- What are the underlying numbers or facts?
- Who benefits from this particular framing?

**3. Consider Alternative Frames:**
- How would someone with opposite views present this?
- What would a neutral, factual presentation look like?
- What frame would emphasize different aspects?

**4. Separate Facts from Interpretation:**
- What are the verifiable facts?
- What parts are opinion or interpretation?
- What assumptions are built into the frame?

**5. Check Your Emotional Response:**
- How does this framing make you feel?
- Is that emotional response helping or hindering clear thinking?
- What would you think if you felt differently about it?

**Remember:**
Good journalism and honest communication acknowledge their framing choices. Be suspicious of sources that present their frame as the only possible interpretation.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            original: "Despite economic headwinds, resilient consumers continue spending, driving robust retail growth that defies expert predictions.",
            question: 'What framing techniques do you see here?',
            analysis: 'This uses positive framing with: 1) Adversarial language ("despite headwinds"), 2) Heroic framing ("resilient consumers"), 3) Success emphasis ("robust growth"), 4) Authority contradiction ("defies expert predictions"). It frames spending as positive resilience rather than potential financial irresponsibility.',
            explanation: 'The same data could be framed as "Consumers continue spending despite economic uncertainty" (neutral) or "Dangerous consumer debt levels rise as spending outpaces income" (negative).'
        },
        {
            id: 'example2',
            original: "Crime rates plummet to historic lows as community policing initiatives transform neighborhoods across the city.",
            question: 'How is this information being framed?',
            analysis: 'This uses success framing with: 1) Dramatic improvement language ("plummet"), 2) Historical significance ("historic lows"), 3) Causal attribution ("community policing initiatives"), 4) Transformation narrative ("transform neighborhoods"). It emphasizes policy success.',
            explanation: 'Alternative frames: "Crime rates continue gradual decline" (neutral) or "Despite lower crime rates, residents still report feeling unsafe" (different emphasis).'
        },
        {
            id: 'example3',
            original: "Tech giants slash workforce as AI automation threatens millions of traditional jobs in unprecedented industry upheaval.",
            question: 'What emotional and narrative frames are being used?',
            analysis: 'This uses crisis framing with: 1) Violent language ("slash workforce"), 2) Threat framing ("threatens millions"), 3) Scale amplification ("unprecedented upheaval"), 4) Technology fear ("AI automation"). It frames technological change as destructive rather than transformative.',
            explanation: 'Alternative frames: "Companies adapt workforce as technology evolves" (neutral) or "AI creates new opportunities as industries modernize" (positive).'
        }
    ];
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['narrative-framing'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-amber-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4", children: _jsx(BookOpen, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Narrative Framing" }), _jsx("p", { className: "text-lg text-gray-600", children: "How stories shape our perception of reality" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Eye, { className: "w-5 h-5 text-amber-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Framing Analysis ", index + 1] }), _jsxs("p", { className: "text-gray-700 mb-4 p-4 bg-gray-50 rounded-md italic", children: ["\"", example.original, "\""] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("button", { onClick: () => setShowAnswers(prev => ({ ...prev, [example.id]: true })), disabled: showAnswers[example.id], className: "bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showAnswers[example.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showAnswers[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-blue-600", children: [_jsx("strong", { children: "Alternative Framing:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition", children: "Next" }))] })] }) }));
};
export default NarrativeFraming;
