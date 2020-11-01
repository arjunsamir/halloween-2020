
const tasks = [
    {
        "name": "Beer Pong",
        "description": "Win a game of beer pong",
        "rules": "Pour cups with the drink of choice. Drink cup where ping pong lands.",
        "hints": "Play in teams of 2 to get the task done faster.",
        "img": "",
        "category": "game",
        "players": {
            "min": 2,
            "max": 10,
            "even": true
        },
        "duration": "long",
        "boozy": true,
        "location": {
            "name": "Garage",
            "static": true,
            "zone": 6,
            "x": 0,
            "y": 2
        }
    },

    {
        "name": "Flip Cup",
        "description": "Win a game of flip cup",
        "img": "",
        "rules": "Chug your drink of choice to start the game. Flip the cup from right-side up to upside down. Move shot glass toward your goal. Loser takes the shot.",
        "hints": "Play in teams to get the task done faster",
        "category": "game",
        "players": {
            "min": 2,
            "max": 10,
            "even": true
        },
        "duration": "long",
        "boozy": true,
        "location": {
            "name": "Backyard",
            "static": true,
            "zone": 2,
            "x": 1,
            "y": -1
        }
    },

    {
        "name": "Beerio Kart",
        "description": "Play a full round of Mario Kart",
        "img": "",
        "rules": "Play a full round of Mario Kart",
        "hints": "This is where hints for this task may go",
        "category": "game",
        "players": {
            "min": 0,
            "max": 8,
            "even": true
        },
        "duration": "long",
        "boozy": true,
        "location": {
            "name": "Front Room",
            "static": true,
            "zone": 1,
            "x": -1,
            "y": -1
        }
    },

    {
        "name": "Spot That Shit",
        "description": "Play a game of Spot it!",
        "img": "",
        "rules": "Play a full game of Spot it and then waterfall your drinks! The winner starts the waterfall.",
        "hints": "Don't just be fast. Be faster.",
        "category": "game",
        "players": {
            "min": 0,
            "max": 8,
            "even": true
        },
        "duration": "medium",
        "boozy": true,
        "location": {
            "name": "Living Room",
            "static": true,
            "zone": 1,
            "x": 0,
            "y": 1
        }
    },

    {
        "name": "Music Master",
        "description": "We're democratizing the party music",
        "img": "",
        "rules": "Add song to queue via iPad in Kitchen.",
        "hints": "If there is no iPad in the kitchen, find Arjun, Erin, Aminah, Lenh, or Keanu to request a song.",
        "category": "task",
        "players": {
            "min": 2,
            "max": 6,
            "even": false
        },
        "duration": "short",
        "boozy": false,
        "location": {
            "name": "Kitchen",
            "static": false,
            "zone": 4,
            "x": 0,
            "y": 0
        }
    },

    {
        "name": "Hydration Gang",
        "description": "Hydrate your fellow comrades",
        "img": "",
        "rules": "Give at least four of your fellow comrades a glass of water. Take a cup from the clean zone, fill it with water and hand it out to one of your fellow comrades",
        "hints": "Carry two cups at once",
        "category": "task",
        "players": {
            "min": 1,
            "max": 3,
            "even": false
        },
        "duration": "medium",
        "boozy": false,
        "location": {
            "name": "Kitchen",
            "static": false,
            "zone": 4,
            "x": 0,
            "y": 0
        }
    },

    {
        "name": "Dish Duty",
        "description": "Yes, I'm putting you to work. Let's make this party enviornmentally sustainable.",
        "img": "",
        "rules": "Disposing of cups is NOT the way. It's 2020 and we can do better. Wash any cups in the sink and place them in the clean zone to the left of the sink so that they can be reused.",
        "hints": "Use dish soap 😂",
        "category": "task",
        "players": {
            "min": 1,
            "max": 2,
            "even": false
        },
        "duration": "medium",
        "boozy": false,
        "location": {
            "name": "Kitchen",
            "static": true,
            "zone": 4,
            "x": 0,
            "y": 0
        }
    },
    
    {
        "name": "Mixologist",
        "description": "We need your help to keep the poison stocked.",
        "img": "",
        "rules": "Grab cups from the clean zone and mix some drinks and put them in the poison zone. Mix at least 4 drinks.",
        "hints": "No shady shit. 😐",
        "category": "task",
        "players": {
            "min": 1,
            "max": 2,
            "even": false
        },
        "duration": "medium",
        "boozy": false,
        "location": {
            "name": "Kitchen",
            "static": true,
            "zone": 4,
            "x": 0,
            "y": 0
        }
    },

    {
        "name": "Garbage Collector",
        "description": "Yes, I'm putting you to work. It is what it is.",
        "img": "",
        "rules": "We need help keeping this party running smoothly so that everyone can enjoy themselves. Place any empty cups in the sink for washing, place any empty beer bottles or cans into the designated recycling bin located in the garage, and any soiled napkins in the trash",
        "hints": "Stack cups so you can transport more at a time",
        "category": "task",
        "players": {
            "min": 1,
            "max": 4,
            "even": false
        },
        "duration": "medium",
        "boozy": false,
        "location": {
            "name": "Everywhere",
            "static": false,
            "zone": 4,
            "x": 0,
            "y": 0
        }
    },

    {
        "name": "Hidden Arjun",
        "description": "Find the hidden little 'Arjun'.",
        "img": "",
        "rules": "Little 'Arjun' is hidden somewhere in the house. Find him. Once found, hide elsewhere (ONLY INSIDE THE HOUSE)",
        "hints": "He is wearing a skeleton costume",
        "category": "challenge",
        "players": {
            "min": 1,
            "max": 1,
            "even": false
        },
        "duration": "long",
        "boozy": false,
        "location": {
            "name": "Inside",
            "static": false,
            "zone": 4,
            "x": 0,
            "y": 0
        }
    },

    {
        "name": "Don't Be a Bitch",
        "description": "There is no babysitting at this party. Finish your drink",
        "img": "",
        "rules": "Use your mouth to drink and let the liquid flow down your throat.",
        "hints": "What dat mouth do 😏😂 (it drinks alcohol)",
        "category": "challenge",
        "players": {
            "min": 0,
            "max": 20,
            "even": false
        },
        "duration": "short",
        "boozy": true,
        "location": {
            "location": "Anywhere",
            "static": false,
            "zone": 4,
            "x": 0,
            "y": 0
        }
    },

    {
        "name": "Pong Bounce",
        "description": "Idk we needed moar tasks",
        "img": "",
        "rules": "Bounce a ping pong into a cup.",
        "hints": "Don't suck at this 🤷🏾‍♂️",
        "category": "challenge",
        "players": {
            "min": 0,
            "max": 20,
            "even": false
        },
        "duration": "short",
        "boozy": false,
        "location": {
            "name": "Front Room",
            "static": true,
            "zone": 1,
            "x": -1,
            "y": -1
        }
    },

    {
        "name": "Bounty Hunter",
        "description": "Who is an imposter? The world may never know...",
        "img": "",
        "rules": "Take a selfie with an imposter",
        "hints": "If you take a selfie with everyone then you're certain to complete this task. 😉",
        "category": "challenge",
        "players": {
            "min": 0,
            "max": 1,
            "even": false
        },
        "duration": "long",
        "boozy": false,
        "location": {
            "name": "Anywhere",
            "static": false,
            "zone": 4,
            "x": 0,
            "y": 0
        }
    },
    
    {
        "name": "Roast a Ghost",
        "description": "Hope you're in the mood for sweets. 🔥",
        "img": "",
        "rules": "Roast the perfect marshmallow and eat it.",
        "hints": "Pair with a grahm cracker and chocolate to make it even better.",
        "category": "challenge",
        "players": {
            "min": 0,
            "max": 6,
            "even": false
        },
        "duration": "medium",
        "boozy": false,
        "location": {
            "name": "Backyard",
            "static": true,
            "zone": 6,
            "x": -1,
            "y": 2
        }
    },
    
    {
        "name": "Pick Your Poison",
        "description": "This ain't optional. We are all degenerates tonight.",
        "img": "",
        "rules": "Choose a random cup from the poison zone table. First cup you touch, you drink. ☠️",
        "hints": "Don't be a little bitch.",
        "category": "challenge",
        "players": {
            "min": 2,
            "max": 6,
            "even": false
        },
        "duration": "short",
        "boozy": true,
        "location": {
            "name": "Kitchen",
            "static": true,
            "zone": 4,
            "x": 0,
            "y": 0
        }
    },
    
    {
        "name": "Chugging Challenge",
        "description": "Chugging contest vs Arjun. You will lose.",
        "img": "",
        "rules": "Chug Dihydrogen Monoxide vs Arjun. You do not have to win",
        "hints": "Dihydrogen Monoxide is wAtER in simple speak. Its big brain time.",
        "category": "challenge",
        "players": {
            "min": 0,
            "max": 1,
            "even": false
        },
        "duration": "short",
        "boozy": false,
        "location": {
            "name": "Kitchen",
            "static": true,
            "zone": 4,
            "x": 0,
            "y": 0
        }
    },
    
    {
        "name": "Quartz, Parchment, Shears",
        "description": "Rock, Paper, Scissors",
        "img": "",
        "rules": "Play with a random person. Best 2 out of 3. Loser drink.",
        "hints": "Its big brain time.",
        "category": "challenge",
        "players": {
            "min": 0,
            "max": 3,
            "even": false
        },
        "duration": "short",
        "boozy": false,
        "location": {
            "name": "Anywhere",
            "static": false,
            "zone": 4,
            "x": 0,
            "y": 0
        }
    }

];


export default tasks;