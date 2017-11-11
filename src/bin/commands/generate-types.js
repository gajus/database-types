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

export const command = 'generate-types';
export const desc = 'Generate types for a Postgres database.';

type ConfigurationType = {|
  +columnFilter: string,
  +databaseConnectionUri: string,
  +dialect: 'flow',
  +includeMaterializedViews: boolean,
  +propertyNameFormatter: string | null,
  +typeNameFormatter: string | null
|};

export const builder = (yargs: *): void => {
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
        default: null,
        description: 'Function used to format property name. Function is constructed using `new Function`. Function receives column name as the first parameter (parameter name is "columnName"). The default behaviour is to (lower) camelCase the column name.',
        type: 'string'
      },
      'type-name-formatter': {
        default: null,
        description: 'Function used to format type name. Function is constructed using `new Function`. Function receives table name as the first parameter (parameter name is "tableName"). The default behaviour is to (upper) CamelCase the table name and suffix it with "RecordType".',
        type: 'string'
      }
    });
};

type ColumnFilterType = (tableName: string, columnName: string) => boolean;
type FormatterType = (name: string) => string;

export const handler = async (argv: ConfigurationType): Promise<void> => {
  const defaultFormatTypeName = (tableName: string): string => {
    return _.upperFirst(_.camelCase(tableName)) + 'RecordType';
  };

  const defaultFormatPropertyName = (columnName: string): string => {
    return _.camelCase(columnName);
  };

  // eslint-disable-next-line no-extra-parens
  const filterColumns: ColumnFilterType = (argv.columnFilter ? new Function('tableName', 'columnName', argv.columnFilter) : null: any);

  // eslint-disable-next-line no-extra-parens
  const formatTypeName: FormatterType = (argv.typeNameFormatter ? new Function('columnName', argv.typeNameFormatter) : defaultFormatTypeName: any);
  // eslint-disable-next-line no-extra-parens
  const formatPropertyName: FormatterType = (argv.propertyNameFormatter ? new Function('tableName', argv.propertyNameFormatter) : defaultFormatPropertyName: any);

  const createProperties = (columns: $ReadOnlyArray<ColumnType>): $ReadOnlyArray<TypePropertyType> => {
    let filteredColumns = columns;

    if (filterColumns) {
      filteredColumns = filteredColumns.filter((column) => {
        // $FlowFixMe
        return filterColumns(column.tableName, column.columnName);
      });
    }

    return filteredColumns.map((column) => {
      return {
        name: formatPropertyName(column.columnName),
        type: mapFlowType(column.databaseType) + (column.nullable ? ' | null' : ''),
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
