Tankhunt is a fast-paced multiplayer game. Players control their tanks to dominate the battlefield in various game modes. Several weapons are available in collectable and randomly generated power-ups. The game is created for browsers in Javascript, uses nodejs for the server, Phaser.io for a client and socket.io for both, but yet it is playable only on computers/laptops due to it's keyboard-only control.

First version of this game will participate in a small competition held by itnetwork.cz

The game is developed by Radek Veverka
Graphics is made by Dominik Plachý and Vojtěch Veverka

How to built the game so the server can be run and clients can connect:
1) Install nodejs and npm package manager
2) Clone the repository
3) Fetch node modules 
    $ npm install
3) Copy src folder and rename it to built 
    $ cp src built -R
4) Install typescript on your computer
    $ npm install typescript -g
5) Run typescript compiler
    $ tsc
6) All is ready to be used, server runs on port 8080 by default