# Mike's Portfolio with Tavus CVI Integration

A modern, responsive portfolio website featuring AI-powered video chat using Tavus CVI (Conversational Video Interface).

## 🚀 Features

- **Modern React 18** with TypeScript
- **Responsive Design** with Tailwind CSS
- **Tavus CVI Integration** for AI video chat
- **Daily.co WebRTC** for video calling
- **Professional Portfolio** sections
- **SEO Optimized** with meta tags
- **Performance Optimized** with lazy loading

## 🔧 Setup Instructions

### 1. Environment Configuration

Create a `.env` file in your project root:

```env
VITE_TAVUS_API_KEY=your_tavus_api_key_here
VITE_TAVUS_CALLBACK_URL=https://webhook.site/your-unique-url
VITE_TAVUS_REPLICA_ID=r_stock_001
```

### 2. Get Tavus API Credentials

1. Sign up at [Tavus.io](https://tavus.io)
2. Navigate to your dashboard
3. Create a new API key
4. Copy your API key to the `.env` file

### 3. Set Up Webhook URL

For development and testing, use [webhook.site](https://webhook.site):

1. Go to [webhook.site](https://webhook.site)
2. Copy your unique URL (e.g., `https://webhook.site/abc123-def456`)
3. Add it to your `.env` file as `VITE_TAVUS_CALLBACK_URL`

For production, set up a server endpoint to handle Tavus callbacks:

```javascript
// Example Express.js callback handler
app.post('/api/tavus/callback', (req, res) => {
  const { event, conversation_id, participant_id } = req.body;
  
  console.log('Tavus callback:', { event, conversation_id, participant_id });
  
  // Handle different events
  switch (event) {
    case 'conversation.started':
      // Log conversation start
      break;
    case 'conversation.ended':
      // Log conversation end
      break;
    case 'participant.joined':
      // Handle participant join
      break;
    case 'participant.left':
      // Handle participant leave
      break;
  }
  
  res.status(200).json({ success: true });
});
```

### 4. Custom Avatar Setup (Optional)

To use your own AI avatar instead of the stock one:

1. Create a custom replica in Tavus dashboard
2. Replace `r_stock_001` with your replica ID
3. Update the environment variable

## 🎥 Tavus CVI Features

- **AI Video Chat** - Interactive conversations with AI avatar
- **Real-time Communication** - Powered by Daily.co WebRTC
- **Responsive Video Frame** - Adapts to mobile and desktop
- **Connection Status** - Visual indicators for chat availability
- **Recording Support** - Optional conversation recording
- **Transcription** - Automatic speech-to-text

## 📱 Mobile Support

The Tavus CVI integration is fully responsive:

- **Mobile Video Frame** - Optimized size for phones
- **Touch Controls** - Easy-to-use mobile interface
- **Adaptive Layout** - Adjusts to screen orientation
- **Performance Optimized** - Efficient on mobile networks

## 🔒 Security & Privacy

- **Secure API Keys** - Environment variable protection
- **HTTPS Required** - Secure video transmission
- **Privacy Controls** - User consent for recording
- **Data Protection** - Compliant with privacy regulations

## 🚀 Deployment

### Netlify Deployment

1. Connect your GitHub repository
2. Set environment variables in Netlify dashboard
3. Deploy with build command: `npm run build`

### Vercel Deployment

1. Import project from GitHub
2. Add environment variables
3. Deploy automatically

## 📊 Analytics & Monitoring

Track Tavus CVI usage:

- **Conversation Metrics** - Duration, participants
- **User Engagement** - Interaction patterns
- **Performance Monitoring** - Connection quality
- **Error Tracking** - Debug issues

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📞 Support

For Tavus CVI support:
- [Tavus Documentation](https://docs.tavus.io)
- [Daily.co Documentation](https://docs.daily.co)
- [GitHub Issues](https://github.com/your-repo/issues)

## 🎯 Next Steps

1. **Customize Avatar** - Create your personal AI replica
2. **Add Analytics** - Track user interactions
3. **Enhance UI** - Custom video controls
4. **Scale Infrastructure** - Handle high traffic
5. **Add Features** - Screen sharing, chat, etc.