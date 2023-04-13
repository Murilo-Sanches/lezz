class Is {
  public static equal(x: string, y: string): boolean {
    return x === y;
  }

  public static falsy(...fields: string[]): boolean {
    return fields.every((field) => field.trim().length !== 0);
  }

  public static empty(...fields: string[]): boolean {
    return fields.every((field) => (field ? true : false));
  }
}

export default Is;
