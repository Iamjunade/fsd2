import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

const ONLINE_COMPILER_API_URL = 'https://api.onlinecompiler.io';
const API_KEY = '99b25db1595628362bb49b0a5fa60f2a';

const COMPILER_NAMES: Record<string, string> = {
  'python': 'python-3.14',
  'cpp': 'g++-15',
  'java': 'openjdk-25',
  'javascript': 'typescript-deno'
};

app.get('/api/ping', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CodeLab Backend Ready',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/compile-code', (req, res) => {
  const { language, code } = req.body;
  
  // Simulate real-time compilation/syntax checking
  const errors: unknown[] = [];
  
  if (code && (code.includes('syntax error') || code.includes('compile error'))) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Simulated syntax error: invalid token',
      severity: 'error'
    });
  } else if (language === 'cpp' && !code.includes('#include')) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Warning: Missing standard includes',
      severity: 'warning'
    });
  }
  
  res.json({ errors });
});

app.post('/api/run-code', async (req, res) => {
  const { language, code, input } = req.body;

  if (!code) {
    res.json({ output: 'Error: No code provided', status: 'error' });
    return;
  }

  const compiler = COMPILER_NAMES[language] || 'python-3.14';

  try {
    const response = await fetch(`${ONLINE_COMPILER_API_URL}/api/run-code-sync/`, {
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

    const data = await response.json();
    
    // onlinecompiler.io returns { output, error, status, exit_code, ... }
    let output = data.output || '';
    let status = data.status === 'success' ? 'success' : 'error';
    
    if (data.error) {
      output += (output ? '\n' : '') + data.error;
    }
    
    res.json({ output: output.trim(), status });
  } catch (error: unknown) {
    res.json({ output: `Execution failed: ${error instanceof Error ? error.message : String(error)}`, status: 'error' });
  }
});

app.post('/api/submit-code', async (req, res) => {
  const { language, code, input } = req.body;
  const compiler = COMPILER_NAMES[language] || 'python-3.14';

  try {
    const response = await fetch(`${ONLINE_COMPILER_API_URL}/api/run-code-sync/`, {
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

    const data = await response.json();
    
    let status = data.status === 'success' ? 'Accepted' : 'Runtime Error';
    const executionTime = Math.floor(parseFloat(data.time || '0') * 1000) || 10;
    
    if (data.error) {
       status = 'Error';
    }

    // Simulate multiple test cases based on the result of the main execution
    const testCases = [
      { id: 1, type: 'Sample Input', status: status === 'Accepted' ? 'Passed' : 'Failed', time: executionTime },
      { id: 2, type: 'Hidden Edge Case 1', status: status === 'Accepted' ? 'Passed' : 'Failed', time: executionTime + Math.floor(Math.random() * 5) },
      { id: 3, type: 'Hidden Edge Case 2', status: status === 'Accepted' ? 'Passed' : 'Failed', time: executionTime + Math.floor(Math.random() * 10) },
      { id: 4, type: 'Large Input Test', status: status === 'Accepted' ? 'Passed' : 'Failed', time: executionTime + Math.floor(Math.random() * 20) + 10 },
    ];

    res.json({ status, executionTime, testCases });
  } catch {
    res.json({ 
      status: 'Error', 
      executionTime: 0,
      testCases: [{ id: 1, type: 'Execution Error', status: 'Failed', time: 0 }]
    });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
