# Tankhunt

**Tankhunt** is a fast-paced multiplayer game where players control tanks and compete to dominate the battlefield across various game modes. A range of weapons is available through collectible and randomly generated power-ups.

The game is built for web browsers using **TypeScript**. It uses **Node.js** for the server, **Phaser.io** for the client, and **Socket.IO** for real-time communication.  
Currently, the game is playable only on desktop and laptop computers due to keyboard-only controls.

This game participated in a competition held by itnetwork.cz.

## Authors

- Development: Radek Veverka  
- Graphics: Dominik Plachý, Vojtěch Veverka  

## Download and run

1) Install nodejs and npm package manager
2) Clone the repository, precompiled and ready version is in dist folder
3) Fetch dependencies from package-lock.json: 
    `npm ci`
4) Server will listen on port 8080 by default, **set environment variable `TANKHUNT_PORT` to change it**
5) Run the server:
    `node dist/server/app.js`

