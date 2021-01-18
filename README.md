## APIs Layout

### User Service:

   1. `POST /users/signup`
      - input (application/x-www-form-urlencoded)
        ``` 
        username: $USERNAME:STRING 
        email: $EMAIL:STRING
        password: $PASSWORD:STRING
        ```
      - output (JSON)
        - SUCCEED (http status code: `200`)
          ```
          {
              "message": "sign up succeeded"
          }
          ```
        - FAILED (http status code: `400`)
          ```
          {
              "message": $ERROR_MESSAGE
          }
          ```

   2. `POST /users/login`
      - input (application/x-www-form-urlencoded)
        ```
        email: $EMAIL:STRING
        password: $PASSWORD:STRING
        ```
      - output (JSON)
        - SUCCEED (http status code: `200`)
           ```
           {
               "message": "login succeeded." 
               "token": "$JWT"
           }
           // JWT token encoded fields includes: "username", "role"
           ```

### Item Service:

1. `POST /items` (PROTECTED path, only Admin can access)
   - input (multipart/form-data)
     ```
     // authorization requires "Bearer $JWT"
     
     itemname: $ITEMNAME:STRING, 
     price: $PRICE:STRING(represent a NUMBER),
     description: $DESCRIPTION:STRING,          // optional
     category: $CATEGORY:STRING,                // optional
     picture: $URL_LINK:STRING                  // optional
     ```
   - output (JSON)
     - SUCCEED (http status code: `201`)
        ```
        {
            "message": "Add item succeed."
        }
        ```
        
3. `DELETE /items/:id` (PROTECTED path, only Admin can access):
   - input
       ```
       // authorization requires "Bearer $JWT"
       ```
   - output (JSON):
     - SUCCEED (http status code: `204`)
        ```
        {
            "message": "Delete item succeed."
        }
        ```

4. `GET /items` & `GET /items?category=$CATEGORY`**(Optional)**:
   - input
       ```
       // authorization requires "Bearer $JWT"
       ```
   - output (JSON):
     - SUCCEED (http status code: `200`)
        ```
        {
            "items": {
                  {
                  _id: $ITEMID,
                  itemname: $ITEMNAME:STRING, 
                  price: $PRICE:STRING(represent a NUMBER),
                  description: $DESCRIPTION:STRING,
                  category: $CATEGORY:STRING,
                  picture: $URL_LINK:STRING
                  },
                  {
                  _id: $ITEMID,
                  itemname: $ITEMNAME:STRING, 
                  price: $PRICE:STRING(represent a NUMBER),
                  description: $DESCRIPTION:STRING,
                  category: $CATEGORY:STRING,
                  picture: $URL_LINK:STRING
                  },
                  ...          
            }
        }
        ```

### Cart Service
1. `POST users/cart-items`
   - input (application/x-www-form-urlencoded):
     ```
     // authorization requires "Bearer $JWT"
     
     itemname: $ITEMNAME,
     quantity: $QUANTITY:STRING(represent a NUMBER),
     ```
   - output (JSON):
     - SUCCEED (http status code: `200`)
        ```
        {
            "message": "Add item to cart succeed."
            "user": {
                username: $USERNAME:STRING,
                password: $PASSWORD:STRING
                role: $ROLE:STRING,
                cart: {
                    $ITEMNAME: $QUANTITY:NUMBER,
                    $ITEMNAME: $QUANTITY:NUMBER,
                    ...,
                    $ITEMNAME: $QUANTITY:NUMBER
                }
            }
        }
        ```

4. `GET users/cart-items`
   - input
       ```
       // authorization requires "Bearer $JWT"
       ```
   - output (JSON):
     - SUCCEED (http status code: `200`)
        ```
        {
            "message": "get successful",
            "cart":{
                  {
                      _id: $ITEMID,
                      itemname: $ITEMNAME:STRING, 
                      price: $PRICE:STRING(represent a NUMBER),
                      quantity: $QUANTITY:STRING(represent a NUMBER),
                      },
                  {
                      _id: $ITEMID,
                      itemname: $ITEMNAME:STRING, 
                      price: $PRICE:STRING(represent a NUMBER),
                      quantity: $QUANTITY:STRING(represent a NUMBER),
                  },
                  ...          
            }
        }
        ```

5. `GET users/cart-items/checkout`
   - input
       ```
       // authorization requires "Bearer $JWT"
       ```
   - output (JSON):
     - SUCCEED (http status code: `200`)
        ```
        {
            "message": "Checkout succeed."
        }
        ```
