import React, { useState, useEffect } from "react";
import { Quote, ArrowLeft, RefreshCcw, Plus, Shield, AlertTriangle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { wisdomQuotes, WisdomQuote } from "@/data/wisdom-quotes";

const STORAGE_KEY = "wisdom_quotes_user_submissions";
const INDEX_KEY = "wisdom_quotes_current_index";

const Wisdom: React.FC = () => {
  const navigate = useNavigate();
  const [allQuotes, setAllQuotes] = useState<WisdomQuote[]>(wisdomQuotes);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [newQuote, setNewQuote] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newTone, setNewTone] = useState("");

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load user submissions and saved index on mount
  useEffect(() => {
    // Load saved index
    const savedIndex = localStorage.getItem(INDEX_KEY);
    if (savedIndex) {
      setQuoteIndex(parseInt(savedIndex, 10));
    }

    // Load user submissions
    const savedSubmissions = localStorage.getItem(STORAGE_KEY);
    if (savedSubmissions) {
      try {
        const userQuotes: WisdomQuote[] = JSON.parse(savedSubmissions);
        setAllQuotes([...wisdomQuotes, ...userQuotes]);
      } catch (error) {
        console.error('Error loading user quotes:', error);
      }
    }
  }, []);

  // Save index when it changes
  useEffect(() => {
    localStorage.setItem(INDEX_KEY, quoteIndex.toString());
  }, [quoteIndex]);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % allQuotes.length);
  };

  const previousQuote = () => {
    setQuoteIndex((prev) => (prev - 1 + allQuotes.length) % allQuotes.length);
  };

  const validateQuoteInput = (quote: string, author: string): string | null => {
    // Basic validation
    if (!quote.trim() || !author.trim()) {
      return "Both quote and author are required.";
    }

    // Length validation
    if (quote.length < 10) {
      return "Quote must be at least 10 characters long.";
    }

    if (quote.length > 500) {
      return "Quote must be less than 500 characters.";
    }

    // Profanity filter (basic)
    const profanityPatterns = [
      /\b(fuck|shit|damn|bitch|asshole|bastard)\b/gi,
      /\b(nazi|hitler|genocide)\b/gi, // Hate speech
      /\b(kill yourself|kys|suicide)\b/gi // Harmful content
    ];

    for (const pattern of profanityPatterns) {
      if (pattern.test(quote) || pattern.test(author)) {
        return "Quote contains inappropriate content and cannot be submitted.";
      }
    }

    // Check for duplicates
    const isDuplicate = allQuotes.some(q => 
      q.quote.toLowerCase().trim() === quote.toLowerCase().trim() &&
      q.author.toLowerCase().trim() === author.toLowerCase().trim()
    );

    if (isDuplicate) {
      return "This quote already exists in the collection.";
    }

    // Spam detection (very basic)
    if (/(.)\1{4,}/.test(quote)) { // Repeated characters
      return "Quote appears to be spam.";
    }

    return null; // Valid
  };

  const handleSubmitQuote = () => {
    const validationError = validateQuoteInput(newQuote, newAuthor);
    
    if (validationError) {
      alert(validationError);
      return;
    }

    const userQuote: WisdomQuote = {
      quote: newQuote.trim(),
      author: newAuthor.trim(),
      tone: newTone.trim() || "user-submitted",
      isUserSubmitted: true
    };

    const updatedQuotes = [...allQuotes, userQuote];
    setAllQuotes(updatedQuotes);

    // Save only user submissions to localStorage
    const userSubmissions = updatedQuotes.filter(q => q.isUserSubmitted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userSubmissions));

    // 📧 AUTOMATIC EMAIL TO MIKE
    automaticEmailToMike(userQuote);
    // Jump to the new quote
    setQuoteIndex(updatedQuotes.length - 1);

    // Show success message briefly
    setTimeout(() => {
      // Could add a toast notification here if desired
    }, 2000);

    // Reset form
    setNewQuote("");
    setNewAuthor("");
    setNewTone("");
    setShowSubmissionForm(false);

  };

  const automaticEmailToMike = (quote: WisdomQuote) => {
    // Create email content for single quote - opens automatically
    const emailSubject = `New Wisdom Quote Submitted - "${quote.quote.substring(0, 50)}..."`;
    const emailBody = `Hi Mike,

A new wisdom quote has been submitted to Truth Serum + Clarity Armor:

QUOTE:
"${quote.quote}"
— ${quote.author}
Category: ${quote.tone}
Submitted: ${new Date().toLocaleString()}

JSON for easy import:
${JSON.stringify(quote, null, 2)}

You can add this to src/data/wisdom-quotes.ts to make it permanent for all users.

Best regards,
Truth Serum + Clarity Armor Platform`;

    // Create mailto link and open immediately
    const mailtoLink = `mailto:ekimat7@rogers.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client in new window/tab to avoid navigation disruption
    window.open(mailtoLink, '_blank');
    
    // Also log to console as backup
    console.log('📧 AUTOMATIC EMAIL TO MIKE - NEW QUOTE:');
    console.log('Quote:', quote);
  };
  const currentQuote = allQuotes[quoteIndex];
  const userSubmissionCount = allQuotes.filter(q => q.isUserSubmitted).length;

  const exportQuotesForMike = () => {
    const userSubmissions = allQuotes.filter(q => q.isUserSubmitted);
    
    if (userSubmissions.length === 0) {
      alert('No user quotes to export yet.');
      return;
    }

    // Create email content
    const emailSubject = `Wisdom Quotes Submission - ${userSubmissions.length} quotes`;
    const emailBody = `Hi Mike,

Here are the wisdom quotes submitted by users:

${userSubmissions.map((quote, index) => `
QUOTE ${index + 1}:
"${quote.quote}"
— ${quote.author}
Category: ${quote.tone}
Submitted: ${new Date().toLocaleString()}

---
`).join('\n')}

JSON Data (for easy import):
${JSON.stringify(userSubmissions, null, 2)}

Best regards,
Truth Serum + Clarity Armor Platform`;

    // Create mailto link
    const mailtoLink = `mailto:ekimat7@rogers.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Also log to console as backup
    console.log('📧 WISDOM QUOTES EMAIL EXPORT FOR MIKE:');
    console.log('Subject:', emailSubject);
    console.log('Quotes:', userSubmissions);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 px-6 py-10 flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6 self-start"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <h1 className="text-4xl font-bold text-blue-700 mb-2 flex items-center gap-3">
        <Quote className="w-10 h-10" /> 
        Quotes of Wisdom
      </h1>
      
      <p className="text-gray-600 mb-8 text-center max-w-2xl">
        Curated insights from great thinkers on truth, clarity, and epistemic humility. 
        {userSubmissionCount > 0 && (
          <span className="block text-sm text-green-600 mt-1">
            Including {userSubmissionCount} community-submitted quote{userSubmissionCount !== 1 ? 's' : ''}
          </span>
        )}
      </p>
      
      {/* Quote Display */}
      <div className="bg-white/90 p-8 rounded-xl shadow-lg text-center max-w-4xl mb-6 backdrop-blur-sm border border-white/50 min-h-[200px] flex flex-col justify-center">
        <blockquote className="text-xl text-gray-700 italic mb-4 leading-relaxed">
          "{currentQuote.quote}"
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          <p className="text-lg text-gray-800 font-medium">
            — {currentQuote.author}
          </p>
          {currentQuote.isUserSubmitted && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              Community
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {currentQuote.tone}
          </span>
          <span className="text-sm text-gray-500">
            {quoteIndex + 1} of {allQuotes.length}
          </span>
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={previousQuote}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
        >
          ← Previous
        </button>
        <button
          onClick={nextQuote}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <RefreshCcw className="w-4 h-4" />
          Next
        </button>
        <button
          onClick={() => setShowSubmissionForm(!showSubmissionForm)}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Quote
        </button>
          {userSubmissionCount > 0 && (
            <button
              onClick={exportQuotesForMike}
              className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
            >
              <Mail className="w-4 h-4" />
              📧 Email to Mike
            </button>
          )}
      </div>

      {/* Quote Submission Form */}
      {showSubmissionForm && (
        <div className="w-full max-w-2xl bg-white/95 border-2 border-green-200 rounded-xl p-6 shadow-xl backdrop-blur-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Submit Your Quote</h2>
          </div>
          
          {/* Safety Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>Content Guidelines:</strong> Quotes are filtered for appropriateness. 
              Please submit meaningful, respectful quotes that contribute to wisdom and learning.
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="quote-input" className="block text-sm font-medium text-gray-700 mb-2">
                Quote *
              </label>
              <textarea
                id="quote-input"
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                placeholder="Enter a meaningful quote that inspires wisdom or clarity..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none bg-white/90"
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {newQuote.length}/500 characters
              </div>
            </div>
            
            <div>
              <label htmlFor="author-input" className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                id="author-input"
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Author name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/90"
                maxLength={100}
              />
            </div>
            
            <div>
              <label htmlFor="tone-input" className="block text-sm font-medium text-gray-700 mb-2">
                Category/Tone (optional)
              </label>
              <input
                id="tone-input"
                type="text"
                value={newTone}
                onChange={(e) => setNewTone(e.target.value)}
                placeholder="e.g., philosophical, scientific, motivational"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/90"
                maxLength={50}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmitQuote}
                disabled={!newQuote.trim() || !newAuthor.trim()}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quote
              </button>
              <button
                onClick={() => {
                  setShowSubmissionForm(false);
                  setNewQuote("");
                  setNewAuthor("");
                  setNewTone("");
                }}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message - Only show briefly after submission */}
      {allQuotes[quoteIndex]?.isUserSubmitted && quoteIndex === allQuotes.length - 1 && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-800 font-medium">
            ✅ Your quote has been added successfully! You can add another or browse the collection.
          </span>
        </div>
      )}

      {/* Collection Info */}
      <div className="mt-8 text-center max-w-3xl">
        <p className="text-sm text-gray-500 italic mb-2">
          This collection celebrates intellectual humility, critical thinking, and the pursuit of truth over certainty.
        </p>
        <p className="text-xs text-gray-400">
          Featuring insights from Richard Feynman, Bret Weinstein, Stephen Hawking, Albert Einstein, and many other great minds.
        </p>
      </div>
    </div>
  );
};

export default Wisdom;