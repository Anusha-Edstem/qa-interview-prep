# E2E scenario catalogue

Every scenario the suite intends to cover. A spec cites its ID in its title, so coverage is measured
against this list rather than against the specs themselves.

| ID      | Suite             | Scenario                                                                                                      | Tag         |
| ------- | ----------------- | ------------------------------------------------------------------------------------------------------------- | ----------- |
| AUTH-01 | Q1 Sauce Demo     | `standard_user` logs in and lands on the inventory                                                            | @smoke      |
| AUTH-02 | Q1 Sauce Demo     | `locked_out_user` sees the locked-out error                                                                   | @regression |
| AUTH-03 | Q1 Sauce Demo     | A wrong password shows the username/password mismatch error                                                   | @regression |
| CHK-01  | Q1 Sauce Demo     | Two items in the cart, badge shows 2, item total equals the sum of prices read from the page, order completes | @smoke      |
| BOOK-01 | Q2 Restful Booker | `POST /auth` returns a token                                                                                  | @smoke      |
| BOOK-02 | Q2 Restful Booker | Create a booking and read it back                                                                             | @smoke      |
| BOOK-03 | Q2 Restful Booker | `GET /booking/{id}` has every required field with the right type                                              | @regression |
| BOOK-04 | Q2 Restful Booker | `PUT` replaces a booking with a token                                                                         | @regression |
| BOOK-05 | Q2 Restful Booker | `PATCH` changes only the sent fields with a token                                                             | @regression |
| BOOK-06 | Q2 Restful Booker | `DELETE` with a token, then reading the booking returns 404                                                   | @regression |
| BOOK-07 | Q2 Restful Booker | Updating without a token is rejected                                                                          | @regression |
| MOCK-01 | Q3 API mocking    | A fully mocked fruit list replaces the real one                                                               | @smoke      |
| MOCK-02 | Q3 API mocking    | A real response with one added item shows both                                                                | @regression |
| MOCK-03 | Q3 API mocking    | A 500 from the fruit API                                                                                      | @regression |
| MOCK-04 | Q3 API mocking    | A fruit API that takes 3 seconds                                                                              | @regression |
| MOCK-05 | Q3 API mocking    | A recorded HAR replays with the real API blocked                                                              | @regression |
| UI-01   | Q4 The Internet   | Dynamic loading shows "Hello World!"                                                                          | @smoke      |
| UI-02   | Q4 The Internet   | Uploading a fixture file shows its name                                                                       | @regression |
| UI-03   | Q4 The Internet   | Downloading a file keeps its name and is not empty                                                            | @regression |
| UI-04   | Q4 The Internet   | Accepting a confirm                                                                                           | @regression |
| UI-05   | Q4 The Internet   | Dismissing a confirm                                                                                          | @regression |
| UI-06   | Q4 The Internet   | Typing into a prompt                                                                                          | @regression |
| UI-07   | Q4 The Internet   | A link opens a new tab, its heading is checked, focus returns                                                 | @regression |
| UI-08   | Q4 The Internet   | Reading the middle nested frame                                                                               | @regression |
| UI-09   | Q4 The Internet   | Basic auth through `httpCredentials`                                                                          | @smoke      |
