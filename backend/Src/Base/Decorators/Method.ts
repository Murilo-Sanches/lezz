import { Request, Response } from 'express';

/* eslint-disable @typescript-eslint/ban-types */
function deprecated(deprecationReason: string) {
  return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
    return {
      get() {
        const wrapperFn = (...args: any[]) => {
          console.warn(`Method ${memberName} is deprecated with reason: ${deprecationReason}`);
          propertyDescriptor.value.apply(this, args);
        };

        Object.defineProperty(this, memberName, {
          value: wrapperFn,
          configurable: true,
          writable: true,
        });
        return wrapperFn;
      },
    };
  };
}

const Dec = (target: Object, key: string | symbol, descriptor: PropertyDescriptor) => {
  const original = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    console.log(args);
    original(args);
  };
  console.log(original);
  console.log(descriptor);
  return descriptor;
};

class T {
  private instanceMember: string = 'hello';

  @deprecated('Use another instance method')
  public DeprecatedMethod() {
    console.log(`inside deprecated instance method - instanceMember = ${this.instanceMember}`);
  }

  @Dec
  public FireShip(req: Request, res: Response) {
    console.log('fireship decorator');
  }
}

function Method() {
  new T().DeprecatedMethod();
}

export default Method;
