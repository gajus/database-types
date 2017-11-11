# database-types

[![Travis build status](http://img.shields.io/travis/gajus/database-types/master.svg?style=flat-square)](https://travis-ci.org/gajus/database-types)
[![Coveralls](https://img.shields.io/coveralls/gajus/database-types.svg?style=flat-square)](https://coveralls.io/github/gajus/database-types)
[![NPM version](http://img.shields.io/npm/v/database-types.svg?style=flat-square)](https://www.npmjs.org/package/database-types)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

A generic type generator for various databases.

The current supported database backend is Postgres. Track [#1 issue](https://github.com/gajus/database-types/issues/1) for MySQL support.

## Use case

If you are developing applications in JavaScript and using either of the strict type systems, then you can use `database-types` to generate types describing the database.

## Example usage

### Generating Flow types

```bash
export DATABASE_TYPES_DATABASE_CONNECTION_URI=postgres://postgres:password@127.0.0.1/test
export DATABASE_TYPES_COLUMN_FILTER="return !['raster_overviews', 'raster_columns', 'geometry_columns', 'geography_columns', 'spatial_ref_sys'].includes(tableName)"
export DATABASE_TYPES_DIALECT=flow

database-types generate-types > ./types.js

```

This generates file containing Flow type declarations in the following format:

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
$ npm install database-types -g
$ database-types --help

```
