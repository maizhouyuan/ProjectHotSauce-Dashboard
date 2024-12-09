

# Project Hot Sauce Dashboard
**Project Hot Sauce has finally entered its final development stage, and I hope you're as excited as I am!**

## Project Structure

```
.
├── README.md # Project documentation (this file)
├── backend/ # Backend (Node.js/Express) folder
│ ├── node_modules/ # Backend dependencies
│ ├── package-lock.json # Backend lock file for npm dependencies
│ ├── package.json # Backend dependencies and scripts
│ ├── routes/ # API route handlers
│ ├── server.js # Main server file for starting the backend
│ └── utils/ # Utility functions for backend logic

frontend/
├── node_modules/          
├── public/                
├── src/                   
│   ├── assets/            
│   ├── components/        
│   ├── pages/             
│   ├── styles/            
│   │   └── index.css      
│   ├── App.jsx            
│   ├── main.jsx           
├── .gitignore             
├── eslint.config.js       
├── index.html             
├── package-lock.json      
├── package.json           
└── vite.config.js        
```


### Key Directories:
- **`backend/routes/`**: Contains route handlers for different API endpoints.
- **`backend/utils/`**: Utility functions used by the backend services.
- **`frontend/src/`**: Contains source files, including components, views, and other frontend logic.
- **`frontend/public/`**: Static assets such as HTML files and icons that are served directly.

## Getting Started

To start contributing, follow these steps to set up both the backend and frontend on your local machine.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

#### 1. Clone the repository:
```git clone https://github.com/maizhouyuan/ProjectHotSauce-Dashboard.git```

#### 2. Navigate into the project directory:
```cd ProjectHotSauce-Dashboard```

#### 3. Backend Setup:
Navigate into the backend folder: ```cd backend```\
Install backend dependencies:```npm install```\
Start the backend server:```npm start```\
The backend server should now be running on http://localhost:5001

#### 4. Frontend Setup:
Open a new terminal window or tab, then navigate into the frontend folder:```cd frontend```\
Install frontend dependencies:```npm install```\
Start the frontend development server: ```npm run dev```\
The frontend should now be running on http://localhost:5173/

### Dependencies
This project uses several key dependencies in both the backend and frontend.
#### Backend Dependencies:
**Express**: Web framework for Node.js to handle routing and middleware.\
**Axios**: For making HTTP requests from the server.\
You can view all backend dependencies in ```backend/package.json```.
#### Frontend Dependencies:
You can view all frontend dependencies in ```frontend/package.json```.

## Contribution Guidelines
Create a new branch for each feature or bug fix you're working on:\
```git checkout -b feature/new-feature-name```

Once you're done with your changes, commit them:\
```git add .```\
```git commit -m "Add new feature"```

Push your branch to GitHub:\
```git push origin feature/new-feature-name```

Open a pull request on GitHub, and assign it to the reviewers.