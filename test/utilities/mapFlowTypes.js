// @flow

import test from 'ava';
import mapFlowType from '../../src/utilities/mapFlowType';

const knownTypes = {
  bigint: 'number',
  character: 'string',
  coordinates: 'string',
  integer: 'number',
  json: 'Object',
  text: 'string',
  timestamp: 'string'
};

test('correctly maps known types', (t) => {
  for (const [databaseType, flowType] of Object.entries(knownTypes)) {
    if (typeof flowType !== 'string') {
      throw new TypeError();
    }

    t.true(mapFlowType(databaseType) === flowType, flowType);
  }
});
