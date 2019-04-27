# Seedgoose

Mongoose data seeding with smart reference.

## Design Concept

The mongoose ecosystem lacks a high quality data seeding tool and fixture
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

You can also write dynamics data, Seedgoose recognizes it and handle it
correctly for you.

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

## Usage

```bash
seedgoose [command] [collections...] [options...]
```
## Usage

Name your seed data files by database collection names. For example, if you
have a model file named `User`, then you should name data file `users` dot
whatever you want. We follow the convention over configuration best practice,
save configuration time and automatically get the mapping.

Create a Seedgoose configuration file like this:

``` javascript
// .seedgooserc.js
module.exports = {
  modelBaseDirectory: 'models', // model directory name
  models: '**/*.js', // model matcher
  data: 'data', // data directory name
  db: 'mongodb://localhost:27017/url-to-db' // db connection url
};
```

Or add these to your package.json

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

To seed data into database, run this:

```
seedgoose seed
```

To update data in the database, run this:

```
seedgoose reseed
```

To remove seeded records, run this:

```
seedgoose unseed
```

## Installation

Install Seedgoose in your project.
``` bash
npm install seedgoose --save-dev
```
Install Seedgoose globally.
``` bash
npm install seedgoose --global
```
