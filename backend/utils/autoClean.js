import fs from 'fs';
import path from 'path';

export function cleanupOldFiles() {
  const uploadsDir = path.join('public', 'uploads');

  if (!fs.existsSync(uploadsDir)) return;

  const files = fs.readdirSync(uploadsDir);
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    if (now - stats.mtimeMs > maxAge) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old file: ${file}`);
    }
  });
}
