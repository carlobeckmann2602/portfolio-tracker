import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/auth/guard';
import { PortFolioService } from 'src/stock/portfolio.service';
import { StockService } from 'src/stock/stock.service';
import { CreateUserDto } from './dto/create-user.dto';
import { StockOnUserDto } from './dto/stock-on-user.dto.';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  mockUser = {
    id: 1,
    createdAt: '2022-11-10T13:25:43.741Z',
    updatedAt: '2022-11-10T13:30:38.939Z',
    email: 'mustermann@web.de',
  };

  mockUserEdited = {
    id: 1,
    createdAt: '2022-11-10T13:25:43.741Z',
    updatedAt: '2022-11-11T11:11:38.939Z',
    email: 'musterfrau@web.de',
  };

  mockStocksOnUser = {
    stocks: [
      {
        stock: {
          id: 0,
          symbol: 'ADS',
          name: 'Adidas',
          open: '137.5000',
          close: '175.4600',
          high: '184.2000',
          low: '132.1000',
          trend: '-0.42',
          description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
          time: '2022-10-11T14:37:10.000Z',
        },
        amount: 84,
      },
      {
        stock: {
          id: 1,
          symbol: 'CON',
          name: 'Continental',
          open: '54.5000',
          close: '83.9000',
          high: '156.2000',
          low: '54.5000',
          trend: '+1.98',
          description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
          time: '2022-01-01T00:00:00.000Z',
        },
        amount: 113,
      },
      {
        stock: {
          id: 2,
          symbol: 'EXA',
          name: 'Example',
          open: '135.6000',
          close: '147.9000',
          high: '173.2000',
          low: '120.5000',
          trend: '+3.65',
          description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
          time: '2022-01-01T00:00:00.000Z',
        },
        amount: 49,
      },
      {
        stock: {
          id: 3,
          symbol: 'DPD',
          name: 'DPD',
          open: '235.5000',
          close: '211.9000',
          high: '240.2000',
          low: '180.5000',
          trend: '-4.76',
          description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
          time: '2022-01-01T00:00:00.000Z',
        },
        amount: 13,
      },
      {
        stock: {
          id: 4,
          symbol: 'AAPL',
          name: 'Apple',
          open: '566.5000',
          close: '600.9000',
          high: '612.2000',
          low: '566.5000',
          trend: '+0.89',
          description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
          time: '2022-01-01T00:00:00.000Z',
        },
        amount: 2,
      },
      {
        stock: {
          id: 5,
          symbol: 'TEL',
          name: 'Telekom',
          open: '28.5600',
          close: '34.9000',
          high: '55.2000',
          low: '25.5000',
          trend: '-5.20',
          description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
          time: '2022-01-01T00:00:00.000Z',
        },
        amount: 4,
      },
      {
        stock: {
          id: 6,
          symbol: 'BASF',
          name: 'BASF',
          open: '175.5600',
          close: '176.9000',
          high: '178.2000',
          low: '170.5000',
          trend: '-0.89',
          description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
          time: '2022-01-01T00:00:00.000Z',
        },
        amount: 6,
      },
      {
        stock: {
          id: 7,
          symbol: 'LH',
          name: 'Lufthansa',
          open: '270.5600',
          close: '279.9000',
          high: '285.2000',
          low: '234.5000',
          trend: '+0.00',
          description:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
          time: '2022-01-01T00:00:00.000Z',
        },
        amount: 87,
      },
    ],
  };
  mockMode = false;
  constructor(
    private readonly userService: UserService,
    private readonly stockService: StockService,
    private readonly authService: AuthService,
    private readonly portfolioService: PortFolioService
  ) { }



  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'Returns JWT' })
  @ApiResponse({ status: 400, description: 'The given userdata has a wrong format. No user was created' })
  @ApiResponse({ status: 403, description: 'Credentials already taken' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtGuard) //Set custom guard. This route is protected
  @Get('me')
  @ApiOperation({ summary: 'Get userdata of a specific user' })
  @ApiResponse({ status: 200, description: 'Returns the userdata' })
  @ApiResponse({ status: 404, description: 'There was no user with the given uid. No data is returned' })
  @ApiBearerAuth('JWT-auth')
  findOne(@Req() req: Request) {
    //validate user ID and path Id
    return this.userService.findOne(req.user['userId']);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Update the userdata of a specific user' })
  @ApiResponse({ status: 200, description: 'Returns the (updated) userdata' })
  @ApiResponse({ status: 404, description: 'There was no user with the given uid. No data is returned' })
  @ApiBearerAuth('JWT-auth')
  update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.userService.update(req.user['userId'], updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete('me')
  @ApiOperation({ summary: 'Deletes the currently logged in user' })
  @ApiResponse({ status: 404, description: 'There was no user with the given uid. No user is deleted' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiBearerAuth('JWT-auth')
  removeUser(@Req() req: Request, @Headers() headers) {
    this.authService.logout(headers);
    return this.userService.remove(req.user['userId']);
  }

  @UseGuards(JwtGuard)
  @Get('me/stocks')
  @ApiOperation({ summary: "Returns all stocks in the users' portfolio" })
  @ApiResponse({ status: 200, description: "Returns a json-objekt containing all stocks of the users' portfolio" })
  @ApiResponse({ status: 400, description: "There was a fatal error fetching the users' portfolio" })
  @ApiBearerAuth('JWT-auth')
  getStocksFromUser(@Req() req: Request) {
    if (this.mockMode) {
      return this.mockStocksOnUser;
    }
    return this.portfolioService.getPortfolioData(req.user['userId']);
  }

  //CRUD Stocks
  @UseGuards(JwtGuard)
  @Delete('me/stocks/:sid')
  @ApiOperation({ summary: "Delete the stock with the given sid and amount from the users' portfolio" })
  @ApiResponse({ status: 404, description: 'There was no stock with the given sid. The portfolio remains unchanged' })
  @ApiResponse({ status: 200, description: 'Return success message' })
  @ApiBearerAuth('JWT-auth')
  removeStockFromUser(@Param('sid') sid: number, @Body() stockOnUserDto: StockOnUserDto, @Req() req: Request) {
    if (this.mockMode) {
      return `This action updates a user with id #${req.user['userId']} with the transmitted stock data`;
    }
    return this.stockService.removeStockFromUser(req.user['userId'], +sid, stockOnUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('me/stocks/:sid')
  @ApiOperation({ summary: "Add a stock with the given sid and amount to the users' portfolio" })
  @ApiResponse({ status: 404, description: 'There was no stock with the given sid. The portfolio remains unchanged' })
  @ApiResponse({ status: 201, description: 'Return success message' })
  @ApiBearerAuth('JWT-auth')
  addStockToUser(@Param('sid') sid: number, @Body() stockOnUserDto: StockOnUserDto, @Req() req: Request) {
    if (this.mockMode) {
      return `This action updates a user with id #${req.user['userId']} with the transmitted stock data`;
    }
    return this.stockService.addStockToUser(req.user['userId'], +sid, stockOnUserDto);
  }
}
