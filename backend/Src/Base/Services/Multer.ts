import multer from 'multer';

import Exception from '@Base/Utilities/Exception';

class Multer {
  public static Single(fieldName: string = 'photo') {
    return Multer.Upload().single(fieldName);
  }

  public static Fields() {
    return Multer.Upload().fields([{ name: 'images', maxCount: 4 }]);
  }

  private static Upload(): multer.Multer {
    return multer({
      storage: multer.memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image')) {
          callback(null, true);
        } else {
          callback(
            new Exception('Arquivo enviado não é uma imagem, por favor selecione uma imagem', 400)
          );
        }
      },
      limits: {},
    });
  }
}

export default Multer;
