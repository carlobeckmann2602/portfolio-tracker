import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockService } from 'src/stock/stock.service';
import { StockOnUserDto } from './dto/stock-on-user.dto.';

@ApiTags('users')
@Controller('users')
export class UserController {
  mockUser = {
    id: 1,
    createdAt: '2022-11-10T13:25:43.741Z',
    updatedAt: '2022-11-10T13:30:38.939Z',
    email: 'mustermann@web.de',
    firstName: 'Max',
    lastName: 'Mustermann',
  };

  mockStocksOnUser = {
    stocks: [
      {
        stock: {
          id: 2,
          symbol: 'CON',
          name: 'Continental',
          open: '3.1',
          close: '3.5',
          high: '11.0',
          low: '9.0',
          description: 'Automobilzulieferer',
          time: '2022-01-01T00:00:00.000Z',
        },
        amount: 11,
      },
      {
        stock: {
          id: 1,
          symbol: 'ADS',
          name: 'Adidas',
          open: '12.0',
          close: '22.1',
          high: '20.2',
          low: '10.1',
          description: 'Sportartikel',
          time: '2022-10-11T14:37:10.000Z',
        },
        amount: 100,
      },
    ],
  };
  mockMode = true;
  constructor(private readonly userService: UserService, private readonly stockService: StockService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 200, description: 'Returns userdata of the created user' })
  @ApiResponse({ status: 400, description: 'The given userdata has a wrong format. No user was created' })
  @ApiResponse({ status: 403, description: 'Credentials already taken' })
  create(@Body() createUserDto: CreateUserDto) {
    if (this.mockMode) {
      return this.mockUser;
    }
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get userdata of a specific user' })
  @ApiResponse({ status: 200, description: 'Returns the userdata for the user with the given uid' })
  @ApiResponse({ status: 404, description: 'There was no user with the given uid. No data is returned' })
  findOne(@Param('id') id: number) {
    if (this.mockMode) {
      return this.mockUser;
    }
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the userdata of a specific user' })
  @ApiResponse({ status: 200, description: 'Returns the (updated) userdata' })
  @ApiResponse({ status: 404, description: 'There was no user with the given uid. No data is returned' })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    if (this.mockMode) {
      return this.mockUser;
    }
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the user with the given uid' })
  @ApiResponse({ status: 404, description: 'There was no user with the given uid. No user is deleted' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  removeUser(@Param('id') id: number) {
    if (this.mockMode) {
      return 'This action removed a user with ID:1';
    }
    return this.userService.remove(+id);
  }

  @Get(':id/stocks')
  @ApiOperation({ summary: "Returns all stocks in the users' portfolio" })
  @ApiResponse({ status: 200, description: "Returns a json-objekt containing all stocks of the users' portfolio" })
  @ApiResponse({ status: 400, description: "There was a fatal error fetching the users' portfolio" })
  getStocksFromUser(@Param('id') id: number) {
    if (this.mockMode) {
      return this.mockStocksOnUser;
    }
    return this.userService.findStocksOnUser(+id);
  }

  //CRUD Stocks
  @Delete(':id/stocks/:sid')
  @ApiOperation({ summary: "Delete the stock with the given sid and amount from the users' portfolio" })
  @ApiResponse({ status: 404, description: 'There was no stock with the given sid. The portfolio remains unchanged' })
  @ApiResponse({ status: 200, description: 'Return success message' })
  removeStockFromUser(@Param('id') id: number, @Param('sid') sid: number, @Body() StockOnUserDto: StockOnUserDto) {
    if (this.mockMode) {
      return `This action updates a user with id #${id} with the transmitted stock data`;
    }
    return this.stockService.removeStockFromUser(+id, +sid, StockOnUserDto);
  }

  @Post(':id/stocks/:sid')
  @ApiOperation({ summary: "Add a stock with the given sid and amount to the users' portfolio" })
  @ApiResponse({ status: 404, description: 'There was no stock with the given sid. The portfolio remains unchanged' })
  @ApiResponse({ status: 201, description: 'Return success message' })
  addStockToUser(@Param('id') id: number, @Param('sid') sid: number, @Body() StockOnUserDto: StockOnUserDto) {
    if (this.mockMode) {
      return `This action updates a user with id #${id} with the transmitted stock data`;
    }
    return this.stockService.addStockToUser(+id, +sid, StockOnUserDto);
  }
}
