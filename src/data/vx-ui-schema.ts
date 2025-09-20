// src/data/vx-ui-schema.ts
// Minimal UI schema used by ReflexInfoDrawer (expand later as needed)
const schema = {
  "vx-ri01": {
    label: "Repetition / Interruption",
    color: "blue",
    summary: "Detects repetitive phrasing or interruption-style cadence."
  },
  "vx-ju01": {
    label: "Jargon Overload",
    color: "violet",
    summary: "Flags dense technical terms used to obscure meaning."
  },
  "vx-da01": {
    label: "Data-less Claim",
    color: "amber",
    summary: "Identifies claims presented without evidence."
  },
  "vx-fp01": {
    label: "False Precision",
    color: "red",
    summary: "Numbers asserted with unwarranted exactness."
  }
};

export default schema;
