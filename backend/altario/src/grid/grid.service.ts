import { Injectable } from '@nestjs/common';

@Injectable()
export class GridService {

    public generateGrid(rows: number = 10, columns: number = 10, weightedChar?: string): string[][] {
        const grid: string[][] = [];


        //validate weighted input, if invalid just ignore
        if (!/^[a-zA-Z]$/.test(weightedChar)) {
            weightedChar = undefined;
        }

        const totalCells = rows * columns;
        const weightedCells = weightedChar ? Math.floor(totalCells * 0.2) : 0; // 20% of the total cells
        const weightedCharPositions = new Set<number>();

        if (weightedChar) {
            while (weightedCharPositions.size < weightedCells) {
                weightedCharPositions.add(Math.floor(Math.random() * totalCells)); //Create a Set used to randomly choose unique positions for placing the weightedChar. This ensures there are no duplicates, and 20% of the cells are filled with it.
            }
        }

        let cellIndex = 0;
        for (let i = 0; i < rows; i++) {
            const row: string[] = [];
            for (let j = 0; j < columns; j++) {
                if (weightedChar && weightedCharPositions.has(cellIndex)) {
                    row.push(weightedChar.toUpperCase()); // Place the weighted character if it mactches the index of the set
                } else {
                    row.push(this.generateRandomAlphabet()); // Place a random character instead
                }
                cellIndex++;
            }
            grid.push(row);
        }
        return grid;

    }

    public getGridCode(grid: string[][]): string {
        const date = new Date();
        const seconds = date.getSeconds(); // Get the two-digit seconds
        const secondsStr = seconds.toString().padStart(2, '0'); // Pad with 0 if necessary
        // Extract the digits
        const row1 = parseInt(secondsStr[0]);
        const col1 = parseInt(secondsStr[1]);

        // Fetch the characters at positions [row1, col1] and [col1, row1]
        const char1 = grid[row1][col1];
        const char2 = grid[col1][row1];

        // Count occurrences of both characters in the grid
        let countChar1 = this.countOccurrences(grid, char1);
        let countChar2 = this.countOccurrences(grid, char2);

        // Check if the code needs adjusting
        if (countChar1 > 9) {
            countChar1 = this.adjustCount(countChar1);
        }
        if (countChar2 > 9) {
            countChar2 = this.adjustCount(countChar2);
        }

        return `${countChar1}${countChar2}`;
    }

    private generateRandomAlphabet(): string {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    private countOccurrences(grid: string[][], char: string): number {
        let count = 0;
        for (let row of grid) {
            for (let cell of row) {
                if (cell === char) {
                    count++;
                }
            }
        }
        return count;
    }

    private adjustCount(count: number): number {
        while (count > 9) {
            count = Math.floor(count / 2); // Divide by the lowest integer possible until it's <= 9
        }
        return count;
    }

    // Alternate solution to adjust the code number
    private alternateAdjustCount(count: number): number {
        for (let i = 2; i <= count; i++) {
            if (Math.floor(count / i) < 9) {
                return Math.floor(count / i)
            }
        }
        return Math.floor(count / count);
    }
}
