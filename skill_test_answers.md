## Skill Test Answers

### Q1: Optimize the product listing page to reduce loading time
#### Use lazy loading for product list page
File: web/src/pages/ProductListing/ProductListing.jsx

#### Apply infinite loading for product list page
Frontend
1. Instll *react-infinite-scroll-hook* package
2. Edit data provider to add pagination support
3. Edit *ProductListingSection.jsx* to apply the infinite scroll functionality
4. Improve the *.product-card-container* style in the *ProductListingSection.css* file so that the products automatically fill the product list according to the screen resolution.

Backend
1. Edit *getAllProductsHandler* function in the *ProductController.js* to support pagination functionality

#### Test Results
First loading time without cache
| Round    | Bebore   | After   |
| -------- | -------- | ------- |
| 1        | 3.27s    | 2.71s   |
| 2        | 3.12s    | 2.87s   |
| 3        | 3.32s    | 2.75s   |
The average loading time before optimization was 3.24 seconds, and the average loading time after optimization was 2.76 seconds.

#### Conclusion
Because the product list page uses a paginated loading strategy, the optimized average initial load time has been reduced by half a second.
It is believed that when released to the production environment, it can save a significant amount of database query time and greatly improve the initial page loading speed.

### Q2: Refactor existing code to follow best practices
I restructured the project into three sub-modules.
1. api: the location of backend source code
2. web: the location of frontend source code
3. shared: the common library sharing between projects.
Under the project structure, programmers can collaborate without being affected and share the work results.
Depending on the project size and the number of members, the project can also be designed in monorepo or microservices pattern.

### Q3: Write automated tests to cover key functionalities.
I created unit tests for the controllers, here is the report.
```bash
$ npm run test:coverage

> @sneakers/api@0.1.3 test:coverage
> jest --coverage

 PASS  tests/controllers/paymentController.test.js
 PASS  tests/controllers/orderController.test.js
 PASS  tests/controllers/productController.test.js
 PASS  tests/controllers/userController.test.js
  ● Console

    console.log
      Server Running

      at Object.log (src/models/userModel.js:65:9)

-----------------------|---------|----------|---------|---------|--------------------------------------------------------------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                        
-----------------------|---------|----------|---------|---------|--------------------------------------------------------------------------
All files              |   57.32 |    32.43 |   41.53 |   57.98 |                                                                          
 src/controllers       |   57.36 |    35.29 |   43.75 |   57.76 |                                                                          
  orderController.js   |   69.09 |    38.88 |   66.66 |   69.09 | 14,53,64-70,78-89,101,105,117,138                                        
  paymentController.js |   57.14 |       50 |      40 |   57.14 | 71-138,143-146                                                           
  productController.js |   48.41 |    23.07 |   35.29 |   49.18 | 35-37,59-61,71,120-181,189-201,224,228-230,254-260,268-308               
  userController.js    |   62.92 |       45 |   41.66 |   62.92 | 44,50,58-63,71-73,84,112-116,134,147-157,201-203,211-219,227-240,247-257 
 src/models            |      70 |        0 |       0 |      70 |                                                                          
  orderModel.js        |     100 |      100 |     100 |     100 |                                                                          
  paymentModel.js      |     100 |      100 |     100 |     100 |                                                                          
  productModel.js      |     100 |      100 |     100 |     100 |                                                                          
  userModel.js         |   57.14 |        0 |       0 |   57.14 | 48-52,56,62,68-77                                                        
 src/utils             |   28.57 |        0 |      25 |   30.76 |                                                                          
  errorHandler.js      |     100 |      100 |     100 |     100 |                                                                          
  searchFeatures.js    |    5.26 |        0 |       0 |    5.88 | 3-47                                                                     
  sendToken.js         |      60 |      100 |     100 |      60 | 4-11                                                                     
 tests/utils           |   91.66 |      100 |      80 |     100 |                                                                          
  asyncErrorHandler.js |     100 |      100 |     100 |     100 |                                                                          
  sendEmail.js         |   83.33 |      100 |      50 |     100 |                                                                          
-----------------------|---------|----------|---------|---------|--------------------------------------------------------------------------

Test Suites: 4 passed, 4 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        2.133 s, estimated 3 s
Ran all test suites.
```