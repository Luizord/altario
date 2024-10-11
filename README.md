# Altar.io Full-Stack Exercise #1223

This is a project created for a technical challenge for Altar it consists of both a Backend and Frontend portion.

The Backend portion was done using Node.js v20 and the Frontend portion utilizes Angular v18.

To run the projects localy on your terminal for both the backend and frontend you should change your directory to 'backend/altario' or 'frontend/altario' respectively and run the command 'npm run start'.

The frontend application consists of a generator page that has a grid of 10x10 squares with alphabetical characters that update every 2 seconds, a button to start the generator, an input that only accepts one character every 4 seconds and a code at the bottom of the page. The input is used as a weighted constant that ensures that at least 20% of the grid used that character. The code is generated based on a specific set of supplied instructions.
Both the grid and code generations is being done by the backend.
For the purposes of speeding up development time I used the following libraries:
    - Angular Material: for the grid component,
    - ngx-mask: for the input masking and validation

The frontend also includes resposive styles for mobile screens. 

For the backend application I used the Nestjs framework for better code structuring and to speed up development, ideally for such a small application I would stick to just using express but i'm thinking ahead to possible bonus features.
The backend only has one endpoint, it receives an optional input in form of a single character it generates the grid and then generates a code based on that grid, it returns both the grid and the code in a single object.

