export const MOCK_USERS = []; // runtime registry

export const PAPERS = {
  all: [
    {
      id: 1,
      title: "Carbon-Aware Workload Scheduling in Distributed Cloud Systems",
      authors: "Chen, L., Patel, R., Nguyen, S. · 2024",
      abstract:
        "We present a novel framework for shifting compute workloads to time-space windows of low carbon intensity, achieving up to 47% reduction in operational emissions without performance degradation.",
      score: 98,
      tags: ["solar"],
      hasSemanticScholar: true,
      hasPDF: true,
    },
    {
      id: 2,
      title: "Renewable Energy Integration for AI Inference at Scale",
      authors: "Kumar, A., Williams, T. · 2023",
      abstract:
        "This paper analyses the carbon footprint of large language model inference and proposes scheduling strategies aligned with renewable availability in hyper-scale data centres.",
      score: 91,
      tags: ["solar", "wind"],
      hasSemanticScholar: true,
      hasPDF: true,
    },
    {
      id: 3,
      title: "FlashAttention: Fast and Memory-Efficient Exact Attention",
      authors: "Dao, T., Fu, D., Ermon, S. · 2022",
      abstract:
        "We propose FlashAttention, a new attention algorithm that computes exact attention with less memory and faster runtime by making attention IO-aware across memory hierarchies.",
      score: 87,
      tags: ["nuclear"],
      hasSemanticScholar: false,
      hasPDF: true,
    },
    {
      id: 4,
      title: "Wind-Powered Data Centres: Architecture and Scheduling",
      authors: "Martinez, J., Singh, P. · 2023",
      abstract:
        "An exploration of purpose-built data centres co-located with wind farms, detailing scheduling algorithms that maximise renewable utilisation.",
      score: 84,
      tags: ["wind"],
      hasSemanticScholar: true,
      hasPDF: false,
    },
    {
      id: 5,
      title: "Nuclear-Powered Computing: Stable Baseload for AI Workloads",
      authors: "Thompson, R., Li, W. · 2024",
      abstract:
        "We examine the role of nuclear power as a reliable, zero-carbon baseload source for energy-intensive AI compute clusters.",
      score: 79,
      tags: ["nuclear"],
      hasSemanticScholar: true,
      hasPDF: true,
    },
  ],
};

