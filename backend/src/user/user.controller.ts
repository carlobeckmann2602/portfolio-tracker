import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/auth/guard';
import { PortfolioService } from 'src/stock/portfolio.service';
import { TransactionService } from 'src/stock/transaction.service';
import { CreateUserDto } from './dto/create-user.dto';
import { StockOnUserDto } from './dto/stock-on-user.dto.';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly transactionService: TransactionService,
    private readonly portfolioService: PortfolioService,
  ) {}

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
    return this.transactionService.addTransaction(
      req.user['userId'],
      +sid,
      stockOnUserDto.amount,
      false,
      stockOnUserDto.pricePerUnit,
      stockOnUserDto.date,
    );
  }

  @UseGuards(JwtGuard)
  @Post('me/stocks/:sid')
  @ApiOperation({ summary: "Add a stock with the given sid and amount to the users' portfolio" })
  @ApiResponse({ status: 404, description: 'There was no stock with the given sid. The portfolio remains unchanged' })
  @ApiResponse({ status: 201, description: 'Return success message' })
  @ApiBearerAuth('JWT-auth')
  async addStockToUser(@Param('sid') sid: number, @Body() stockOnUserDto: StockOnUserDto, @Req() req: Request) {
    try {
      return await this.transactionService.addTransaction(
        req.user['userId'],
        +sid,
        stockOnUserDto.amount,
        true,
        stockOnUserDto.pricePerUnit,
        stockOnUserDto.date,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
