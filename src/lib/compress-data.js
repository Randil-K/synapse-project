// ---------------------------------------------------------------------------
// Compress It game content pool
// Each entry has a source paragraph (50-80 words) and a model answer (≤20 words).
// ---------------------------------------------------------------------------

export const COMPRESS_POOL = [
  {
    id: "c1",
    source:
      "The practice of mindfulness, which involves paying deliberate attention to the present moment without judgment, has been shown in multiple clinical studies to reduce symptoms of anxiety and depression. Participants in eight-week Mindfulness-Based Stress Reduction (MBSR) programs consistently reported lower perceived stress levels and improved emotional regulation. Researchers note that regular practice appears to physically change the brain's structure, particularly in areas linked to attention and emotional control.",
    wordCount: 73,
    model: "Mindfulness practice reduces anxiety and depression by changing brain structure and improving emotional regulation.",
    keyPoint: "Mindfulness training measurably reduces stress and changes the brain.",
  },
  {
    id: "c2",
    source:
      "When a star runs out of nuclear fuel, the outward pressure that has been counteracting gravity for millions of years suddenly disappears. The star's core collapses almost instantaneously under its own weight. For stars above a certain mass threshold, this collapse triggers a catastrophic explosion called a supernova — one of the most energetic events in the universe — which can briefly outshine an entire galaxy containing hundreds of billions of stars.",
    wordCount: 73,
    source_note: "",
    model: "When massive stars exhaust their fuel, they collapse and explode as supernovae, briefly outshining entire galaxies.",
    keyPoint: "Massive stars end their lives in supernova explosions.",
  },
  {
    id: "c3",
    source:
      "Many people assume that multitasking makes them more productive, but cognitive science research consistently shows the opposite. The human brain cannot truly perform two cognitively demanding tasks simultaneously. What feels like multitasking is actually rapid task-switching, which carries a measurable switching cost — a brief but real delay as the brain reorients to each new task. Studies suggest this overhead can reduce effective productivity by as much as 40%.",
    wordCount: 71,
    model: "Multitasking is actually rapid task-switching that reduces productivity by up to 40%.",
    keyPoint: "True multitasking is a myth; task-switching hurts productivity.",
  },
  {
    id: "c4",
    source:
      "Antibiotic resistance occurs when bacteria evolve mechanisms to survive exposure to drugs designed to kill them. This happens through natural selection: when antibiotics kill susceptible bacteria, resistant variants survive and reproduce, passing on resistance genes. Overuse and misuse of antibiotics — including prescribing them for viral infections they cannot treat and using them in livestock farming — accelerates this process. The WHO has identified antibiotic resistance as one of the greatest threats to global health.",
    wordCount: 77,
    model: "Antibiotic overuse drives bacterial evolution toward resistance, threatening global health.",
    keyPoint: "Misuse of antibiotics accelerates resistance evolution.",
  },
  {
    id: "c5",
    source:
      "The placebo effect describes the measurable, real physiological improvement that patients experience when they receive an inert treatment they believe to be real. Far from being 'all in your head' in a dismissive sense, placebos can trigger genuine neurochemical changes — including the release of endorphins. Researchers have even found that in some conditions, placebos work even when patients are explicitly told they are taking a placebo, a phenomenon known as 'open-label placebo.'",
    wordCount: 76,
    model: "Placebos cause real neurochemical changes and can work even when patients know they're fake.",
    keyPoint: "The placebo effect produces genuine physiological responses.",
  },
  {
    id: "c6",
    source:
      "Compound interest is often described as the eighth wonder of the world, a quote frequently misattributed to Albert Einstein. The principle is simple: you earn interest not just on your original investment but also on the interest already accumulated. Over long time horizons, this creates exponential rather than linear growth. A person who begins investing small amounts in their twenties will typically accumulate significantly more wealth than someone who invests larger amounts starting in their forties, even if the total amount invested is identical.",
    wordCount: 80,
    model: "Compound interest grows exponentially; starting early beats investing more later.",
    keyPoint: "Starting early with compound interest outperforms larger late investments.",
  },
  {
    id: "c7",
    source:
      "Confirmation bias is the tendency to search for, interpret, and remember information in a way that confirms one's preexisting beliefs. It is one of the most well-documented cognitive biases in psychology, affecting experts and laypeople alike. Social media algorithms are particularly effective at amplifying confirmation bias because they surface content that users are likely to engage with — which is usually content that validates what they already believe, creating ideological echo chambers.",
    wordCount: 71,
    model: "Confirmation bias leads people to favor information that confirms their beliefs; social media amplifies this.",
    keyPoint: "Confirmation bias is worsened by algorithm-driven content feeds.",
  },
  {
    id: "c8",
    source:
      "Deep ocean zones below 200 meters receive no sunlight and were long assumed to be devoid of life. The discovery of hydrothermal vent ecosystems in 1977 fundamentally changed this assumption. These vents release superheated, mineral-rich water, and entire food chains thrive around them — driven not by photosynthesis but by chemosynthesis, the process by which bacteria convert chemical energy into biological energy. These ecosystems are now considered relevant models for potential life on icy moons like Europa.",
    wordCount: 77,
    model: "Hydrothermal vents support chemosynthesis-based life in sunless depths, suggesting life may exist on Europa.",
    keyPoint: "Deep-sea vent ecosystems use chemosynthesis, informing astrobiology.",
  },
  {
    id: "c9",
    source:
      "The concept of diminishing returns describes a situation where adding more of one input produces progressively smaller gains in output. In the context of studying and learning, this means that the first hour of focused review produces far more benefit than the fifth consecutive hour, as attention and retention both decline with fatigue. This is why study science strongly favors distributed practice — spreading sessions over multiple days — over massed practice or 'cramming' before an exam.",
    wordCount: 75,
    model: "Learning faces diminishing returns; spaced practice over days outperforms cramming.",
    keyPoint: "Distributed study sessions are more effective than marathon cramming.",
  },
  {
    id: "c10",
    source:
      "Fermentation is one of humanity's oldest biotechnologies, used for thousands of years before anyone understood the microorganisms responsible for it. During fermentation, microorganisms such as yeast or bacteria break down sugars in the absence of oxygen, producing alcohol, carbon dioxide, or organic acids as byproducts. This process is responsible for bread, beer, wine, cheese, yogurt, kimchi, and dozens of other foods that are now staples of global cuisine. Louis Pasteur's 19th-century research established that fermentation is indeed a biological — not purely chemical — process.",
    wordCount: 83,
    model: "Fermentation uses microorganisms to convert sugars into foods like bread, beer, and yogurt.",
    keyPoint: "Fermentation is an ancient biological process behind many common foods.",
  },
];
