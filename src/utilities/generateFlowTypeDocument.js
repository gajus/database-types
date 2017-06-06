// @flow

import {
  groupBy,
  sortBy
} from 'lodash';
import type {
  TypePropertyType
} from '../types';

const generateFlowTypeDeclarationBody = (properties: $ReadOnlyArray<TypePropertyType>): string => {
  const sortedProperties = sortBy(properties, 'name');

  const propertyDeclarations = [];

  for (const column of sortedProperties) {
    propertyDeclarations.push('+' + column.name + ': ' + column.type);
  }

  return propertyDeclarations.join('\n');
};

export default (
  columns: $ReadOnlyArray<TypePropertyType>
): string => {
  const groupedProperties = groupBy(columns, 'typeName');

  const typeDeclarations = [];

  const typeNames = Object.keys(groupedProperties);

  for (const typeName of typeNames) {
    const typeProperties = groupedProperties[typeNames];

    const typeDeclaration = `
export type ${typeName} = {|
  ${generateFlowTypeDeclarationBody(typeProperties).split('\n').join(',\n  ')}
|};`;

    typeDeclarations.push(typeDeclaration);
  }

  return typeDeclarations.join('\n');
};
