import Sinon from 'sinon';
import Chai from 'chai';
import type { ChaiAndSinonAssert } from './@types/mocha.js';
import { generateMock } from '@anatine/zod-mock';
import { getComplexMock } from './mocks/complex.js';
import { getFetchMock } from './mocks/fetch.js';

export const chaiAndSinonAssert = Sinon.assert.expose(Chai.assert, {
  prefix: '',
}) as unknown as ChaiAndSinonAssert;

export function beforeEachHandler(this: Mocha.Context) {
  this.assert = chaiAndSinonAssert;
  this.sinon = Sinon;
  this.mocks = {
    complex: getComplexMock.bind(this),
    fetch: getFetchMock.bind(this),
    zodType: generateMock,
  };
}
