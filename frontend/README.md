 # TextTriangleAI Frontend

This repository contains the frontend part of the TextTriangleAI project, built using Next.js.

## Installation

Follow these steps to download, install dependencies, and run the frontend project.

### Prerequisites

Make sure you have the following installed:

- Node.js (version 18 or higher)
- npm (Node Package Manager)

### Clone the Repository

Clone the TextTriangleAI repository from GitHub:

```bash
git clone https://github.com/bakkeshks/TextTriangleAI.git
cd TextTriangleAI/frontend
``` 
### Install Dependencies

Install the necessary dependencies using npm:
```bash
npm install
``` 

### Configuration
Add url to .env file in the root of the frontend directory and add the following content:

```bash 
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
``` 
This sets the base URL for API requests. Adjust NEXT_PUBLIC_API_BASE_URL if your backend server runs on a different port or domain.

### Running the Development Server
To run the development server locally, use the following command:

```bash
npm run dev
```
This starts the Next.js development server on http://localhost:3000.

### Building for Production
To build the project for production, run:

```bash 
npm run build
``` 
This command builds the application for production usage. You can then deploy the contents of the out directory to your hosting provider.
