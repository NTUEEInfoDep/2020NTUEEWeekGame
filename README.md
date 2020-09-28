# 2020NTUEEWeekGame

### How to run the game (for testing)

1.  Clone this project
2.  cmd `npm install` (if done it before then don't need)
3.  cmd `npm run develop`
4.  Open browser and go to [127.0.0.1:3000](http://localhost:3000)

### What we have done (9/25)

1.  client-server connection with socket.io
2.  a simple entry space
3.  an object that can shoot bullet when press space and move in control of mouse or direction key

### Todo this week (9/25)

1.  Finish the simplest ver. of game
2.  Start doing nice looking sprites and making animations

### Develop

`npm run develop`

### Production

`npm run build`

`npm start`

### Frontend

pixi.js

### Backend

express

socket.io

### Code Styling

eslint, airbnb config

prettier

### Credit

How to Build a Multiplayer(.io) Web Game -- Victor Zhou

- [An Example .io Game (repo)](https://github.com/vzhou842/example-.io-game?fbclid=IwAR061_dsMndxhigruwewlpbtMx48hR2NL29rsbB3CWoRuMR906lpXMPtfSg)
- [How to Build a Multiplayer (.io) Web Game, Part 1](https://victorzhou.com/blog/build-an-io-game-part-1/?fbclid=IwAR061_dsMndxhigruwewlpbtMx48hR2NL29rsbB3CWoRuMR906lpXMPtfSg)
- [How to Build a Multiplayer (.io) Web Game, Part 2](https://victorzhou.com/blog/build-an-io-game-part-2/)

---

## Content of Server

### Classes

- Object

  - <b>constructor</b> (id, x, y, dir, speed)

    | Info       | Description                                                                                                                            |
    | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
    | Parameters | id - A random number<br>x - Initial x-coordinate</br>y - Initial y-coordinate</br>dir - Initial orientation</br>speed - A fixed number |

    Save basic object information.

  - <b>update</b> (dt)

    | Info       | Description                             |
    | ---------- | --------------------------------------- |
    | Parameters | dt - A time interval between two frames |

    Change the position of the object.

  - <b>distanceTo</b> (object)

    | Info        | Description                             |
    | ----------- | --------------------------------------- |
    | Parameters  | object - Any subclasses of Object class |
    | Return      | Distance between two objects            |
    | Return type | Number                                  |

    Calculate the distance between two given objects.

  - <b>setDirection</b> (dir)

    | Info       | Description     |
    | ---------- | --------------- |
    | Parameters | dir - Direction |

    Set direction.

  - <b>serializeForUpdate</b> ()

    | Info        | Description                           |
    | ----------- | ------------------------------------- |
    | Return      | Id and x, y coordinates of the object |
    | Return type | Object                                |

    Return a object containing the information of the object itself at this moment.

- Bullet

  - <b>constructor</b> (parentID, x, y, dir, speed)

    | Info       | Description                                                                                                                                                          |
    | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Parameters | parentID - The id of object that shots the bullet</br>x - Initial x-coordinate</br>y - Initial y-coordinate</br>dir - Initial orientation</br>speed - A fixed number |

    Save basic bullet information.

  - <b>update</b> (dt)

    | Info        | Description                                 |
    | ----------- | ------------------------------------------- |
    | Parameters  | dt - A time interval between two frames     |
    | Return      | If or not the bullet exceeds the map border |
    | Return type | Boolean                                     |

    Checkout that if the bullet exceeds the border or not. If so, it returns true and the bullet should be destroyed.

- Player

  - <b>constructor</b> (id, username, x, y)

    | Info       | Description                                                                                                              |
    | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
    | Parameters | id - A random number<br>username - The name from the user input<br>x - Initial x-coordinate</br>y - Initial y-coordinate |

    Save basic player information.

  - <b>update</b> (dt)

    | Info        | Description                                                      |
    | ----------- | ---------------------------------------------------------------- |
    | Parameters  | dt - A time interval between two frames                          |
    | Return      | A new bullet object if cool-down time finished, if not so, null. |
    | Return type | Object / Null                                                    |

    Update the player's score, coordinates and cool-down time, if needed, a bullet also will be fired.

  - <b>takeBulletDamage</b> (role)

    | Info       | Description             |
    | ---------- | ----------------------- |
    | Parameters | role - One of the roles |

    Decrease the player's hp value if shot by a bullet from different roles.

  - <b>onDealtDamage</b> ()
    Increase the player's score if another player is shot by which.
  - <b>serializeForUpdate</b> ()

    | Info        | Description                                                    |
    | ----------- | -------------------------------------------------------------- |
    | Return      | The player's ID, current coordinates, orientation and hp value |
    | Return type | Object                                                         |

- Game

  - <b>constructor</b> ()
    Build a new room.
  - <b>addPlayer</b> (socket, username)

    | Info       | Description                                                         |
    | ---------- | ------------------------------------------------------------------- |
    | Parameters | socket - The player's socket<br>username - Name from the user input |

    Add the player to the room and randomly assign the initial position.

  - <b>removePlayer</b> (socket)

    | Info       | Description                                          |
    | ---------- | ---------------------------------------------------- |
    | Parameters | socket - The socket used by the player to be removed |

    Remove the player and the socket.

  - <b>handleInput</b> (socket, dir)

    | Info       | Description                                                    |
    | ---------- | -------------------------------------------------------------- |
    | Parameters | socket - The socket used by the player<br>dir - Keyboard input |

    Grab the keyboard input and then change the direction.

  - <b>update</b> ()
    Calculate the time elapsed, update the bullets' and the players' status, judge collisions and scores and renew all players' scenes.
  - <b>getLeaderBoard</b> ()
    | Info | Description |
    | ----------- | ----------------- |
    | Return | The new dashboard |
    | Return type | Array |
    Renew the dashboard by ordering players by their new scores and return it.
  - <b>createUpdate</b> (player, leaderboard)

    | Info        | Description                |
    | ----------- | -------------------------- |
    | Parameters  | player - <br>leaderboard - |
    | Return      |
    | Return type | Object                     |

    Return the current time, the player's information and others', all bullets' status and dashboard.

### Functions

- <b>applyCollisions</b> (players, bullets)
  | Info | Description |
  | ----------- | ----------------- |
  | Parameters | |
  | Return | Destroyed bullets |
  | Return type | Array |
  Check if the player is shot by a bullet, if so, decrease the player's hp value and return the bullet array to be cleared.
- <b>joinGame</b> (username)

  | Info       | Description |
  | ---------- | ----------- |
  | Parameters | player -    |

  Add the player to a room.

- <b>handleInput</b> (dir)

  | Info       | Description          |
  | ---------- | -------------------- |
  | Parameters | dir - Keyboard input |

  Grab the input from the keyboard at this moment.

- <b>onDisconnect</b> ()

  | Info       | Description |
  | ---------- | ----------- |
  | Parameters |             |
