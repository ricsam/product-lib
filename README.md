## Product library
A product library served using a firebase backend.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

[Demo](https://product-library.firebaseapp.com/)

**Up and running**:
1. git clone https://github.com/iZettle/web-home-assignment_richard-samuelsson.git product-library
2. cd product-library
3. git checkout richard
4. yarn install

**Available Scripts**
  - yarn start
  - yarn test
  - yarn run build
  - yarn run eject

**OBS: I have not written many tests.**

```
+---public                        > Contains some static browser related assets
\---src                           > The project lives in this folder
    +---containers                > First-letter uppercase files indicate containers,
                                  ⤷ components.js contains some stateless components
    +---state                     > Files which handles the Redux store
    +---styles                    > App.scss contains some specific styling
    |   +---bs                    > Bootstrap
    |   |   +---mixins
    |   |   \---utilities
    |   +---fa                    > font awesome
    |   \---fonts                 > font awesome fonts
    \---tests                     > saga.test.js contains boilerplate testing code for the sagas.
```