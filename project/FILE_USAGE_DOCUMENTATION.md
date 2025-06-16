# Truth Serum + Clarity Armor Platform - File Usage Documentation

## Core Application Files

### **App.tsx** - Main Application Hub
- **Purpose**: Central application component and architecture overview
- **Usage**: Entry point for users, contains navigation tabs and demo functionality
- **Key Features**: 
  - Architecture documentation display
  - Sample analysis output with color legend
  - Tab-based navigation between different system views
  - Demo toggle functionality

### **main.tsx** - Application Bootstrap
- **Purpose**: React application entry point with global configuration
- **Usage**: Sets up React Query client, StrictMode, and renders main App
- **Key Features**:
  - Query client configuration with caching
  - Global error boundaries
  - Performance optimizations

## Analysis Engine (Main Processing Script)

### **AnalysisEngine.tsx** - Central Analysis Controller
- **Purpose**: Main analysis interface with persistent background processing
- **Usage**: Coordinates all analysis modules and manages user input
- **Key Features**:
  - **Persistent Analysis**: Continues processing in background when users navigate away
  - **Real-time Status**: Visual indicators showing analysis progress
  - **Dual Input**: Supports both text content and URL analysis
  - **Background Caching**: Preserves results while new analysis runs
  - **Auto-debouncing**: Triggers analysis after user stops typing

## Detection Modules (Analysis Components)

### **ClarityArmor.tsx** - Fallacy Detection Engine
- **Purpose**: Detects rhetorical fallacies and manipulation techniques
- **Usage**: Analyzes content for 60+ fallacy patterns
- **Color Scheme**: 
  - 🔴 Red: Critical risk (high severity)
  - 🟡 Yellow: Moderate risk (medium severity) 
  - 🟢 Green: Low risk (low severity)

### **TruthSerum.tsx** - Confidence Calibration System
- **Purpose**: Analyzes AI responses for honesty and uncertainty
- **Usage**: Categorizes content as Known/Speculated/Unknown
- **Color Scheme**:
  - 🟢 Green: Known facts (high confidence)
  - 🟡 Yellow: Speculation (medium confidence)
  - 🔴 Red: Unknown/uncertain (low confidence)

### **SourceCredibility.tsx** - Source Analysis Engine
- **Purpose**: Evaluates source credibility, bias, and factual reliability
- **Usage**: Analyzes URLs for domain reputation and political lean
- **Color Scheme**:
  - 🟢 Green: High credibility (80%+)
  - 🟡 Yellow: Mixed credibility (50-79%)
  - 🔴 Red: Low credibility (<50%)
  - 🔵 Blue: Bias indicator (all political leans)

### **BotDetection.tsx** - Automation Pattern Recognition
- **Purpose**: Detects automated content and bot-generated text
- **Usage**: Analyzes linguistic patterns and account metadata
- **Features**: Enhanced error handling and fallback analysis

## Service Layer (Core Logic)

### **sourceCredibility.ts** - Source Analysis Service
- **Purpose**: Backend logic for source credibility analysis
- **Usage**: Provides caching, API integration, and credibility scoring
- **Key Features**:
  - **In-Memory Caching**: Browser-compatible cache with 10-minute TTL
  - **Mock Database**: Pre-configured credibility scores for major domains
  - **Fallback Analysis**: Graceful degradation when APIs fail
  - **Performance Tracking**: Cache hit/miss statistics

### **botDetection.ts** - Bot Detection Service  
- **Purpose**: Heuristic analysis for automated content detection
- **Usage**: Implements pattern matching and linguistic analysis
- **Key Features**:
  - **Enhanced Error Handling**: Comprehensive try-catch with logging
  - **Multiple Detection Rules**: Repetition, punctuation, generic phrases
  - **Source Integration**: Account age and posting frequency analysis
  - **Graceful Degradation**: Continues analysis even if individual rules fail

## Configuration & Styling

### **index.css** - Global Styles
- **Purpose**: Tailwind CSS imports and global styling
- **Usage**: Foundation for all component styling

### **tailwind.config.js** - Design System Configuration
- **Purpose**: Tailwind CSS configuration for consistent color schemes
- **Usage**: Defines color palette and design tokens

### **vite.config.ts** - Build Configuration
- **Purpose**: Vite bundler configuration
- **Usage**: Optimizes build process and excludes problematic dependencies

## Key Architectural Features

### **Persistent Analysis Script**
- Located in `AnalysisEngine.tsx`
- Runs analysis in background using React Query
- Preserves results when users navigate between tabs
- Visual status indicators show real-time progress

### **Color Output Modules**
- Consistent across all components:
  - 🔴 **Red**: Critical/High risk/Low confidence
  - 🟡 **Yellow**: Moderate risk/Speculation/Mixed quality
  - 🟢 **Green**: Low risk/Known facts/High quality
  - 🔵 **Blue**: Bias indicators (neutral color for all political leans)

### **Caching System**
- Browser-compatible in-memory cache in `sourceCredibility.ts`
- 10-minute TTL for performance optimization
- Automatic cleanup of expired entries
- Cache statistics tracking

### **Error Handling**
- Comprehensive error boundaries in all services
- Graceful degradation when APIs fail
- Detailed logging for debugging
- User-friendly fallback messages

This architecture ensures robust, performant analysis with excellent user experience and maintainable code structure.