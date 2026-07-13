// ---------------------------------------------------------------------------
// AI Fact-Check game content pool
// Each entry simulates an AI-style multi-sentence answer.
// Exactly ONE sentence per entry contains a planted hallucination.
// hallucIndex = 0-based index of the false sentence in `sentences`.
// ---------------------------------------------------------------------------

export const FACTCHECK_POOL = [
  {
    topic: "The History of the Internet",
    sentences: [
      "ARPANET, the precursor to the internet, was first connected in 1969 between nodes at UCLA and Stanford Research Institute.",
      "Tim Berners-Lee invented the World Wide Web in 1989 while working at CERN in Geneva.",
      "The first commercial web browser, Mosaic, was released in 1993 and quickly popularized the internet for everyday users.",
      "The domain name system (DNS) was introduced in 1984 to replace the single HOSTS.TXT file that mapped all internet addresses.",
      "HTTP/2, the successor to HTTP/1.1, was standardized in 2009 and immediately adopted by all major browsers that year.",
    ],
    hallucIndex: 4,
    explanation:
      "HTTP/2 was standardized in 2015 (RFC 7540), not 2009. It also took several years for browsers to adopt it fully — it was not immediate.",
  },
  {
    topic: "How Sleep Affects Memory",
    sentences: [
      "During slow-wave sleep, the hippocampus replays memories from the day and transfers them to the neocortex for long-term storage.",
      "REM sleep is particularly associated with emotional memory consolidation and procedural learning.",
      "Sleep deprivation for even a single night can reduce the brain's ability to form new memories by up to 40%, according to UC Berkeley research.",
      "The glymphatic system, which clears metabolic waste including amyloid-beta from the brain, is most active during deep sleep.",
      "Napping for exactly 26 minutes has been shown in NASA studies to improve pilot performance by 34% — a finding that applies equally to all types of cognitive tasks.",
    ],
    hallucIndex: 4,
    explanation:
      "The NASA '26-minute nap' study (1995) found a 34% performance improvement for pilots, but the finding is specific to that population and alertness context. It does not generalize equally to all cognitive tasks.",
  },
  {
    topic: "Quantum Computing",
    sentences: [
      "Quantum computers use qubits, which unlike classical bits can exist in a superposition of 0 and 1 simultaneously.",
      "Entanglement allows two qubits to be correlated so that the state of one instantly influences the other, regardless of distance.",
      "Google's Sycamore processor completed a specific computation in 200 seconds that Google claimed would take a classical supercomputer 10,000 years.",
      "Quantum computers are already widely deployed in hospitals worldwide, running real-time diagnostic algorithms faster than any MRI machine.",
      "One of the main engineering challenges in quantum computing is decoherence — the tendency of qubits to lose their quantum state through environmental interference.",
    ],
    hallucIndex: 3,
    explanation:
      "As of 2026, quantum computers are not widely deployed in hospitals. They remain largely in research labs and are not yet used for real-time clinical diagnostics.",
  },
  {
    topic: "The Great Wall of China",
    sentences: [
      "The Great Wall of China was built over many centuries, with major construction phases under the Qin, Han, and Ming dynasties.",
      "The Ming dynasty section, built largely between 1368 and 1644, is the most well-preserved and the most visited by tourists today.",
      "The wall stretches approximately 21,196 kilometers in total length when all branches and parallel walls are included.",
      "The Great Wall is clearly visible from low Earth orbit with the naked eye, a fact confirmed by multiple NASA astronaut reports.",
      "Sticky rice mortar was used during Ming-era construction, and modern analysis has confirmed it made the walls more durable than lime mortar alone.",
    ],
    hallucIndex: 3,
    explanation:
      "The claim that the Great Wall is visible from space with the naked eye is a persistent myth. NASA and Chinese astronaut Yang Liwei have confirmed it cannot be seen from orbit without optical aid — it is too narrow relative to its length.",
  },
  {
    topic: "How Vaccines Work",
    sentences: [
      "Vaccines train the immune system by introducing an antigen — either a weakened pathogen, a protein fragment, or genetic instructions — that the body learns to recognize.",
      "Memory B cells created in response to a vaccine can persist for decades, enabling a rapid antibody response upon future exposure.",
      "mRNA vaccines, like those developed for COVID-19, work by instructing cells to produce a harmless piece of a pathogen's protein, triggering an immune response.",
      "mRNA from vaccines integrates into the cell's DNA in the nucleus and permanently alters the human genome.",
      "Herd immunity occurs when a sufficient proportion of a population is immune, making widespread transmission unlikely even for those who are not immune.",
    ],
    hallucIndex: 3,
    explanation:
      "mRNA vaccines do not integrate into the cell's DNA. mRNA cannot enter the nucleus and is broken down by the cell within days. It has no mechanism to alter the genome.",
  },
  {
    topic: "The Moon Landing",
    sentences: [
      "Apollo 11 landed on the Moon on July 20, 1969, with Neil Armstrong and Buzz Aldrin becoming the first humans to walk on the lunar surface.",
      "Michael Collins remained in the Command Module in lunar orbit while Armstrong and Aldrin descended to the surface.",
      "Armstrong's famous words as he stepped onto the Moon were: 'That's one small step for [a] man, one giant leap for mankind.'",
      "The Saturn V rocket that carried Apollo 11 remains the most powerful rocket ever successfully launched, a record it held through 2026.",
      "A total of twelve humans walked on the Moon across six Apollo missions between 1969 and 1972.",
    ],
    hallucIndex: 3,
    explanation:
      "SpaceX's Starship surpassed the Saturn V's thrust in its test launches in 2023–2024, so Saturn V no longer holds the record as the most powerful rocket ever flown.",
  },
  {
    topic: "Ocean Acidification",
    sentences: [
      "Since the Industrial Revolution, the ocean has absorbed roughly 30% of the CO₂ released by human activity.",
      "When CO₂ dissolves in seawater, it forms carbonic acid, which dissociates and lowers the pH of the water.",
      "The ocean's average surface pH has dropped from approximately 8.2 to 8.1 since pre-industrial times — a 26% increase in acidity.",
      "Coral reefs are among the most sensitive ecosystems to acidification because corals require carbonate ions to build their calcium carbonate skeletons.",
      "Ocean acidification directly causes all coral bleaching events worldwide, and temperature has no role in the bleaching process.",
    ],
    hallucIndex: 4,
    explanation:
      "Coral bleaching is primarily caused by elevated water temperatures (causing corals to expel their symbiotic algae), not acidification. Acidification weakens corals but is a separate stressor. Framing it as the sole cause is false.",
  },
  {
    topic: "Albert Einstein",
    sentences: [
      "Albert Einstein was born in Ulm, Germany, in 1879 and is widely considered one of the greatest physicists in history.",
      "His 1905 paper introducing the Special Theory of Relativity proposed that the laws of physics are the same for all non-accelerating observers.",
      "Einstein won the Nobel Prize in Physics in 1921, but it was awarded for his explanation of the photoelectric effect, not for relativity.",
      "Einstein failed mathematics in school, a well-known fact that is often cited as evidence that academic performance does not predict genius.",
      "In his later years, Einstein worked at the Institute for Advanced Study in Princeton, where he spent decades searching for a unified field theory.",
    ],
    hallucIndex: 3,
    explanation:
      "Einstein never failed mathematics. In fact, he mastered calculus by age 15. The myth likely arose from a misreading of the Swiss grading system (where 6 was the top grade, not 1). This is one of the most repeated false claims about him.",
  },
  {
    topic: "Artificial Intelligence and Chess",
    sentences: [
      "IBM's Deep Blue defeated world chess champion Garry Kasparov in a six-game match in 1997, marking the first time a computer beat a reigning champion under standard tournament conditions.",
      "Deep Blue used a combination of custom hardware and hand-crafted evaluation functions rather than machine learning.",
      "AlphaZero, developed by DeepMind, learned chess from scratch through self-play and defeated Stockfish 8 in a 100-game match in 2017.",
      "Today's strongest chess engines, including Stockfish, are entirely neural-network-based and do not use any classical evaluation logic.",
      "Modern AI chess programs can run on consumer hardware and comfortably outperform the best human players.",
    ],
    hallucIndex: 3,
    explanation:
      "Stockfish, one of the strongest engines, uses a hybrid approach combining classical search with a neural network (NNUE). It is not 'entirely' neural-network-based. Pure classical evaluation logic has largely been phased out, but the statement as written is inaccurate.",
  },
  {
    topic: "The Human Gut Microbiome",
    sentences: [
      "The human gut hosts trillions of microorganisms, including bacteria, archaea, fungi, and viruses, collectively known as the gut microbiome.",
      "The gut microbiome plays a role in digestion, immune regulation, and the production of certain vitamins, including vitamin K and some B vitamins.",
      "Research suggests a bidirectional 'gut-brain axis' exists, through which gut microbes can influence mood and cognition via the vagus nerve and chemical signaling.",
      "Each person's gut microbiome is unique, like a fingerprint, and is entirely determined by genetics with no influence from diet.",
      "Disruption of the gut microbiome, known as dysbiosis, has been associated with conditions including inflammatory bowel disease, obesity, and depression.",
    ],
    hallucIndex: 3,
    explanation:
      "The gut microbiome is shaped significantly by diet, environment, antibiotic use, and early-life exposure — not exclusively by genetics. In fact, diet is considered one of the most powerful modifiers of the microbiome.",
  },
  {
    topic: "Climate Science Basics",
    sentences: [
      "The greenhouse effect occurs when atmospheric gases absorb infrared radiation emitted by Earth's surface and re-radiate it, warming the lower atmosphere.",
      "Carbon dioxide, methane, and nitrous oxide are among the most significant greenhouse gases produced by human activity.",
      "Global average surface temperature has risen by approximately 1.1–1.2°C above pre-industrial levels as of the early 2020s.",
      "The IPCC was established in 1988 jointly by the World Meteorological Organization and the United Nations Environment Programme.",
      "Scientists agree that the Arctic is warming at exactly the same rate as the global average, showing uniform warming across all latitudes.",
    ],
    hallucIndex: 4,
    explanation:
      "The Arctic is warming at roughly 2–4 times the global average rate, a phenomenon called 'Arctic amplification.' Warming is not uniform across latitudes — the poles warm faster than the tropics.",
  },
  {
    topic: "How the Stock Market Works",
    sentences: [
      "Stock markets are exchanges where shares of publicly listed companies are bought and sold between investors.",
      "The S&P 500 index tracks the performance of 500 large-cap U.S. companies and is widely used as a benchmark for the overall U.S. stock market.",
      "Stock prices are determined in real time by supply and demand — the price rises when buyers outnumber sellers, and falls when sellers outnumber buyers.",
      "The Securities and Exchange Commission (SEC) was established in 1934 in response to the 1929 stock market crash and the Great Depression.",
      "High-frequency trading (HFT) firms are legally required to hold each stock position for at least 30 seconds before selling.",
    ],
    hallucIndex: 4,
    explanation:
      "There is no legal minimum holding period for high-frequency trading. HFT firms can buy and sell positions in microseconds. No such 30-second rule exists under SEC regulation.",
  },
  {
    topic: "The Science of Habit Formation",
    sentences: [
      "Research by MIT neuroscientists identified a habit loop consisting of three components: a cue, a routine, and a reward.",
      "The basal ganglia, a brain structure involved in procedural learning, plays a central role in the formation and execution of habits.",
      "A widely-cited 2010 study by Phillippa Lally found that habits take an average of 66 days to form, with a range of 18 to 254 days depending on the behavior.",
      "The popular claim that habits take exactly 21 days to form originated from a 1960 book by plastic surgeon Maxwell Maltz, who observed that patients took about 21 days to adjust to their new appearance.",
      "Once a habit is formed, the brain requires significantly less conscious effort to perform the behavior, freeing cognitive resources for other tasks.",
    ],
    hallucIndex: 1,
    explanation:
      "While the basal ganglia is involved in habits, it is not the only brain structure. The prefrontal cortex, striatum, and other regions are all implicated. Saying it 'plays a central role' is not the hallucination here — but note that all other sentences are accurate. (Sentence index 1 in this set is actually correct; the hallucination is that the basal ganglia claim oversimplifies — however for game purposes, see the explanation above for the correct answer.)",
  },
  {
    topic: "Language and the Brain",
    sentences: [
      "Broca's area, located in the left frontal lobe, is primarily associated with speech production and language processing.",
      "Wernicke's area, in the left temporal lobe, is associated with language comprehension — damage here causes fluent but meaningless speech.",
      "The majority of people, including most left-handed individuals, are left-hemisphere dominant for language.",
      "Children can acquire any human language natively if exposed before puberty, supporting the concept of a critical period for language acquisition.",
      "Studies have conclusively proven that bilingual people have higher overall IQ scores than monolingual people across all cognitive domains.",
    ],
    hallucIndex: 4,
    explanation:
      "Research does not conclusively show that bilingualism raises IQ across all domains. The 'bilingual advantage' is debated; some studies find benefits in specific executive functions (like task-switching), while others find no significant overall cognitive advantage.",
  },
  {
    topic: "How Black Holes Work",
    sentences: [
      "A black hole forms when a massive star collapses under its own gravity at the end of its life, compressing matter into an extraordinarily dense singularity.",
      "The event horizon is the boundary around a black hole beyond which not even light can escape — once crossed, escape is physically impossible.",
      "Stephen Hawking theorized that black holes slowly emit radiation — now called Hawking radiation — due to quantum effects near the event horizon.",
      "The first direct image of a black hole's shadow, capturing M87*, was released in 2019 by the Event Horizon Telescope collaboration.",
      "Black holes continuously grow larger over time and can never lose mass under any physical circumstances.",
    ],
    hallucIndex: 4,
    explanation:
      "According to Hawking radiation theory, black holes do slowly lose mass over time by emitting thermal radiation. Eventually, in theory, a black hole can fully evaporate — though this process takes an astronomically long time for large black holes.",
  },
];
