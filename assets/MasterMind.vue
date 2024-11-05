<template>
    <div id="game">
        <div id="gameboard">
            <div class="row" v-for="i in 10">
                <div class="response">
                    <div v-for="r in 4" ref="response"></div>
                </div>
                <div class="peg" v-for="n in 4" @click="(e) => changeColor(e, i, n)"></div>
            </div>
        </div>
        <div>
            <div id="colors">
                <div v-for="c of colors" class="color" :class="c" @click="pickUp(c)"></div>
            </div>
            <h1 v-if="game == 3" style="color: green;">WIN</h1>
            <div v-if="game == 2" style="display: flex; gap: 2px;">
                <h1 style="color: red;">LOSE</h1>
                <div v-for="r of cColor" :style="{backgroundColor: r, width: '20px', height: '20px'}"></div>
            </div>
            <button v-if="game == 1" type="button" v-on:click="checkAnswer()">Check Answer</button>
            <button type="button" v-on:click="genCode()">New Game</button>
        </div>
    </div>

</template>

<script>

export default {
    name: 'master-mind',
    data() {
        return {
            //Varibles
            guess: 0,
            random: 0,
            selectColor: "grey",
            game: 0,
            colors: ['red', 'blue', 'green', 'orange', 'purple', 'yellow'],
            // player guess input
            gColor: ['', '', '', ''],
            //computer generated code
            cColor: []
        }
    },
    methods: {
        //takes input from player, gives results, resets players guess
        checkAnswer() {
            if (this.gColor.every((val) => val != "grey" && val != "")) {
                let black = 0;
                let white = 0;
                const sColor = [...this.cColor]
                //checks for pegs with same color and correct position, clears both input and code colors
                for (let i = 0; i < 4; i++) {
                    if (this.gColor[i] === this.cColor[i]) {
                        black++;
                        this.gColor[i] = "grey";
                        this.cColor[i] = "";
                    }
                }

                //checks for matching colors, clears any code matches
                for (let j = 0; j < 4; j++) {
                    if (this.gColor[j] != "grey") {
                        if (this.cColor[0] === this.gColor[j] && this.cColor[0] != "") {
                            white++;
                            this.cColor[0] = "";
                        }
                        else if (this.cColor[1] === this.gColor[j] && this.cColor[1] != "") {
                            white++;
                            this.cColor[1] = "";
                        }
                        else if (this.cColor[2] === this.gColor[j] && this.cColor[2] != "") {
                            white++;
                            this.cColor[2] = "";
                        }
                        else if (this.cColor[3] === this.gColor[j] && this.cColor[3] != "") {
                            white++;
                            this.cColor[3] = "";
                        }
                    }

                    this.gColor[j] = "grey";
                }

                // resets the computer code for next check
                this.cColor = [...sColor]

                //checks for win or lose condition
                //10 guesses and less than 4 black pegs is a loss
                if (black != 4 && this.guess == 9) {
                    this.game = 2;
                    this.showCode();
                }
                //4 black pegs means correct guess and results in a win
                else if (black == 4) {
                    this.game = 3;
                    this.showCode();
                }
                for (let n = 0; n < 4; n++) {
                    if (black) {
                        this.$refs.response[(this.guess * 4) + n].style.backgroundColor = "black"
                        black--
                    }
                    else if (white) {
                        this.$refs.response[(this.guess * 4) + n].style.backgroundColor = "white"
                        white--
                    }
                }

                this.guess = this.guess + 1;
            }
        },
        //shows the code generated
        showCode() {
            for (let j = 0; j < 4; j++) {
                this.gColor[j] = this.cColor[j];
            }
        },
        // selects color that is clicked on
        pickUp(color) {
            this.selectColor = color;
        },
        // changes the color of input code
        changeColor(e, rowIdx, idx) {
            if ((rowIdx - 1) == this.guess && this.game == 1) {
                e.target.style.backgroundColor = this.selectColor
                this.gColor[idx - 1] = this.selectColor;
                this.selectColor = "grey";
            }
        },
        // generates code when a new game is started
        genCode() {
            this.cColor = []
            for (let i = 0; i < 4; i++) {
                this.random = Math.random() * 100;
                if (this.random <= 50 / 3) {
                    this.cColor.push("red");
                }
                else if (this.random <= 100 / 3) {
                    this.cColor.push("blue");
                }
                else if (this.random <= 50) {
                    this.cColor.push("green");
                }
                else if (this.random <= 200 / 3) {
                    this.cColor.push("orange");
                }
                else if (this.random <= 250 / 3) {
                    this.cColor.push("purple");
                }
                else {
                    this.cColor.push("yellow");
                }
            }
            this.guess = 0;
            this.selectColor = "grey";

            document.querySelectorAll('.peg, .response > div').forEach((el) => {
                el.style.backgroundColor = 'grey'
            })

            this.gColor = ['', '', '', ''];
            this.game = 1;

        }

    }
}

</script>




<style scoped>
#game {
    display: flex;
    align-items: center;
}

#gameboard {
    width: 300px;
    height: 800px;
    display: grid;
    grid-template-columns: 1fr;
    background-color: grey;
    z-index: 0;
}

.row {
    display: flex;
}

.peg {
    width: 60px;
    height: 60px;
    border: 2px solid black;
    background-color: grey;
    border-radius: 50%;
}

.response {
    width: 60px;
    height: 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;

    >div {
        width: 20px;
        height: 20px;
        border: 2px solid black;
        background-color: grey;
        border-radius: 50%;
    }

}

#colors {
    display: flex;
    flex-direction: column;
    margin-bottom: 5px;
}

.color {
    width: 60px;
    height: 60px;

    &.red {
        background-color: red;
    }

    &.blue {
        background-color: blue;
    }

    &.green {
        background-color: green;
    }

    &.orange {
        background-color: orange;
    }

    &.purple {
        background-color: purple;
    }

    &.yellow {
        background-color: yellow;
    }
}

h1 {
    position: absolute;
    bottom: 90px;
    left: 410px;
    width: 10px;
    height: 10px;
    z-index: 4;
}
</style>