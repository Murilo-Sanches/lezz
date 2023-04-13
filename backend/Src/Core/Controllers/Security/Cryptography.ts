import bcrypt from 'bcryptjs';
import crypto from 'crypto';

class Cryptography {
  public static async Hash(target: string, salt: number = 12): Promise<string> {
    return bcrypt.hash(target, salt);
  }

  public static IsEqual(x: string, y: string): Promise<boolean> {
    return bcrypt.compare(x, y);
  }

  public static CreateTokenAndHash(intensity: number): { random: string; hash: string } {
    const random = crypto.randomBytes(intensity).toString();
    const hash = crypto.createHash('sha256').update(random).digest('hex');
    return { random, hash };
  }

  public static CreateHash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

export default Cryptography;
