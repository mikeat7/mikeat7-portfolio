# TSCA AWS Agent Architecture (Scaffold)

```mermaid
flowchart TD
  %% ---------- FRONTEND ----------
  subgraph Frontend["Frontend - clarityarmor.com"]
    A["User Input"]
    B["Handshake Presets: --direct / --careful / --recap"]
    C["Analyze Page"]
    D["Analysis Report and Heatmap"]
  end

  %% ---------- POLICY + REFLEX ----------
  subgraph VX["Policy Layer and Reflex Engine"]
    E["front-end-codex.v0.9.json"]
    F["codex-runtime.ts helpers"]
    G["runReflexAnalysis.ts"]
    H["VX Reflex Stack"]
  end

  %% ---------- AWS AGENT CORE ----------
  subgraph AWS["AWS Agent Core"]
    I["API Gateway"]
    J["Lambda: /agent/chat"]
    K["Bedrock LLM with Guardrails"]
    L["Action Group: fetch_url"]
    M["Optional: search_citations KB"]
    N["Optional: coi_scan Lambda"]
  end

  %% ---------- FLOWS ----------
  A --> B
  B --> C
  C --> D

  C -->|Frames Request| VX
  VX -->|Filtered Frames| D

  D -->|Query| I
  I --> J --> K
  K --> L
  K --> M
  K --> N
  L --> K
  M --> K
  N --> K
  K --> J --> I --> D

