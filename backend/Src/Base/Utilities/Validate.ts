type ValidateOptions = 'username' | 'password';

class Validate {
  public static This(s: string, validateOptions: ValidateOptions) {
    if (validateOptions === 'username') {
      if (s.trim.length >= 6) {
        return true;
      }
      return false;
    }
    if (validateOptions === 'password') {
      if (s.trim.length >= 10) {
        return true;
      }
      return false;
    }
  }
}

Validate.This('dawdmawo', 'username');

export default Validate;
