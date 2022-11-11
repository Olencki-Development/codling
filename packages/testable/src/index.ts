import * as sinon from 'sinon';
import * as Chai from 'chai';
import { ChaiAndSinonAssert } from './@types/mocha';
import * as mocks from './mocks';

export const chaiAndSinonAssert = sinon.assert.expose(Chai.assert, {
  prefix: '',
}) as unknown as ChaiAndSinonAssert;

export function beforeEachHandler(this: Mocha.Context) {
  this.assert = chaiAndSinonAssert;
  this.sinon = sinon;
  this.mocks = {
    complex: mocks.complexMock.bind(this),
    fetch: mocks.fetchMock.bind(this),
  };
}
