import React from 'react';

const SignalLegend: React.FC = () => {
  const signals = [
    {
      symbol: '🟢',
      name: 'Clarity',
      description: 'Clear, cautious phrasing with appropriate uncertainty markers',
      examples: [
        '"The data suggests..." (hedged language)',
        '"I could be wrong, but..." (epistemic humility)',
        '"Further research is needed..." (acknowledges limitations)'
      ]
    },
    {
      symbol: '🟡',
      name: 'Tone',
      description: 'Emotionally loaded or persuasive language that may bypass logic',
      examples: [
        '"This crisis demands immediate action" (urgency)',
        '"Everyone knows that..." (false consensus)',
        '"You\'d be crazy not to..." (emotional pressure)'
      ]
    },
    {
      symbol: '🔴',
      name: 'Conflict',
      description: 'Logical contradictions, reasoning errors, or manipulative patterns',
      examples: [
        '"Studies prove..." without citations (false authority)',
        '"It\'s obvious that..." (dismisses complexity)',
        '"If we don\'t act now..." (false urgency)'
      ]
    },
    {
      symbol: '⚪',
      name: 'Neutral',
      description: 'No notable rhetorical patterns detected - straightforward communication',
      examples: [
        'Factual statements without emotional loading',
        'Clear explanations with appropriate qualifiers',
        'Balanced presentation of information'
      ]
    }
  ];

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Signal Legend</h3>
      <div className="grid gap-4">
        {signals.map((signal, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{signal.symbol}</span>
              <h4 className="font-semibold text-lg text-gray-800">{signal.name}</h4>
            </div>
            <p className="text-gray-700 mb-3">{signal.description}</p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Examples:</p>
              {signal.examples.map((example, i) => (
                <p key={i} className="text-sm text-gray-600 italic pl-4">
                  • {example}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignalLegend;