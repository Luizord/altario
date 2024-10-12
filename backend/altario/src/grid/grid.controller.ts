import { Body, Controller, Post } from '@nestjs/common';
import { GridService } from './grid.service';

@Controller('grid')
export class GridController {

    constructor(private readonly gridService: GridService) {}

    @Post()
    generateGrid(@Body() body?: any) {
        const grid = this.gridService.generateGrid(10, 10, body?.weightedChar)
        return { grid: grid, code: this.gridService.getGridCode(grid) };
    }
}
