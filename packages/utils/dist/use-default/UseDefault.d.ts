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
export declare function UseDefault(
  options?: UseDefaultOptions
): (target: any, propertyKey: string) => void;
export {};
