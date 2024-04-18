# React.js Project with Vite

This project is a React.js application built using Vite for fast and efficient development. Below are instructions on how to run and build the project.

## Prerequisites

Make sure you have Node.js and npm installed on your system. You can download and install them from [here](https://nodejs.org/).

## Getting Started

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Sumitgit21/movie-app-react.git
  

2. Navigate into the project directory
     ```bash
   cd movie-app-react
  
2. Install node_modules
     ```bash
   npm install
  
3. Run on Local host
     ```bash
   npm run dev

4. Make Production build 
     ```bash
   npm run build

## Requirements Covered

### Layout and UI
- Created custom UI components using React for improved reusability.
- Displayed a list of movies sorted in descending order of popularity.
- Showed movie title, image, genre, cast, director, and a short description on each information card.

### Default Page Load State
- Loaded a total of 20 movies for each year.
- By default, displayed a list of movies from the year 2012.
- Implemented smooth scrolling behavior to load more movies dynamically:
  - Loaded movies of the previous year when the user scrolls up.
  - Loaded movies of the next year when the user scrolls down.
- Ensured smooth interaction without causing any jitters as movies are added to the list dynamically.

 
