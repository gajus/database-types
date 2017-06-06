// @flow

/* eslint-disable no-new-func */

import _ from 'lodash';
import {
  createConnection
} from 'mightyql';
import type {
  ColumnType,
  TypePropertyType
} from '../../types';
import {
  getDatabaseTableColumns,
  getDatabaseMaterializedViewColumns
} from '../../queries';
import {
  generateFlowTypeDocument,
  mapFlowType,
  normalizeColumns
} from '../../utilities';

export const command = 'generate';
export const desc = 'Generate Flow types for a Postgres database.';

export const builder = (yargs: Object): void => {
  yargs
    .options({
      'column-filter': {
        description: 'Function used to filter columns. Function is constructed using `new Function`. Function receives table name as the first parameter and column name as the second parameter (parameter names are "tableName" and "columnName").',
        type: 'string'
      },
      'database-connection-uri': {
        demand: true
      },
      dialect: {
        choices: [
          'flow'
        ],
        demand: true
      },
      'include-materialized-views': {
        default: true,
        type: 'boolean'
      },
      'property-name-formatter': {
        description: 'Function used to format property name. Function is constructed using `new Function`. Function receives column name as the first parameter (parameter name is "columnName"). The default behaviour is to (lower) camelCase the column name.',
        type: 'string'
      },
      'type-name-formatter': {
        description: 'Function used to format type name. Function is constructed using `new Function`. Function receives table name as the first parameter (parameter name is "tableName"). The default behaviour is to (upper) CamelCase the table name and suffix it with "RecordType".',
        type: 'string'
      }
    });
};

export const handler = async (argv: Object): Promise<void> => {
  const defaultFormatTypeName = (tableName: string): string => {
    return _.upperFirst(_.camelCase(tableName)) + 'RecordType';
  };

  const defaultFormatPropertyName = (columnName: string): string => {
    return _.camelCase(columnName);
  };

  const filterColumns = argv.columnFilter ? new Function('tableName', 'columnName', argv.columnFilter) : null;
  const formatTypeName = argv.typeNameFormatter ? new Function('columnName', argv.typeNameFormatter) : defaultFormatTypeName;
  const formatPropertyName = argv.propertyNameFormatter ? new Function('tableName', argv.propertyNameFormatter) : defaultFormatPropertyName;

  const createProperties = (columns: $ReadOnlyArray<ColumnType>): $ReadOnlyArray<TypePropertyType> => {
    let filteredColumns = columns;

    if (filterColumns) {
      filteredColumns = filteredColumns.filter((column) => {
        // $FlowFixMe
        return filterColumns(column.tableName, column.columnName);
      });
    }

    return filteredColumns.map((column) => {
      // $FlowFixMe
      return {
        // $FlowFixMe
        name: formatPropertyName(column.columnName),
        type: mapFlowType(column.databaseType) + (column.nullable ? ' | null' : ''),

        // $FlowFixMe
        typeName: formatTypeName(column.tableName)
      };
    });
  };

  const connection = await createConnection(argv.databaseConnectionUri);

  let unnormalizedColumns;

  unnormalizedColumns = await getDatabaseTableColumns(connection);

  if (argv.includeMaterializedViews) {
    unnormalizedColumns = unnormalizedColumns.concat(await getDatabaseMaterializedViewColumns(connection));
  }

  const normalizedColumns = normalizeColumns(unnormalizedColumns);

  const properties = createProperties(normalizedColumns);

  // eslint-disable-next-line no-console
  console.log(generateFlowTypeDocument(properties));

  await connection.end();
};
