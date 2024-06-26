import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {UsersService} from "@/users/users.service";
import {AddUserDto} from "@/users/addUser.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  // 检测是否存在管理员账户
  @Get('admin')
  async checkAdmin(): Promise<boolean> {
    return await this.usersService.checkAdmin();
  }

  // 在public_users创建对应信息
  @Post('create')
  async createUser(@Body() addUserDto: AddUserDto) {
    return await this.usersService.createUser(
        addUserDto.name,
        addUserDto.source,
        addUserDto.user_id
    );
  }

  // 根据user_id查找，看是否为admin
  @Get('ifadmin/:user_id')
  async ifAdmin(@Param('user_id') user_id:string): Promise<boolean> {
    return await this.usersService.ifAdmin(user_id);
  }

  // 封禁用户
  @Post('ban/:id')
  async banUser(@Param('id') id:number) {
    return await this.usersService.banUser(id);
  }
}
