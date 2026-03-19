import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (request: VercelRequest, response: VercelResponse) {
  response.status(200).json({
    status: 'ok',
    message: 'CodeLab Serverless API Ready',
    timestamp: new Date().toISOString()
  });
}
