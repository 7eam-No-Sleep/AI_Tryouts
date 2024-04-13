# HoneycombQuery 
Translates natural language into executable SQL statements.
To see the AI in action and test the translation accuracy from varying user prompts, click the link below:
https://platform.openai.com/playground/p/lQsvWKhgLlKXZwNKZFxhMjeF?model=gpt-3.5-turbo&mode=chat
The API Key will need to be reset to an env value in the deployment environment. 
(The bash and ps command to export the api key can be found at the bottom of ai.js) 
_________________________________________________________________________________
The goal is to have the AI assistant's reply sent to a designated data table 
exclusively reserved for the AI's SQL statements. Which is then called by a hardcoded
SQL statement inside of a script that executes the AI's original SQL statement 
in our inventory_management database.

_________________________________________________________________________________
Guides/Documentation on working with chat models and OpenAi's APIs:
(The Documentation and API Reference tabs in OpenAI's Playground are extremely useful) 

https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models

https://platform.openai.com/docs/guides/function-calling


_________________________________________________________________________________


