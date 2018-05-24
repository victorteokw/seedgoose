# Nonula

Mongoose data seeding with references.

## Design Concept

The mongoDB and mongoose ecosystem, and node.js development, lacks high quality data seeding tools and fixture loading tools with id references support. Every team and developer has their own time consuming and low quality solutions to seed data. A tool is urgently needed to save our precious time and improve data seeding experience.

Without nonula, say you have following data

```
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
    content: "Heal the world, make it a better place."
  },
  {
    "_id": "84bd43d8a0ffcde34567abcd",
    "title": "I have a dream",
    content: "I still have a dream, a dream deeply rooted in the American dream."
  },  
]

```

It's obsure and not descriptive. A lot of patient and time are consumed just to make sure data hooks. Things get even worse when project goes larger and larger and the obscure seed data become larger and larger, hard to read, hard to modify.

This is where nonula comes in, with nonula, we can rewrite these data like this

```
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
    content: "Heal the world, make it a better place."
  },
  {
    "_id": "i have a dream",
    "title": "I have a dream",
    content: "I still have a dream, a dream deeply rooted in the American dream."
  },  
]

```

Nonula recursively goes through the model schema, and trying to find out what you are referencing and set the relationships for you. In this way, you can define the identity of a model in any way you like. 

## Usage

Name your seed data files by database collection names and separate them into two different directories. For example, if you have a model file named `User`, then you should name data file `users.json` or `users.js`. We follow the convensions over configuration best practice, save configuration time and automatically get the mapping.

Add these to your package.json

```
"scripts": {
  "seed": "nonula seed --models=./your-model-dir --data=./your-data-dir --mongourl=mongodb://localhost:27017/your-database"
  "drop": "nonula drop --mongourl=mongodb://localhost:27017/your-database"
}
```

To seed data into database, run this:

```
npm run seed
```

To drop database, run this:

```
npm run drop
```

## Installation

Install nonula in your project.
``` bash
npm install nonula --save-dev
```
Install it globally.
``` bash
npm install nonula -g
```

## Roadmap

Nonula aims to be the ultimate mongoose and mongoDB data seeding tool. A lot of features and tests are required on the way to version 1.0.
