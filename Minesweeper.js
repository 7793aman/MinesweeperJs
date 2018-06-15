//using strict mode for highlighting silent errors
"use strict"

//Logic divided in multiple functions for rxtensibility and resusability as suggested by Rahul

//The Board will be a object with 2d array in it.
//Declaring board config.
var columns = 9, rows = 9, mines = 10;
var grid;
var mineRecord = [];
var ranNum=[];

//The cell must be an object which will have different properties.
//Using constructor pattern because multiple cells will be use.
var Cell = function (x, y) {
    this.x = x;
    this.y = y;
    this.isMine = false;
    this.isrevealed = false;
    this.neighbourMineCount = 0;
};


//This function is to return the count for the cell
//The count will be equal to number of mines surrounding the cell
Cell.prototype.countMines = function (i, j) {

    //Using cartesian type system
    //Will check for te boundary values also
    for (var a = i - 1; a <= i + 1; a++) {
        for (var b = j - 1; b <= j + 1; b++) {
            //Checking boundary conditions
            if (a < 0 || a >= rows || b < 0 || b >= columns) {
                continue;
            }
            //Filling value
            if (grid[a][b].isMine == true) {
                this.neighbourMineCount++;
            }
        }
    }
    return this.neighbourMineCount;
}



//Revealing the cells on click
Cell.prototype.reveal = function () {

    this.isrevealed = true;

    if (this.neighbourMineCount == 0) {
        this.fill(this.x, this.y);

    }

}

//continous fill and reveal
Cell.prototype.fill = function (x, y) {
    // grid[x][y].neighbourMineCount="0";
    //console.log("reveal ke" + x+" "+ y);
    for (var i = -1; i <= 1; i++) {
        //checking the boundary conditions
        if (x + i < 0 || x + i >= rows) {
            continue;
        }
        //checking the boundary conditions
        for (var j = -1; j <= 1; j++) {
            if (y + j < 0 || y + j >= columns) {
                continue;
            }
            var a = x + i;
            var b = y + j;
            if (grid[a][b].isrevealed == false) {
                //console.log("reveal ka code chala"+a+" "+ b);
                grid[a][b].reveal();
            }

        }
    }

}

//this function call when u enter the coordinates
function CellClick(i, j) {
    //testing
    grid[i][j].reveal();
}


//CreateArray function for 2d array
function createArray(rows, columns) {

    var array = new Array(rows);
    for (var i = 0; i < rows; i++) {
        array[i] = new Array(columns);
    }
    return array;

}

//function to create random numbers
//No pair of x and y would be same
//Mines must be unique suggested by Rahul
//Recursion :P
function randomNumbers(){
        var x = Math.floor(Math.random() * 10);
        if (x == 9) { x -= 1 };
        var y = Math.floor(Math.random() * 10);
        if (y == 9) { y -= 1; }

        if(ranNum.indexOf(""+x+y)>-1){
            randomNumbers();
        }

        ranNum.push(""+x+y);
        
        return [x,y];
}

//Filling the mines
function fillMines() {

    for (var count = 0; count < 10; count++) {
        
        var temp=randomNumbers();
        
        var x=temp[0];
        var y=temp[1];
    
        //Keeping record of mines
        mineRecord[count] = [x,y];

        // console.log(x+" "+y);
        grid[x][y].isMine = true;
        grid[x][y].neighbourMineCount = 'X';

    }

    //displaying the mine array 
    // for (var i = 0; i < mineRecord.length; i++) {
    //     console.log(mineRecord[i]);
    // }

}

//Filling the remaining cells of the grid
function initialCellFill() {

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {

            if (grid[i][j].isMine == false) {
                grid[i][j].neighbourMineCount = grid[i][j].countMines(i, j);
            }

        }
    }
}

function firstDisplay() {
    //Showing the filled grid first time with all values hidden:)
    console.log("----------------------------");
    for (var i = 0; i < grid.length; i++) {
        var str = " ";
        for (var j = 0; j < grid[i].length; j++) {
            // if(grid[i][j].neighbourMineCount>-1){str+=" ";}
            str += "|" + "-" + " ";

        }

        console.log(str);
        console.log("----------------------------");
    }
}

//Setting the board and filling th mines
function setup() {
    //Filling the grid with cell objects.
    grid = createArray(rows, columns);

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }
    //calling for filling the mines
    fillMines();

    //calling for filling the numbers
    initialCellFill();

    //Showing the filled grid first time with all values hidden:)
    firstDisplay();

}


//Call to cellclick with input from keyboard
function startGame() {

    var readline = require('readline-sync');
    var x = parseInt(readline.question("Enter the x coordinate : "));
    var y = parseInt(readline.question("Enter the y coordinate : "));

    //looping for the inputs
    while (grid[x][y].isMine == false) {
        console.log("chala code");

        CellClick(x, y);

        //Showing the filled grid after a click :)
        console.log("-------------------------------------");
        for (var i = 0; i < grid.length; i++) {

            var str = "";

            for (var j = 0; j < grid[i].length; j++) {

                if (grid[i][j].isrevealed == true) {

                    str += " " + grid[i][j].neighbourMineCount + " " + "|";
                }
                else {
                    str += " -" + " " + "|";
                }

            }

            console.log(str);
            console.log("-------------------------------------");
        }

        var x = readline.question("Enter the x coordinate : ");
        var y = readline.question("Enter the y coordinate : ");

        if (grid[x][y].isMine == true) {
            gameOver();
        }
    }

}

function gameOver() {
    //Game ends here
    //this code will be called when u will call on mines
    console.log("--------Oops! you stepped on mine----------------");
    console.log("----------------Game Over----------------");
    console.log("-------------------------------------");
    for (var i = 0; i < grid.length; i++) {

        var str = "";

        for (var j = 0; j < grid[i].length; j++) {

            str += " " + grid[i][j].neighbourMineCount + " " + "|";

        }

        console.log(str);
        console.log("-------------------------------------");
    }
}

//calling for setting anf starting the game
setup();
startGame();