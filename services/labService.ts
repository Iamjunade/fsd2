export interface Lab {
  id: string;
  code: string;
  name: string;
  iconName: string;
  color: string;
  bg: string;
  group: string;
  order: number;
}

export const seedLabs = async () => {
  const initialLabs: Lab[] = [
    {
      id: '24CSPC45',
      code: '24CSPC45',
      name: 'CN & OS (Linux) Lab',
      iconName: 'Terminal',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      group: 'bg-emerald-500',
      order: 1
    },
    {
      id: '24CSPC46',
      code: '24CSPC46',
      name: 'Full Stack Development Lab',
      iconName: 'Layers',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      group: 'bg-blue-500',
      order: 2
    },
    {
      id: '24CSPC47',
      code: '24CSPC47',
      name: 'Automated Testing Tools - Selenium Lab',
      iconName: 'Search',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      group: 'bg-purple-500',
      order: 3
    }
  ];

  for (const lab of initialLabs) {
    await fetch('/api/labs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lab)
    });
  }
};

export const getLabs = async (): Promise<Lab[]> => {
  try {
    const response = await fetch('/api/labs');
    if (!response.ok) throw new Error('Failed to fetch labs');
    const labs = await response.json();
    
    if (labs.length > 0) {
      return labs;
    }
  } catch (error: any) {
    console.warn("Could not fetch labs from API, using fallback data:", error);
  }
  
  return [
    {
      id: '24CSPC45',
      code: '24CSPC45',
      name: 'CN & OS (Linux) Lab',
      iconName: 'Terminal',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      group: 'bg-emerald-500',
      order: 1
    },
    {
      id: '24CSPC46',
      code: '24CSPC46',
      name: 'Full Stack Development Lab',
      iconName: 'Layers',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      group: 'bg-blue-500',
      order: 2
    },
    {
      id: '24CSPC47',
      code: '24CSPC47',
      name: 'Automated Testing Tools - Selenium Lab',
      iconName: 'Search',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      group: 'bg-purple-500',
      order: 3
    }
  ];
};
