import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StocksService } from 'src/stocks/stocks.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly stockService: StocksService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 200, description: 'Returns the unique user-ID (uid) of the created user' })
  @ApiResponse({ status: 400, description: 'The given userdata has a wrong format. No user was created' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get userdata of a specific user' })
  @ApiResponse({ status: 200, description: 'Returns the userdata for the user with the given uid' })
  @ApiResponse({ status: 400, description: 'There was no user with the given uid. No data is returned' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the userdata of a specific user' })
  @ApiResponse({ status: 200, description: 'Returns the (updated) userdata' })
  @ApiResponse({ status: 400, description: 'There was no user with the given uid. No data is returned' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the user with the given uid' })
  @ApiResponse({ status: 400, description: 'There was no user with the given uid. No user is deleted' })
  @ApiResponse({ status: 200 })
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  //CRUD Stocks
  @Delete('/stocks/:id')
  @ApiOperation({ summary: 'Delete the stock with the given sid from the users\' portfolio' })
  @ApiResponse({ status: 400, description: 'There was no stock with the given sid in the users\' portfolio. The portfolio remains unchanged' })
  @ApiResponse({ status: 200 })
  removeStock(@Param('id') id: string) {
    return this.stockService.remove(+id);
  }

  @Post('stocks/:id')
  @ApiOperation({ summary: 'Add a stock with the given sid to the users\' portfolio' })
  @ApiResponse({ status: 200, description: 'Returns the updated portfolio' })
  @ApiResponse({ status: 400, description: 'There was no stock with the given sid. The portfolio remains unchanged' })
  createStock(@Param('id') id: string) {
    return this.stockService.create(+id);
  }

  @Get('/stocks')
  @ApiOperation({ summary: 'Returns all stocks in the users\' portfolio' })
  @ApiResponse({ status: 200, description: 'Returns a json-objekt containing all stocks of the users\' portfolio' })
  @ApiResponse({ status: 400, description: 'There was a fatal error fetching the users\' portfolio' })
  getStocksFromUser() {
    return this.stockService.findAll();
  }
}
