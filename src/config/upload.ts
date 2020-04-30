import path from 'path';
import crypto from 'crypto';

/* export default {
  storage: multer.diskStorage({
    // Vai pegar o diretorio atual, subir duas pastas e entrar na pasta tmp para armazenar os arquivos
    destination: path.resolve(__dirname, '..', '..', 'tmp'),

    filename(resolve, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      // null = não aconteceu erro
      return callback(null, fileName);
    },
  }),
}; */
