import type Chai from 'chai';
import type Sinon from 'sinon';
import type { Container } from '@halliganjs/service-container';
import type { generateMock } from '@anatine/zod-mock';
import type { GetComplexMock } from '../mocks/complex.js';
import type { GetFetchMock } from '../mocks/fetch.js';

export type ChaiAndSinonAssert = Chai.Assert & Sinon.SinonAssert;

declare module 'mocha' {
  export interface Context {
    assert: ChaiAndSinonAssert;
    sinon: Sinon.SinonStatic;
    mocks: {
      complex: GetComplexMock;
      fetch: GetFetchMock;
      zodType: typeof generateMock;
    };
    container: Container;
  }
}
