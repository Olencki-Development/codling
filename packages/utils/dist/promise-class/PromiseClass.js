/**
 * Exposes internal promise methods on the class that resolves a result of type T
 */
export class PromiseClass {
  /**
   * Exposes traditional promise methods to the class
   */
  then(onfulfilled, onrejected) {
    const result = this._fetchResult();
    return result.then.apply(result, [onfulfilled, onrejected]);
  }
  catch(onrejected) {
    return this.then().catch(onrejected);
  }
  finally(onfinally) {
    return this.then().finally(onfinally);
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
