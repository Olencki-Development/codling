import Sinon from 'sinon';
import Chai from 'chai';
import { generateMock } from '@anatine/zod-mock';
import { getComplexMock } from './mocks/complex.js';
import { getFetchMock } from './mocks/fetch.js';
export const chaiAndSinonAssert = Sinon.assert.expose(Chai.assert, {
  prefix: '',
});
export function beforeEachHandler() {
  this.assert = chaiAndSinonAssert;
  this.sinon = Sinon;
  this.mocks = {
    complex: getComplexMock.bind(this),
    fetch: getFetchMock.bind(this),
    zodType: generateMock,
  };
}
