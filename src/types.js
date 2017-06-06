// @flow

export type {
  DatabaseConnectionType
} from 'mightyql';

export type UnnormalizedColumnType = {|
  +columnName: string,
  +dataType: string,
  +isNullable: 'YES' | 'NO',
  +tableName: string
|};

export type ColumnType = {|
  +columnName: string,
  +databaseType: string,
  +nullable: boolean,
  +tableName: string
|};

export type TypePropertyType = {|
  +name: string,
  +type: string,
  +typeName: string
|};
