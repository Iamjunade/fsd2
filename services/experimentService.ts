export interface Experiment {
  id: string;
  labId: string;
  weekNumber: number;
  title: string;
  aim: string;
  theory: string;
  procedure: string;
  materials: string;
  observations: string;
  result: string;
  vivaQuestions: string;
}

const getInitialExperimentsList = (labId: string): Experiment[] => {
  const experiments: Experiment[] = [];
  
  if (labId === '24CSPC45') {
    const cnOsTitles = [
      "Implement the data link layer framing method using character stuffing and bit stuffing.",
      "Implement CRC on a data set of characters using CRC-12/CRC-16 polynomial.",
      "Implement Stop & Wait Protocol and sliding Window Protocol.",
      "Implement Dijkstra's shortest path algorithm through a graph.",
      "Obtain broadcast tree for given subnet of hosts.",
      "Implement congestion control protocol.",
      "Study of Linux general purpose utilities (file handling, process, disk, networking, filters)",
      "Write a C program to a) create a child process and to display parent in 'parent' and child in 'child' process b) implement IPC using pipes",
      "Write C programs to simulate the CPU scheduling algorithms a) FCFS b) Priority c) SJF d) RR",
      "Write C programs to simulate the file allocation strategies a) Sequential b) Linked c) Indexed",
      "Experiment 11: Advanced OS Concepts",
      "Experiment 12: Advanced Networking Concepts"
    ];

    for (let i = 1; i <= 12; i++) {
      experiments.push({
        id: `${labId}-week-${i}`,
        labId: labId,
        weekNumber: i,
        title: `Experiment ${i}: ${cnOsTitles[i - 1]}`,
        aim: `To ${cnOsTitles[i - 1].toLowerCase()}`,
        theory: `This section covers the theoretical background for ${cnOsTitles[i - 1]}. It includes key principles and formulas.`,
        procedure: `1. Setup the environment.\n2. Execute step 1.\n3. Record observations.\n4. Analyze data.`,
        materials: `- Linux Environment\n- C Compiler (GCC)\n- Network Simulator (optional)`,
        observations: `| Trial | Value 1 | Value 2 |\n|---|---|---|\n| 1 | 10 | 20 |\n| 2 | 12 | 22 |`,
        result: `The experiment was successfully conducted and the results matched the theoretical expectations.`,
        vivaQuestions: `1. What is the primary principle behind this experiment?\n2. How does this implementation affect the system?`
      });
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      experiments.push({
        id: `${labId}-week-${i}`,
        labId: labId,
        weekNumber: i,
        title: `Experiment ${i}: Introduction to Lab Concepts`,
        aim: `To understand the fundamental concepts of week ${i}.`,
        theory: `This section covers the theoretical background for week ${i}. It includes key principles and formulas.`,
        procedure: `1. Setup the environment.\n2. Execute step 1.\n3. Record observations.\n4. Analyze data.`,
        materials: `- Component A\n- Component B\n- Software Tool X`,
        observations: `| Trial | Value 1 | Value 2 |\n|---|---|---|\n| 1 | 10 | 20 |\n| 2 | 12 | 22 |`,
        result: `The experiment was successfully conducted and the results matched the theoretical expectations.`,
        vivaQuestions: `1. What is the primary principle behind this experiment?\n2. How does component A affect the outcome?`
      });
    }
  }
  
  return experiments;
};

export const seedExperiments = async (labId: string) => {
  const initialExperiments = getInitialExperimentsList(labId);

  for (const exp of initialExperiments) {
    await fetch('/api/experiments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exp)
    });
  }
};

export const getExperimentsByLab = async (labId: string): Promise<Experiment[]> => {
  try {
    const response = await fetch(`/api/experiments/${labId}`);
    if (!response.ok) throw new Error('Failed to fetch experiments');
    const experiments = await response.json();
    
    if (experiments.length > 0) {
      return experiments.sort((a: any, b: any) => a.weekNumber - b.weekNumber);
    }
    
    // Fallback if no experiments found
    return getInitialExperimentsList(labId);
  } catch (error: any) {
    console.warn("Could not fetch experiments from API, using fallback data:", error);
    return getInitialExperimentsList(labId);
  }
};

export const getExperiment = async (experimentId: string): Promise<Experiment | null> => {
  try {
    const response = await fetch(`/api/experiment/${experimentId}`);
    if (response.ok) {
      return await response.json();
    }
    
    // Fallback if not found
    const match = experimentId.match(/^(.*)-week-(\d+)$/);
    if (match) {
      const labId = match[1];
      const weekNumber = parseInt(match[2], 10);
      const initialExperiments = getInitialExperimentsList(labId);
      return initialExperiments.find(exp => exp.weekNumber === weekNumber) || null;
    }
    return null;
  } catch (error: any) {
    console.warn("Could not fetch experiment from API, using fallback data:", error);
    const match = experimentId.match(/^(.*)-week-(\d+)$/);
    if (match) {
      const labId = match[1];
      const weekNumber = parseInt(match[2], 10);
      const initialExperiments = getInitialExperimentsList(labId);
      return initialExperiments.find(exp => exp.weekNumber === weekNumber) || null;
    }
    return null;
  }
};
