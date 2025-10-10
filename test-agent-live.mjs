#!/usr/bin/env node
// Test script to preview AWS Agent functionality
// Usage: node test-agent-live.mjs

const API_BASE = process.env.VITE_AGENT_API_BASE || 'https://wzwdwkaj7h.execute-api.us-east-1.amazonaws.com';

console.log('🧪 AWS Agent Live Test\n');
console.log(`API Base: ${API_BASE}\n`);

// Test data
const testCases = [
  {
    name: 'Speculative Authority Detection',
    input: 'Experts unanimously agree that climate action must happen immediately.',
    handshake: {
      mode: '--careful',
      stakes: 'high',
      min_confidence: 0.7,
      cite_policy: 'force',
      omission_scan: true,
      reflex_profile: 'strict',
      codex_version: '0.9.0'
    }
  },
  {
    name: 'False Precision Analysis',
    input: 'Studies show that 87.3% of consumers prefer our product over competitors.',
    handshake: {
      mode: '--direct',
      stakes: 'medium',
      min_confidence: 0.6,
      cite_policy: 'auto',
      omission_scan: 'auto',
      reflex_profile: 'default',
      codex_version: '0.9.0'
    }
  },
  {
    name: 'Conversational Memory Test',
    messages: [
      { role: 'user', content: 'What manipulation patterns do you see in this: "Act now before it\'s too late!"' },
      { role: 'assistant', content: 'I detect urgency manipulation (VX-TU01) with high confidence (0.85).' },
      { role: 'user', content: 'What other patterns often appear with urgency tactics?' }
    ],
    handshake: {
      mode: '--careful',
      stakes: 'medium',
      min_confidence: 0.65,
      cite_policy: 'auto',
      omission_scan: 'auto',
      reflex_profile: 'default',
      codex_version: '0.9.0'
    }
  }
];

async function testAnalyze(testCase) {
  console.log(`\n📝 Test: ${testCase.name}`);
  console.log(`   Input: "${testCase.input}"`);
  console.log(`   Stakes: ${testCase.handshake.stakes}`);

  try {
    const response = await fetch(`${API_BASE}/agent/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: testCase.input },
        handshake: testCase.handshake
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ Error: ${response.status} ${response.statusText}`);
      console.log(`   Details: ${errorText}`);
      return false;
    }

    const result = await response.json();
    console.log(`   ✅ Success! Detected ${result.frames?.length || 0} VX frames`);

    if (result.frames && result.frames.length > 0) {
      result.frames.forEach((frame, i) => {
        console.log(`   Frame ${i + 1}: ${frame.reflexId} (confidence: ${frame.confidence})`);
        console.log(`      → ${frame.rationale || 'N/A'}`);
      });
    }

    return true;
  } catch (error) {
    console.log(`   ❌ Network error: ${error.message}`);
    return false;
  }
}

async function testChat(testCase) {
  console.log(`\n💬 Test: ${testCase.name}`);
  console.log(`   Message history: ${testCase.messages.length} messages`);

  try {
    const response = await fetch(`${API_BASE}/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: testCase.messages,
        handshake: testCase.handshake
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ Error: ${response.status} ${response.statusText}`);
      console.log(`   Details: ${errorText}`);
      return false;
    }

    const result = await response.json();
    console.log(`   ✅ Success! Agent replied:`);
    console.log(`   "${result.reply?.substring(0, 150)}${result.reply?.length > 150 ? '...' : ''}"`);

    if (result.sessionId) {
      console.log(`   Session ID: ${result.sessionId}`);
    }

    return true;
  } catch (error) {
    console.log(`   ❌ Network error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('Testing /agent/analyze endpoint');
  console.log('═══════════════════════════════════════════════════════');

  const analyzeTests = testCases.filter(t => t.input);
  let analyzeSuccess = 0;

  for (const test of analyzeTests) {
    const success = await testAnalyze(test);
    if (success) analyzeSuccess++;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('Testing /agent/chat endpoint');
  console.log('═══════════════════════════════════════════════════════');

  const chatTests = testCases.filter(t => t.messages);
  let chatSuccess = 0;

  for (const test of chatTests) {
    const success = await testChat(test);
    if (success) chatSuccess++;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('Test Summary');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`/agent/analyze: ${analyzeSuccess}/${analyzeTests.length} passed`);
  console.log(`/agent/chat: ${chatSuccess}/${chatTests.length} passed`);
  console.log(`Total: ${analyzeSuccess + chatSuccess}/${testCases.length} passed`);

  if (analyzeSuccess + chatSuccess === testCases.length) {
    console.log('\n🎉 All tests passed! AWS Agent is fully operational.');
  } else {
    console.log('\n⚠️  Some tests failed. Check deployment and environment variables.');
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
