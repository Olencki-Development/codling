/**
 * The purpose of this decorator is to re-assign the default value when the incoming value is null or undefined.
 * This can be modified to ignore null or undefined as an incoming value.
 */

type UseDefaultOptions = {
  whenNull?: boolean;
  whenUndefined?: boolean;
};

/**
 * Apply the default property value when the proposed new value is not valid
 * @param options options to determine when the default property value should be re-applied
 * @returns
 */
export function UseDefault(
  options: UseDefaultOptions = { whenNull: true, whenUndefined: true }
) {
  return function (target: any, propertyKey: string) {
    const instance = new target.constructor();
    const defaultValue = instance[propertyKey];

    const pattern: any = {
      get() {
        return this[`_${propertyKey}`];
      },
      set(newValue: any) {
        if (options.whenNull && newValue === null) {
          this[`_${propertyKey}`] = defaultValue;
        } else if (options.whenUndefined && newValue === undefined) {
          this[`_${propertyKey}`] = defaultValue;
        } else {
          this[`_${propertyKey}`] = newValue;
        }
      },
    };

    Object.defineProperty(target, propertyKey, pattern);
  };
}
