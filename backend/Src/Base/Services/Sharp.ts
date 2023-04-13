import sharp from 'sharp';

class Sharp {
  public static async Restructure({
    file,
    w,
    h,
    quality,
    path,
  }: {
    file: Buffer;
    w: number;
    h: number;
    quality: number;
    path: string;
  }) {
    sharp(file).resize(w, h).toFormat('jpeg').jpeg({ quality }).toFile(path);
  }
}

export default Sharp;
