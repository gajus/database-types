// @flow

import type {
  ColumnType,
  UnnormalizedColumnType
} from '../types';

export default (unnormalizedColumns: $ReadOnlyArray<UnnormalizedColumnType>): $ReadOnlyArray<ColumnType> => {
  const normalizedColumns = unnormalizedColumns.map((column) => {
    const valueIsNullable = column.isNullable === 'YES';

    return {
      columnName: column.columnName,
      databaseType: column.dataType,
      nullable: valueIsNullable,
      tableName: column.tableName
    };
  });

  return normalizedColumns;
};
