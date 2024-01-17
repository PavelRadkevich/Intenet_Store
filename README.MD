To run application you should install (npm install):
bootstrap-vue
knex
express
cors
fast-json-patch
vue-router
axios

The frontend and service app run on different port numbers, if you change them the pages will stop loading due to cors limitations. You also need to have a database server enabled. In the "CreateAllTables" file there is SQL code that creates the necessary (empty) database

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).