import Chai from 'chai';
import sinon from 'sinon';
import mocks from '../mocks/index.js';
import { Container } from '@halliganjs/service-container';
import { generateMock } from '@anatine/zod-mock';
import type Sinon from 'sinon';

export type ChaiAndSinonAssert = Chai.Assert & sinon.SinonAssert;

declare module 'mocha' {
  export interface Context {
    assert: ChaiAndSinonAssert;
    sinon: sinon.SinonStatic;
    mocks: {
      complex: (
        methods: string[],
        result?: any
      ) => Record<string, sinon.SinonStub>;
      fetch: (result?: any, status?: number) => Sinon.SinonStub<any[], any>;
      zodType: typeof generateMock;
    };
    container: Container;
  }
}
