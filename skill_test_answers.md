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


