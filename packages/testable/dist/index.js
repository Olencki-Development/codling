import sinon from 'sinon';
import Chai from 'chai';
import * as mocks from './mocks/index.js';
export const chaiAndSinonAssert = sinon.assert.expose(Chai.assert, {
  prefix: '',
});
export function beforeEachHandler() {
  this.assert = chaiAndSinonAssert;
  this.sinon = sinon;
  this.mocks = {
    complex: mocks.complexMock.bind(this),
    fetch: mocks.fetchMock.bind(this),
  };
}
