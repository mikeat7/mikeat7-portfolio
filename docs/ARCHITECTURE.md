# TSCA AWS Agent Architecture (Scaffold)

```mermaid
flowchart TD
  subgraph Frontend [Frontend — clarityarmor.com]
    A[User Input]
    B[Handshake Presets (--direct/--careful/--recap)]
    C[Analyze Page (TSX)]
    D[AnalysisReport + Heatmap]
  end

  subgraph VX [Policy Layer + Reflex Engine]
    E[front-end-codex.v0.9.json]
    F[codex-runtime.ts helpers]
    G[runReflexAnalysis.ts]
    H[VX Reflex Stack]
  end

  subgraph AWS [AWS Agent Core]
    I[API Gateway]
    J[Lambda /agent/chat]
    K[Bedrock Claude + Guardrails]
    L[Action Group: fetch_url]
    M[Optional: search_citations KB]
    N[Optional: coi_scan Lambda]
  end

  A --> B --> C --> D
  C -->|Frames| VX
  VX -->|Filtered Frames| D
  D -->|Query| I
  I --> J --> K
  K --> L
  K --> M
  K --> N
    L -->|clean_text| K
  M -->|citations| K
  N -->|risk_flags| K
  K -->|tool traces + answer| J --> I --> D

