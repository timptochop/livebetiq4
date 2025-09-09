// api/_lib/goalServeLiveAPI.js
import https from 'https';
import zlib from 'zlib';
import { parseStringPromise } from 'xml2js';

const GOALSERVE_URL = 'https://www.goalserve.com/getfeed/tennis?tip=live&cat=all&key=REPLACE_WITH_YOUR_KEY';

export async function fetchGoalServeTennisLive() {
  return new Promise((resolve, reject) => {
    const req = https.get(GOALSERVE_URL, { headers: { 'Accept-Encoding': 'gzip' } }, (res) => {
      const chunks = [];
      const encoding = res.headers['content-encoding'];

      const stream = encoding === 'gzip' ? res.pipe(zlib.createGunzip()) : res;

      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', async () => {
        try {
          const xml = Buffer.concat(chunks).toString('utf-8');
          const json = await parseStringPromise(xml, { explicitArray: false, mergeAttrs: true });
          const matches = json?.scores?.category || [];
          resolve(matches);
        } catch (err) {
          console.error('Failed to parse XML:', err);
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      console.error('Request failed:', err);
      reject(err);
    });

    req.end();
  });
}