import {Controller, Delete, Get, Post, Put} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Post()
    createUser() : any {
        this.userService.createUser()
    }

    @Get(':id')
    getData() : any {
        return null
    }

    @Delete(':id')
    deleteUser() : any {
        return null
    }

    @Put(':id') 
    updateUser() : any {
        return null
    }
}