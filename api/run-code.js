const ONLINE_COMPILER_API_URL = 'https://api.onlinecompiler.io';
const API_KEY = '99b25db1595628362bb49b0a5fa60f2a';

const COMPILER_NAMES = {
  'python': 'python-3.12',
  'cpp': 'g++-13',
  'java': 'openjdk-21',
  'javascript': 'typescript-deno'
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { language, code, input } = req.body;

  if (!code) {
    return res.status(200).json({ output: 'Error: No code provided', status: 'error' });
  }

  const compiler = COMPILER_NAMES[language] || 'python-3.14';

  try {
    const apiResponse = await fetch(`${ONLINE_COMPILER_API_URL}/api/run-code-sync/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": API_KEY
      },
      body: JSON.stringify({
        compiler: compiler,
        code: code,
        input: input || ""
      })
    });

    const data = await apiResponse.json();
    
    let output = data.output || '';
    let status = data.status === 'success' ? 'success' : 'error';
    
    if (data.error) {
      output += (output ? '\n' : '') + data.error;
    }
    
    res.status(200).json({ output: output.trim(), status });
  } catch (error) {
    res.status(200).json({ output: `Execution failed: ${error.message}`, status: 'error' });
  }
};
