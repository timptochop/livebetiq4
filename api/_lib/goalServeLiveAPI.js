// api/_lib/goalServeLiveAPI.js

import https from 'https';
import zlib from 'zlib';
import { parseStringPromise } from 'xml2js';

export async function fetchGoalServeTennisLive() {
  return new Promise((resolve, reject) => {
    const GOALSERVE_KEY = process.env.GOALSERVE_KEY;

    if (!GOALSERVE_KEY) {
      console.error('❌ Missing GOALSERVE_KEY environment variable.');
      reject(new Error('GOALSERVE_KEY is not defined.'));
      return;
    }

    const GOALSERVE_URL = `https://www.goalserve.com/getfeed/tennis?tip=live&cat=all&key=${GOALSERVE_KEY}`;

    const req = https.get(GOALSERVE_URL, { headers: { 'Accept-Encoding': 'gzip' } }, (res) => {
      const chunks = [];
      const encoding = res.headers['content-encoding'];
      const stream = encoding === 'gzip' ? res.pipe(zlib.createGunzip()) : res;

      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', async () => {
        try {
          const xml = Buffer.concat(chunks).toString('utf-8');
          const json = await parseStringPromise(xml, {
            explicitArray: false,
            mergeAttrs: true,
          });

          const matches = json?.scores?.category || [];
          resolve(matches);
        } catch (err) {
          console.error('❌ Failed to parse XML from GoalServe:', err);
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ HTTPS request to GoalServe failed:', err);
      reject(err);
    });

    req.end();
  });
}