import OpenAI from "openai";

//Authorization: Bearer OPENAI_API_KEY

const openai = new OpenAI({
  //organization: 'org-UAb4C2lZ7qFQGEU3bVlWnYk0', <- May not need
  apiKey: process.env.OPENAI_API_KEY,
});
/** -- Original message strings in case the formatting broke the prompt: --
 * 
 * 
 * -- "system" content: -- 
 * content": "Given the following SQL tables, your job is to write queries given a user’s request.\n    \n    CREATE TABLE Orders (\n      OrderID int,\n      CustomerID int,\n      OrderDate datetime,\n      OrderTime varchar(8),\n      PRIMARY KEY (OrderID)\n    );\n    \n    CREATE TABLE OrderDetails (\n      OrderDetailID int,\n      OrderID int,\n      ProductID int,\n      Quantity int,\n      PRIMARY KEY (OrderDetailID)\n    );\n    \n    CREATE TABLE Products (\n      ProductID int,\n      ProductName varchar(50),\n      Category varchar(50),\n      UnitPrice decimal(10, 2),\n      Stock int,\n      PRIMARY KEY (ProductID)\n    );\n    \n    CREATE TABLE Customers (\n      CustomerID int,\n      FirstName varchar(50),\n      LastName varchar(50),\n      Email varchar(100),\n      Phone varchar(20),\n      PRIMARY KEY (CustomerID)\n    );"
 * 
 * "assistant" content:
 * "content": "```sql\nSELECT AVG(TotalOrderValue) AS AverageTotalOrderValue\nFROM (\n    SELECT o.OrderID, SUM(od.Quantity * p.UnitPrice) AS TotalOrderValue\n    FROM Orders o\n    JOIN OrderDetails od ON o.OrderID = od.OrderID\n    JOIN Products p ON od.ProductID = p.ProductID\n    WHERE o.OrderDate = '2023-04-01'\n    GROUP BY o.OrderID\n) AS OrderTotals;\n```"       
 *
 *  --------------------------------------------------------------------------
 */

//Pulls the user input from the wuery text box to be used as the AI prompt.
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('textBoxForm');
  
  form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission
      
      // Get the user input from the text box
      const userInput = document.getElementById('textbox').value;
      
      // Call the function in ai.js with the user input
      processUserInput(userInput);
  });
});

function processUserInput(userInput) {
  // Call another function in your ai.js file or perform any other processing with the user input
  console.log('User input:', userInput);
}

const response = await openai.chat.completions.create({ 
  model: "gpt-3.5-turbo",
  messages: [
    {
      "role": "system",
      "content": "Given the following SQL tables, your job is to write queries given a user’s request.\n    " +    //Syntax for datatypes may be incorrect (X represents the table matches the current schema)
      "\n    CREATE TABLE Inventory ("+ //X originally named 'products'
      "\n      ProductID int," +
      "\n      ProductName string,"+
      "\n      Category string,"+
      "\n      Description string,"+
      "\n      CostPrice decimal(10,2),"+
      "\n      SellingPrice decimal(10,2),"+
      "\n      QuantityInStock int(11),"+
      "\n      Color string,"+
      "\n      Size string,"+
      "\n      Material string,"+
      "\n      Status string,"+
      "\n      PRIMARY KEY (ProductID)"+
      "\n    );"+
      "\n    "+
      "\n    CREATE TABLE Sales ("+ //X
      "\n      SaleID int,"+
      "\n      CustomerID int,"+
      "\n      SaleDate datetime,"+
      "\n      ItemsSold int,"+
      "\n      TotalPrice int,"+
      "\n      EmployeeID int,"+
      "\n      PRIMARY KEY (SaleID)"+
      "\n    );"+
      "\n    "+
      "\n    CREATE TABLE Transactions ("+ //X
      "\n      TransactionID int(11),"+
      "\n      SaleID int(11),"+
      "\n      CustomerID int(11),"+ //<--- Is this still practical?
      "\n      TransactionDate datetime,"+
      "\n      PaymentMethod varchar(50),"+
      "\n      TotalAmount decimal(10, 2),"+
      "\n      CashReceived decimal(10, 2),"+
      "\n      ChangeGiven decimal(10, 2),"+
      "\n      PRIMARY KEY (TransactionID)"+ //Intentionally left out the last three table rows since storing that data is likely a terrible idea
      "\n    );"+
      "\n    "+
      "\n    CREATE TABLE items_sold ("+ //X
      "\n      SaleID int(11),"+
      "\n      ProductID int(11),"+
      "\n      QuantitySold int(11),"+
      "\n      PricePerItem decimal(10, 2),"+
      "\n      PRIMARY KEY (ProductID)"+
      "\n    );"+
      "\n    "+
      "\n    CREATE TABLE Employees ("+ //X
      "\n      EmployeeID int(11),"+
      "\n      FirstName varchar(50),"+
      "\n      LastName varchar(50),"+
      //       address 
      "\n      PhoneNumber varchar(15),"+
      "\n      EmployeePin int(4),"+
      "\n      last_login datetime,"+
      "\n      last_logout datetime,"+
      "\n      total_hours_worked decimal(10, 2),"+
      "\n      JobTitle varchar(11),"+ //change from role to prevent possible interference with the API "role"
      "\n      PRIMARY KEY (EmployeeID)"+
      "\n    );"+
      "\n    "+
      "\n    CREATE TABLE Shifts ("+ //X
      "\n      ShiftID int(11),"+
      "\n      EmployeeID int(11),"+
      "\n      ShiftTime decimal(10, 2),"+
      "\n      ShiftDate datetime,"+
      "\n      total_transactions decimal(10,2),"+
      "\n      total_cash decimal(10,2),"+
      "\n      total_checks decimal(10,2),"+
      "\n      total_card_sales decimal(10,2),"+
      "\n      total_sales decimal(10,2),"+
      "\n      PRIMARY KEY (ShiftID)"+
      "\n    );"+
      "\n    "+
      "\n    CREATE TABLE Customers ("+ //X
      "\n      CustomerID int,"+
      "\n      FirstName varchar(50),"+
      "\n      LastName varchar(50),"+
      "\n      PhoneNumber varchar(15),"+
      "\n      Email varchar(100),"+
      "\n      PRIMARY KEY (CustomerID)\n    );"
    },

    // Code for any JavaScript functionality can go here, such as event handling or data manipulation
    // For example, if you want to do something when the text in the textbox changes:
    // document.getElementById('textbox').addEventListener('input', function(event) {
    //   console.log('Text changed:', event.target.value);
    // }),
    // ^---- Uncomment after the text box is setup and working properly ----^

    {
      "role": "user",
      "content": "What items are currently out of stock?"// uncomment after textbox is functioning -->document.getElementById('textbox').value
    },
    {
      "role": "assistant",
      "content": "```sql"+
      "\nSELECT TOP 1 ProductID, SUM(QuantitySold) AS TotalQuantitySold"+
      "\nFROM items_sold"+
      "\nGROUP BY ProductID"+
      "\nORDER BY TotalQuantitySold DESC"+
      "\n```"
    }
  ],
  temperature: 0,
  max_tokens: 10, //originally set to 1024
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
});

if (response && response.data && response.data.choices && response.data.choices.length > 0) {
  console.log(response.data.choices[0].text);
} else {
  console.error("Invalid response format:", response);
}




//console.log(response.data.choices[0].text);




// const response = await openai.completions.create({
//     model: "gpt-3.5-turbo",
//     prompt: "Say this is a test.",
//     max_tokens: 7,
//     temperature: 0,
//   });


//export apiKey command (bash): export OPENAI_API_KEY=your_api_key
//  ^-------------------(Powershell): $env:OPENAI_API_KEY = "your_api_key" <- (include the quotations with your actual secret key)
