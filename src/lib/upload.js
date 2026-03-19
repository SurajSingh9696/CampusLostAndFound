import Busboy from 'busboy';
import sharp from 'sharp';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

export function parseForm(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ 
      headers: {
        'content-type': req.headers.get('content-type'),
      },
      limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
      }
    });

    const fields = {};
    let fileData = null;
    let fileTooLarge = false;

    busboy.on('field', (fieldname, value) => {
      fields[fieldname] = value;
    });

    busboy.on('file', async (fieldname, file, info) => {
      const { filename, mimeType } = info;

      // Validate file type
      if (!mimeType.startsWith('image/')) {
        file.resume();
        return reject(new Error('Only image files are allowed'));
      }

      const chunks = [];
      let totalSize = 0;

      file.on('data', (chunk) => {
        totalSize += chunk.length;
        if (totalSize > MAX_FILE_SIZE) {
          fileTooLarge = true;
          file.resume();
        } else {
          chunks.push(chunk);
        }
      });

      file.on('end', async () => {
        if (fileTooLarge) {
          return reject(new Error('File size exceeds 1MB limit'));
        }

        if (chunks.length > 0) {
          try {
            const buffer = Buffer.concat(chunks);
            
            // Compress and optimize image
            const optimizedBuffer = await sharp(buffer)
              .resize(800, 800, {
                fit: 'inside',
                withoutEnlargement: true,
              })
              .jpeg({ quality: 80, progressive: true })
              .toBuffer();

            // Convert to base64 for database storage
            const base64Image = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
            
            fileData = {
              filename,
              mimeType: 'image/jpeg',
              data: base64Image,
              size: optimizedBuffer.length,
            };
          } catch (error) {
            reject(new Error('Error processing image: ' + error.message));
          }
        }
      });
    });

    busboy.on('finish', () => {
      resolve({ fields, file: fileData });
    });

    busboy.on('error', (error) => {
      reject(error);
    });

    // Convert Request to Node.js readable stream
    const reader = req.body.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          controller.enqueue(value);
        }
      }
    });

    // Pipe to busboy
    (async () => {
      const nodeStream = require('stream').Readable.from(
        (async function* () {
          const reader = stream.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              yield value;
            }
          } finally {
            reader.releaseLock();
          }
        })()
      );
      nodeStream.pipe(busboy);
    })();
  });
}

export function validateImageSize(base64String) {
  if (!base64String) return true;
  
  // Remove data URL prefix
  const base64Data = base64String.split(',')[1] || base64String;
  const sizeInBytes = (base64Data.length * 3) / 4;
  
  return sizeInBytes <= MAX_FILE_SIZE;
}
