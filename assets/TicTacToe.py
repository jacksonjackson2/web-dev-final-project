# Dev Name: Jackson Kroes
# Date: Oct 17, 2024
# Project Name: Tic Tac Toe
# Project Desc: Game
#
# Python Ver: 3.12

import re

class Grid:
    def __init__(self):
        self.squares = {
            "A": ['','',''],
            "B": ['','',''],
            "C": ['','','']
        }

    def add_square(self, square,turn):
        letter = square[0]
        number = int(square[1]) - 1
        self.squares[letter][number] = turn

    def get_squares(self):
        squares_format = []
        for letters, numbers in self.squares.items():
            raw = []
            for i in numbers:
                if i == "":
                    raw.append('   ')
                else:
                    raw.append(f' {i} ')
            squares_format.append(' | '.join(raw))
        return squares_format

def main():
    game_grid = Grid()
    current_player = 'o'
    while not has_won(game_grid,current_player):
        current_player = 'x' if current_player == 'o' else 'o'
        game_grid.add_square(square_input(game_grid,current_player),current_player)

def has_won(game_grid,current_player):
    cols = [[],[],[]]
    for row in game_grid.squares.values():
        cols[0].append(row[0])
        cols[1].append(row[1])
        cols[2].append(row[2])
        if row.count(current_player) == 3:
            return True
    for col in cols:
        if col.count(current_player) == 3:
            return True
    if cols[1][1] == current_player:
        if (cols[0][0] == current_player and cols[2][2] == current_player) or (cols[0][2] == current_player and cols[2][0] == current_player):
            return True

def square_input(game_grid,current_player):
    square_format = game_grid.get_squares()
    while True:
        print(f"{square_format[0]}\n"
              "--- + --- + ---\n"
              f"{square_format[1]}\n"
              "--- + --- + ---\n"
              f"{square_format[2]}")
        square = input(f"Enter Square {current_player.upper()}: ").upper()
        if re.search(r'^[ABC][123]$', square):
            if game_grid.squares[square[0]][int(square[1]) - 1] == '':
                return square
            else:
                print(f"Square {square} has already been taken")
        else:
            print("Square input must be a letter and number, ex: A1")
main()