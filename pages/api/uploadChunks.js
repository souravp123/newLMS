import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default async function handler(req, res) {

  if (!('authorization' in req.headers)) {
    return res.status(401).json({ message: 'No authorization token' });
  }

  switch (req.method) {
    case 'POST':
      upload.single('chunk')(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to upload chunk' });
        }
        try {
          const { chunkIndex, totalChunks, fileName, type } = req.body;
          console.log("chunkIndex, totalChunks, fileName, type", chunkIndex, totalChunks, fileName, type)
          const finalFileName = fileName;
          const chunkDir = path.resolve(process.env.NODE_ENV === 'production' ? process.env[`CHUNK_PATH_PROD`] : process.env[`CHUNK_PATH`], 'chunks', finalFileName);
          // Ensure the directory exists 
          await fs.ensureDir(chunkDir);

          // Write the chunk to a file
          const chunkPath = path.join(chunkDir, `chunk_${chunkIndex}`);
          await fs.writeFile(chunkPath, req.file.buffer);


          // If all chunks are uploaded, assemble the file
          if (parseInt(chunkIndex, 10) + 1 === parseInt(totalChunks, 10)) {
            const finalFilePath = path.join(
              process.env.NODE_ENV === 'production' ? process.env[`${type.toUpperCase()}_PATH_PROD`] : process.env[`${type.toUpperCase()}_PATH`],
              finalFileName

            );

            const writeStream = fs.createWriteStream(finalFilePath);

            for (let i = 0; i < totalChunks; i++) {
              const chunkPath = path.join(chunkDir, `chunk_${i}`);
              const data = await fs.readFile(chunkPath);
              writeStream.write(data);
              await fs.remove(chunkPath); // Remove chunk file after writing

            }
            writeStream.end();

            // Remove the chunks directory
            await fs.remove(chunkDir);

            return res.status(200).json({ fileName: finalFileName, message: 'File Uploaded Successfully.' });

          }

          res.status(200).json({ message: 'Chunk received' });
        } catch (error) {
          console.error('Error processing chunk:', error);
          res.status(500).json({ error: 'Error processing chunk' });
        }
      });
      break;

    default:
      console.error(`Method ${req.method} not allowed`);
      res.status(405).json({
        message: `Method ${req.method} not allowed`,
      });
  }
}
