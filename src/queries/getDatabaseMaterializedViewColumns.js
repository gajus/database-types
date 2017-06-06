// @flow

import {
  sql
} from 'mightyql';
import type {
  DatabaseConnectionType,
  UnnormalizedColumnType
} from '../types';

export default async (connection: DatabaseConnectionType): Promise<$ReadOnlyArray<UnnormalizedColumnType>> => {
  return connection.any(sql`
    SELECT
      mv.relname AS "tableName",
      atr.attname AS "columnName",
      pg_catalog.format_type (atr.atttypid, NULL) "dataType",
      (case when atr.attnotnull then 'YES' else 'NO' end) "isNullable"
    FROM
      pg_class mv
      JOIN pg_namespace ns ON mv.relnamespace = ns.oid
      JOIN pg_attribute atr ON atr.attrelid = mv.oid
      AND atr.attnum > 0
      AND NOT atr.attisdropped
    WHERE
      ns.nspname = 'public' AND
      mv.relkind = 'm'
  `);
};
