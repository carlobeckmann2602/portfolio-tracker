import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockService } from 'src/stock/stock.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly stockService: StockService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 200, description: 'Returns userdata of the created user' })
  @ApiResponse({ status: 400, description: 'The given userdata has a wrong format. No user was created' })
  @ApiResponse({ status: 403, description: 'Credentials already taken' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get userdata of a specific user' })
  @ApiResponse({ status: 200, description: 'Returns the userdata for the user with the given uid' })
  @ApiResponse({ status: 404, description: 'There was no user with the given uid. No data is returned' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the userdata of a specific user' })
  @ApiResponse({ status: 200, description: 'Returns the (updated) userdata' })
  @ApiResponse({ status: 404, description: 'There was no user with the given uid. No data is returned' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the user with the given uid' })
  @ApiResponse({ status: 400, description: 'There was no user with the given uid. No user is deleted' })
  @ApiResponse({ status: 200 })
  removeUser(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  //CRUD Stocks
  @Delete(':id/stocks/:sid')
  @ApiOperation({ summary: "Delete the stock with the given sid from the users' portfolio" })
  @ApiResponse({
    status: 404,
    description: "There was no stock with the given sid in the users' portfolio. The portfolio remains unchanged",
  })
  @ApiResponse({ status: 200 })
  removeStockFromUser(@Param('id') id: string, @Param('sid') sid: string) {
    return this.stockService.removeStockFromUser(+id, +sid);
  }

  @Post(':id/stocks/:sid')
  @ApiOperation({ summary: "Add a stock with the given sid to the users' portfolio" })
  @ApiResponse({ status: 200, description: 'Returns the updated portfolio' })
  @ApiResponse({ status: 404, description: 'There was no stock with the given sid. The portfolio remains unchanged' })
  addStockToUser(@Param('id') id: string, @Param('sid') sid: string) {
    return this.stockService.addStockToUser(+id, +sid);
  }

  @Get(':id/stocks')
  @ApiOperation({ summary: "Returns all stocks in the users' portfolio" })
  @ApiResponse({ status: 200, description: "Returns a json-objekt containing all stocks of the users' portfolio" })
  @ApiResponse({ status: 400, description: "There was a fatal error fetching the users' portfolio" })
  getStocksFromUser() {
    return this.stockService.findAll();
  }
}
