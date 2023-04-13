import { NextFunction, Request, Response } from 'express';

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

function Async() {
  // + Object se refere a classe
  return (_target: Object, _key: string | symbol, descriptor: PropertyDescriptor) => {
    // ! Class constructor AuthenticationController cannot be invoked without 'new'
    // console.log(typeof _target.constructor());

    // + Método original
    const original: Function = descriptor.value;

    // + Overriding o método original
    descriptor.value = async function (...args: [Request, Response, NextFunction]) {
      try {
        return await original.apply(this, args);
      } catch (err) {
        args[2](err);
      }
    };

    // + Retornar a função
    return descriptor;
  };
}

export default Async;
