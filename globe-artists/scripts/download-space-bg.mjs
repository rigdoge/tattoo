import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=3542&auto=format&fit=crop';
const outputPath = path.join(__dirname, '../public/space-background.jpg');

https.get(url, (response) => {
  const fileStream = fs.createWriteStream(outputPath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log('Space background downloaded successfully!');
  });
}).on('error', (err) => {
  console.error('Error downloading space background:', err.message);
});
