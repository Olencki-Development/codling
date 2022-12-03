import Chai from 'chai';
import sinon from 'sinon';
import mocks from '../mocks/index.js';
import { Container } from '@halliganjs/service-container';

export type ChaiAndSinonAssert = Chai.Assert & sinon.SinonAssert;

declare module 'mocha' {
  export interface Context {
    assert: ChaiAndSinonAssert;
    sinon: sinon.SinonStatic;
    mocks: {
      complex: typeof mocks.complexMock;
      fetch: typeof mocks.fetchMock;
    };
    container: Container;
  }
}
