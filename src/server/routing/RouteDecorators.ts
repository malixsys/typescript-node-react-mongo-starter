export const ON_PROPERTIES_NAME = 'onProperties';

export function Get(path?: string, options?: any): MethodDecorator {
  return helperDec('GET', path, options);
}

export function Post(path?: string, options?: any): MethodDecorator {
  return helperDec('POST', path, options);
}

export function Put(path?: string, options?: any): MethodDecorator {
  return helperDec('PUT', path, options);
}

export function Delete(path?: string, options?: any): MethodDecorator {
  return helperDec('DELETE', path, options);
}

function helperDec(call: string, path?: string, options?: any): MethodDecorator {
  path = path && path !== '/' ? '/' + path : '/';

  // @ts-ignore
  return (_: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // target
    const method = descriptor.value;

    method[ON_PROPERTIES_NAME] = {
      call,
      path,
      options,
      method: propertyKey
    };

    return descriptor;
  };
}
