// @flow

import {
  createDebug
} from '../factories';

const debug = createDebug('mapFlowType');

export default (databaseTypeName: string): string => {
  if (databaseTypeName === 'json') {
    return 'Object';
  }

  if (/^(?:text|character|timestamp|coordinates)(\s|$)/.test(databaseTypeName)) {
    return 'string';
  }

  if (databaseTypeName === 'bigint' || databaseTypeName === 'integer') {
    return 'number';
  }

  debug('unknown type', databaseTypeName);

  return 'any';
};
