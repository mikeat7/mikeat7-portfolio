// src/data/truths.ts
export const lessons = [
    {
        id: "epistemic-humility",
        title: "Epistemic Humility",
        description: "Understanding the limits of our knowledge and resisting overconfidence.",
        reflexExamples: [
            { text: "This is definitely the only explanation possible.", linkedReflex: "vx-so01" },
            { text: "Experts unanimously agree, no debate exists.", linkedReflex: "vx-pc01" }
        ],
        linkedLesson: "epistemic-humility"
    },
    {
        id: "bias-detection",
        title: "Bias Detection",
        description: "Learning how emotional and cognitive biases influence reasoning.",
        reflexExamples: [
            { text: "You're clearly wrong if you disagree!", linkedReflex: "vx-em08" },
            { text: "Real patriots know the truth.", linkedReflex: "vx-tu01" }
        ],
        linkedLesson: "bias-detection"
    },
    {
        id: "fallacy-spotting",
        title: "Fallacy Spotting",
        description: "Recognizing logical fallacies and rhetorical manipulation.",
        reflexExamples: [
            { text: "If we allow this, next thing you know everything collapses!", linkedReflex: "vx-ri01" },
            { text: "It’s obvious—just look around you!", linkedReflex: "vx-ha01" }
        ],
        linkedLesson: "fallacy-spotting"
    }
];
