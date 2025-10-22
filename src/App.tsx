// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { VXProvider } from "@/context/VXProvider";
import HomePage from "@/pages/index";
import Educate from "@/pages/educate";
import EpistemicFoundations from "@/pages/educate/epistemic-foundations";
import BullshitDetection from "@/pages/educate/bullshit-detection";
import LogicalFallacies from "@/pages/educate/logical-fallacies";
import AIAwareness from "@/pages/educate/ai-awareness";
import AdvancedPractice from "@/pages/educate/advanced-practice";
import Analyze from "@/pages/analyze"; 
import Wisdom from "@/pages/wisdom";
import Train from "@/pages/train";
import Paper from "@/pages/paper";
import BotDetection from "@/pages/bot-detection";
import Omissions from "@/pages/omissions";
import BullshitPatterns from "@/pages/educate/bullshit-patterns";
import Testing from "@/pages/testing";
import VaguenessLesson from "@/pages/educate/vagueness";
import EmotionalFramingLesson from "@/pages/educate/emotional-framing";
import SpeculativeAuthorityLesson from "@/pages/educate/speculative-authority";
import HowLLMsBullshitLesson from "@/pages/educate/how-llms-bullshit";
import AIAwareLesson from "@/pages/educate/ai-aware";
import CitationLaunderingLesson from "@/pages/educate/bullshit-types/citation-laundering";
import EpistemicSandboxLesson from "@/pages/educate/epistemic-sandbox";
import ClaritySignalsPage from "@/pages/educate/clarity-signals";
import CertaintyVsTrust from "@/pages/educate/certainty-vs-trust";
import CognitiveDissonance from "@/pages/educate/cognitive-dissonance";
import ConfirmationBias from "@/pages/educate/confirmation-bias";
import EpistemicHumility from "@/pages/educate/epistemic-humility";
import MentalModels from "@/pages/educate/mental-models";
import NarrativeFraming from "@/pages/educate/narrative-framing";
import WhyCertaintySells from "@/pages/educate/why-certainty-sells";
import DetectBullshit from "@/pages/educate/detect-bullshit";
import JargonOverload from "@/pages/educate/jargon-overload";
import FalseUrgencyLesson from "@/pages/educate/false-urgency";
import AppealToAuthorityLesson from "@/pages/educate/appeal-to-authority";
import AppealToEmotionLesson from "@/pages/educate/appeal-to-emotion";
import FallaciesOverview from "@/pages/educate/fallacies-overview";
import FalseDichotomy from "@/pages/educate/false-dichotomy";
import FalseDilemma from "@/pages/educate/false-dilemma";
import RedHerring from "@/pages/educate/red-herring";
import StrawMan from "@/pages/educate/straw-man";
import Steelman from "@/pages/educate/steelman";
import AdHominem from "@/pages/educate/ad-hominem";
import CircularReasoning from "@/pages/educate/circular-reasoning";
import BecomeAIAware from "@/pages/educate/become-ai-aware";
import NarrativeFramingAnalysis from "@/pages/educate/narrative-framing-analysis";
import AIBehaviorPatterns from "@/pages/educate/ai-behavior-patterns";
import ScrollToTop from "@/components/ScrollToTop"; // ← added

const App: React.FC = () => {
  return (
    <VXProvider>
      <Router>
        <ScrollToTop /> {/* ← one-time mount fixes top-of-page on route change */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/educate" element={<Educate />} />
          <Route path="/educate/epistemic-foundations" element={<EpistemicFoundations />} />
          <Route path="/educate/bullshit-detection" element={<BullshitDetection />} />
          <Route path="/educate/logical-fallacies" element={<LogicalFallacies />} />
          <Route path="/educate/ai-awareness" element={<AIAwareness />} />
          <Route path="/educate/advanced-practice" element={<AdvancedPractice />} />
          <Route path="/educate/vagueness" element={<VaguenessLesson />} />
          <Route path="/educate/emotional-framing" element={<EmotionalFramingLesson />} />
          <Route path="/educate/speculative-authority" element={<SpeculativeAuthorityLesson />} />
          <Route path="/educate/how-llms-bullshit" element={<HowLLMsBullshitLesson />} />
          <Route path="/educate/ai-aware" element={<AIAwareLesson />} />
          <Route path="/educate/bullshit-types/citation-laundering" element={<CitationLaunderingLesson />} />
          <Route path="/educate/epistemic-sandbox" element={<EpistemicSandboxLesson />} />
          <Route path="/educate/clarity-signals" element={<ClaritySignalsPage />} />
          <Route path="/educate/certainty-vs-trust" element={<CertaintyVsTrust />} />
          <Route path="/educate/cognitive-dissonance" element={<CognitiveDissonance />} />
          <Route path="/educate/confirmation-bias" element={<ConfirmationBias />} />
          <Route path="/educate/epistemic-humility" element={<EpistemicHumility />} />
          <Route path="/educate/mental-models" element={<MentalModels />} />
          <Route path="/educate/narrative-framing" element={<NarrativeFraming />} />
          <Route path="/educate/why-certainty-sells" element={<WhyCertaintySells />} />
          <Route path="/educate/detect-bullshit" element={<DetectBullshit />} />
          <Route path="/educate/jargon-overload" element={<JargonOverload />} />
          <Route path="/educate/false-urgency" element={<FalseUrgencyLesson />} />
          <Route path="/educate/appeal-to-authority" element={<AppealToAuthorityLesson />} />
          <Route path="/educate/appeal-to-emotion" element={<AppealToEmotionLesson />} />
          <Route path="/educate/fallacies-overview" element={<FallaciesOverview />} />
          <Route path="/educate/false-dichotomy" element={<FalseDichotomy />} />
          <Route path="/educate/false-dilemma" element={<FalseDilemma />} />
          <Route path="/educate/red-herring" element={<RedHerring />} />
          <Route path="/educate/straw-man" element={<StrawMan />} />
          <Route path="/educate/steelman" element={<Steelman />} />
          <Route path="/educate/ad-hominem" element={<AdHominem />} />
          <Route path="/educate/circular-reasoning" element={<CircularReasoning />} />
          <Route path="/educate/become-ai-aware" element={<BecomeAIAware />} />
          <Route path="/educate/narrative-framing-analysis" element={<NarrativeFramingAnalysis />} />
          <Route path="/educate/ai-behavior-patterns" element={<AIBehaviorPatterns />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/wisdom" element={<Wisdom />} />
          <Route path="/train" element={<Train />} />
          <Route path="/paper" element={<Paper />} />
          <Route path="/bot-detection" element={<BotDetection />} />
          <Route path="/omissions" element={<Omissions />} />
          <Route path="/educate/bullshit-patterns" element={<BullshitPatterns />} />
          <Route path="/testing" element={<Testing />} />
        </Routes>
      </Router>
    </VXProvider>
  );
};

export default App;
