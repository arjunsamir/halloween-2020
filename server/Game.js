const uniqid = require('uniqid');

const shuffleArray = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

module.exports = class Game {

    constructor(options) {
        
        this.players = options.players || [];
        this.imposterRatio = options.imposterRatio;
        this.duration = options.duration;
        this.numOftasks = options.tasksAverage;
        this.prefersShortTasks = options.prefersShortTasks;
        this.emergencyMeetings = options.emergencyMeetings;
        this.tasks = options.tasks;
        this.room = options.room;
        this.id = options.id;

        this.imposters = [];
        this.comrades = [];

        this.tasks = [];

    }


    init() {

        this.assignImposters();

        this.assignTasks();

        console.log(this);

    }


    assignImposters() {

        // Define All Players
        let players = Array.from(this.players);


        // Calculate Number of Imposters
        let n = Math.round(this.players.length * this.imposterRatio);
        if (n < 1) n = 1;


        // Assign Imposters
        this.imposters = shuffleArray(this.players).slice(0, n);

        
        // Filter Out Imposters From Players
        this.imposters.map(i => i.id).forEach(id => {

            players = players.filter(player => player.id !== id)

        });


        // Assign Comrades
        this.comrades = players;

    }


    assignTasks() {

        // Define Quantity Object
        let qty = {
            long: this.comrades.length,
            medium: this.comrades.length,
            short: this.comrades.length,
            total: this.comrades.length * this.numOftasks,
            assigned: {
                all: 0,
                long: 0,
                medium: 0,
                short: 0
            }
        };


        // Define Task Object For Sorting
        const tasks = {
            short: {},
            medium: {},
            long: {}
        }


        // Orgainize Tasks after shuffling them
        shuffleArray(this.tasks).forEach(task => {

            const cat = tasks[task.duration];
            const assigned = 0;
            const min = task.players.min;
            const reqOp = min ? 'required' : 'optional';
            let max = task.players.max;


            // Detect Nullish
            cat[reqOp] = cat[reqOp] || [];
            cat.stats = cat.stats || { min: 0, max: 0 };


            // Update Max Length
            if (task.players.max > this.comrades.length) max = this.comrades.length;
        

            // Update Stats
            task.players.max = max;
            cat.stats.min += min;
            cat.stats.max += max;


            // Push Item To Correct Array
            cat[reqOp].push({ assigned, min, max, task });
            

        });


        // Calculate Number of each type of task to include
        for (let i = qty.long + qty.medium + qty.short; i < qty.total; i++) {

            const l = ['long', 'medium', 'short'];
            let j = i % 3;
            let t = this.prefersShortTasks ? l[!j ? j + 1 : j] : l[j];

            const nextCat = () => {
                if (j < 2) j++;
                else j = 0;
                t = l[j];
            }

            const increment = () => {
                if (qty[t] < tasks[t].stats.max) return qty[t]++;
                nextCat();
                increment();
            }

            increment();


        }


        const distributeTasks = type => {

            let j;
            let i = 0;
            let assigned = 0;
            let maxFill = true;

            const r = 'required';
            const o = 'optional';

            let reqOp = r, minMax = 'min';

            while (assigned < qty[type]) {
                tasks[type].all = tasks[type].all || [];

                const cur = tasks[type][reqOp][i];

                if (!cur) {
                    i = 0;
                    if (reqOp == r) reqOp = o;
                    else reqOp = r;
                    maxFill = false;

                    continue;
                }

                if (maxFill) {

                    j = cur[minMax] || 0;
                    if (qty[type] < assigned + cur[minMax]) j = qty[type] - assigned;

                }

                else j = 1;

                if (cur.assigned + j > cur.max) {
                    i++;
                    continue;
                }

                const ary = new Array(j).fill(tasks[type][reqOp][i].task);

                tasks[type].all.push(...ary);

                cur.assigned +=j;

                i++;
                assigned+=j;
            }

            tasks[type].all.sort((a, b) => a.name.localeCompare(b.name));


        }


        const assignTasks = () => {

            let j = -1;

            [...tasks.long.all, ...tasks.medium.all, ...tasks.short.all].forEach((task, i) => {

                j ++;

                if (j > this.comrades.length - 1) j = 0;

                this.comrades[j].tasks.push(task);

            });

        }


        // Distribute Tasks
        distributeTasks('long');
        distributeTasks('medium');
        distributeTasks('short');


        // Assign Tasks
        assignTasks();
    }


    taskComplete() {

    }

    startMeeting(emergency) {

    }


}