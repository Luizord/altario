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
        // Get 20% of the total cells
        const weightedCells = weightedChar ? Math.floor(totalCells * 0.2) : 0; 
        const weightedCharPositions = new Set<number>();

        if (weightedChar) {
            while (weightedCharPositions.size < weightedCells) {
                //Create a Set used to randomly choose unique positions for placing the weightedChar. This ensures there are no duplicates, and 20% of the cells are filled with it.
                weightedCharPositions.add(Math.floor(Math.random() * totalCells)); 
            }
        }

        let cellIndex = 0;
        for (let i = 0; i < rows; i++) {
            const row: string[] = [];
            for (let j = 0; j < columns; j++) {
                if (weightedChar && weightedCharPositions.has(cellIndex)) {
                    // Place the weighted character if it mactches the index of the set
                    row.push(weightedChar.toUpperCase()); 
                } else {
                    row.push(this.generateRandomAlphabet());
                }
                cellIndex++;
            }
            grid.push(row);
        }
        return grid;

    }

    public getGridCode(grid: string[][]): string {
        const date = new Date();
        // Get the two-digit seconds
        const seconds = date.getSeconds();
        // Pad with 0 if necessary
        const secondsStr = seconds.toString().padStart(2, '0');
        // Extract the digits
        const row1 = parseInt(secondsStr[0]);
        const col1 = parseInt(secondsStr[1]);

        // Fetch the characters
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
            count = Math.floor(count / 2); // Divide by the lowest integer until the result <= 9
        }
        return count;
    }

    // Alternate solution to adjust the code number to be <=9
    private alternateAdjustCount(count: number): number {
        for (let i = 2; i <= count; i++) {
            if (Math.floor(count / i) < 9) {
                return Math.floor(count / i)
            }
        }
        return Math.floor(count / count);
    }
}
