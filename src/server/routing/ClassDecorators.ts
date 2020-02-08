/**
 * Constructor Decorator for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */
import { ON_PROPERTIES_NAME } from './RouteDecorators';

export function Controller<T extends new (...args: any[]) => any>(path: string) {
  return (constr: T) => {
    return class extends constr {
      onBasePath = '/' + path;
      methods = Object.getOwnPropertyNames(constr.prototype).reduce((all, m) => {
        const method = constr.prototype[m];
        if (method.hasOwnProperty(ON_PROPERTIES_NAME)) {
          const onProperties = method[ON_PROPERTIES_NAME];
          // @ts-ignore
          all.push({ [ON_PROPERTIES_NAME]: onProperties });
        }
        return all;
      }, []);
    };
  };
}
