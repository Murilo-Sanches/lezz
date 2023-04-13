/* eslint-disable @typescript-eslint/ban-types */

import colors from '@Base/Utilities/pallete';

// ! Class Decorators - 1 argumento
// + Decorator de class recebe um target que é o construtor da classe, se não receber argumentos, pode ser sem ()
@Dec1
export class Decorator1 {}
function Dec1(target: Function) {
  Object.seal(target);
  Object.seal(target.prototype);
}

// + Para passar argumentos para o decorator, a função que vai receber argumentos precisa retornar o decorator em si
// - Também chamado de Decorator Factory
@Dec2('1.1')
export class Decorator2 {}
function Dec2(version?: string) {
  return (target: Function) => {
    console.log(colors.FgCyan, `Versão do controller: ${version}`);
    Object.seal(target);
    Object.seal(target.prototype);
  };
}

// ! Property Decorators - 2 argumentos
// + 1: For static properties, the constructor function of the class, for all other properties, the prototype of the class.
// + 2: The name of the member.
class Person1 {
  @PrintName
  public name: string = 'murilo';
}
function PrintName(target: any, propertyName: string) {
  console.log(colors.FgGreen, `Person - Target: ${target}`);
  console.log(colors.FgGreen, `Person - Property: ${propertyName}`);
}

function AllowOnly(whitelist: string[]) {
  return (target: any, memberName: string) => {
    let currentValue: any = target[memberName];

    Object.defineProperty(target, memberName, {
      set: (newValue: any) => {
        if (!whitelist.includes(newValue)) {
          console.log(`${newValue} block`);
          return;
        }
        console.log(`${newValue} passa`);
        currentValue = newValue;
      },
      get: () => currentValue,
    });
  };
}

class Person2 {
  @AllowOnly(['Jon', 'Jane'])
  name: string = 'Jon';
}

function ExecDecorators(): void {
  new Decorator1();
  new Decorator2();
  new Person1();

  // ! Criando uma whitelist
  const person = new Person2();
  person.name = 'Peter';
  person.name = 'Jane';
}

export default ExecDecorators;
