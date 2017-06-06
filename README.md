# database-types

[![Travis build status](http://img.shields.io/travis/gajus/database-types/master.svg?style=flat-square)](https://travis-ci.org/gajus/database-types)
[![Coveralls](https://img.shields.io/coveralls/gajus/database-types.svg?style=flat-square)](https://coveralls.io/github/gajus/database-types)
[![NPM version](http://img.shields.io/npm/v/database-types.svg?style=flat-square)](https://www.npmjs.org/package/database-types)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

A type generator for Postgres.

## Example usage

### Generating Flow types

```bash
export DATABASE_TYPES_DATABASE_CONNECTION_URI=postgres://postgres:password@127.0.0.1/test
export DATABASE_TYPES_COLUMN_FILTER="return !['raster_overviews', 'raster_columns', 'geometry_columns', 'geography_columns', 'spatial_ref_sys'].includes(tableName)"
export DATABASE_TYPES_DIALECT=flow

database-types generate > ./types.js

```

This generates file containing Flow type declartions in the following format:

```js
export type ReservationSeatRecordType = {|
  +createdAt: string,
  +id: number,
  +reservationId: number,
  +seatId: number
|};

export type TicketTypeRecordType = {|
  +cinemaId: number,
  +id: number,
  +name: string,
  +nid: string,
  +policy: string | null
|};

// ...

```

## CLI

```bash
npm install database-types -g

Options:
  --help                        Show help                              [boolean]
  --column-filter               Function used to filter columns. Function is
                                constructed using `new Function`. Function
                                receives table name as the first parameter and
                                column name as the second parameter (parameter
                                names are "tableName" and "columnName").[string]
  --property-name-formatter     Function used to format property name. Function
                                is constructed using `new Function`. Function
                                receives column name as the first parameter
                                (parameter name is "columnName"). The default
                                behaviour is to (lower) camelCase the column
                                name.                                   [string]
  --type-name-formatter         Function used to format type name. Function is
                                constructed using `new Function`. Function
                                receives table name as the first parameter
                                (parameter name is "tableName"). The default
                                behaviour is to (upper) CamelCase the table name
                                and suffix it with "RecordType".        [string]
  --database-connection-uri                                           [required]
  --dialect                                         [required] [choices: "flow"]
  --include-materialized-views                         [boolean] [default: true]

```
