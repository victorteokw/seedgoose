# Seedgoose
[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![DevDependency Status][daviddm-image-dev]][daviddm-url-dev]
[![License][license-image]][license-url]
[![PR Welcome][pr-image]][pr-url]

Mongoose data seeding with smart id references tracking.

## Introduction

Seeding data with id references is always hard. That's why I created this
package. Seedgoose recursively goes through your model schemas to setup smart id
references tracking for you.

## Design Concept

The node.js ecosystem lacks a high quality data seeding tool and fixture
loading tool with id references support. I was shocked by this. This kind of
tools exist for years in Ruby on Rails world. It's the base functionality for
data seeding and unit test fixturing. In our node.js world, every team and
developer has their own time consuming and low quality solutions to seed data.
A tool is urgently needed to save our precious time and improve data seeding
experience.

Without Seedgoose, say you have following data

``` json
// authors.json
{
  "name": "Chris Berg",
  "posts": ["84bd43d8a0ffcde34567abcd", "84bd43d8a0ffcde34567abce", "84bd43d8a0ffcde34567abcf"]
}
// posts.json
[
  {
    "_id": "84bd43d8a0ffcde34567abce",
    "title": "Heal the world",
    "content": "Heal the world, make it a better place."
  },
  {
    "_id": "84bd43d8a0ffcde34567abcd",
    "title": "I have a dream",
    "content": "I still have a dream, a dream deeply rooted in the American dream."
  },
]

```

It's obscure and not descriptive. A lot of patient and time are consumed just
to make sure data hooks. Things get even worse when project goes larger and
larger and the obscure seed data become larger and larger, hard to read, hard
to modify.

This is where Seedgoose comes in. With Seedgoose, we can rewrite these data
like this:

``` json
// authors.json
{
  "name": "Chris Berg",
  "posts": ["i have a dream", "heal the world", "a didsummer night's dream"]
}
// posts.json
[
  {
    "_id": "heal the world",
    "title": "Heal the world",
    "content": "Heal the world, make it a better place."
  },
  {
    "_id": "i have a dream",
    "title": "I have a dream",
    "content": "I still have a dream, a dream deeply rooted in the American dream."
  },
]

```

Seedgoose recursively goes through your model schemas, and trying to find out
what you are referencing and set the relationships up for you. In this way, you
can define the identity of a model in any way you like. It's not restricted to
strings, actually number or even boolean value is also fine if it make sense.

According to this data loading nature, seedgoose can load program files as long
as it returns a object or array.

``` javascript
const map = require('lodash/map');
const times = require('lodash/times');
const flatten = require('lodash/flatten');
const faker = require('faker');

module.exports = flatten(map(["jack", "queen", "king"], (a) => times(3, (i) => ({
  "_id": `${a} post ${i + 1}`,
  "author": a,
  "title": faker.random.word(),
  "content": faker.lorem.paragraphs()
}))));
```

## Installation

Install Seedgoose with `npm`.

``` bash
npm install seedgoose
```

## Usage

To seed data into database, you need to do three things:
1. Write your data files
2. Let Seedgoose know where your data files and model files are
3. Run a seeding command

### Write your data files

With Seedgoose, you don't need to write your own programs or scripts to seed
data. Seedgoose handles insertions, updations and deletions for you. You just
write your data files. Although you don't need to write program or script files,
but you can write dynamic data files in programming language that represent
dynamic data.

* Write your data in JSON.

```json
{
  "jack": {
    "name": "Jack Jill",
    "age": 20
  },
  "bill": {
    "name": "Bill John",
    "age": 25
  }
}
```

* Write your data in CSON.

```cson
jack:
  name: 'Jack Jill'
  age: 20
bill:
  name: 'Bill John'
  age: 25
```

* Write your data in YAML.

```yaml
jack:
  name: Jack Jill
  age: 20
bill:
  name: Bill John
  age: 25
```

You can also write data files in javaScript and TypeScript by exporting a data
array or object.

### Configurations

Name your data files by database collection names. For example, if you have a
model file named `User`, then you should name data file `users` dot whatever
the type is. We follow the convention over configuration best practice to save
configuration time and suppress arguments.

Create a Seedgoose configuration file like this. You can write the
configuration file in any type, too.

``` javascript
// .seedgooserc.js
module.exports = {
  modelBaseDirectory: 'models', // model directory name
  models: '**/*.js', // model matcher
  data: 'data', // data directory name
  db: 'mongodb://localhost:27017/url-to-db' // db connection url
};
```

If you prefer to include configurations in `package.json`, you can write them
under the `seedgoose` field.

``` json
{
  "seedgoose": {
    "modelBaseDirectory": "models",
    "models": "**/*.js",
    "data": "data",
    "db": "mongodb://localhost:27017/url-to-db"
  }
}
```

### The command line interface

The Seedgoose command receives arguments and options in the following style.

```bash
seedgoose [command] [collections...] [options...]
```

To seed data into database while keep existing untouched, run

```
seedgoose seed
```

To seed data into database and updating existing on conflict, run

```
seedgoose reseed
```

To remove seeded records, run

```
seedgoose unseed
```

Only run seeding on some collections, run

```
seedgoose seed users posts
```

To run command and silent output, run

```
seedgoose seed --silent
```

## Help & Issues

Please open an issue if you encountered troubles and problems.

## License

MIT © [Zhang Kai Yu][license-url]

[npm-image]: https://badge.fury.io/js/seedgoose.svg
[npm-url]: https://npmjs.org/package/seedgoose
[travis-image]: https://travis-ci.org/zhangkaiyulw/seedgoose.svg?branch=master
[travis-url]: https://travis-ci.org/zhangkaiyulw/seedgoose
[daviddm-image]: https://david-dm.org/zhangkaiyulw/seedgoose.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/zhangkaiyulw/seedgoose
[daviddm-image-dev]: https://david-dm.org/zhangkaiyulw/seedgoose/dev-status.svg
[daviddm-url-dev]: https://david-dm.org/zhangkaiyulw/seedgoose?type=dev
[license-image]: https://img.shields.io/github/license/zhangkaiyulw/seedgoose.svg
[license-url]: https://github.com/zhangkaiyulw/seedgoose/blob/master/LICENSE
[pr-image]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[pr-url]: https://github.com/zhangkaiyulw/seedgoose/blob/master/CONTRIBUTING.md
