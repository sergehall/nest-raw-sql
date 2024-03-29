import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Ip,
  Query,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CheckAbilities } from '../../../ability/abilities.decorator';
import { BaseAuthGuard } from '../../auth/guards/base-auth.guard';
import { AbilitiesGuard } from '../../../ability/abilities.guard';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UsersService } from '../../users/application/users.service';
import { Action } from '../../../ability/roles/action.enum';
import { CommandBus } from '@nestjs/cqrs';
import { ChangeRoleCommand } from '../application/use-cases/sa-change-role.use-case';
import { CreateUserCommand } from '../../users/application/use-cases/create-user.use-case';
import { IdParams } from '../../../common/query/params/id.params';
import { SaBanUserDto } from '../dto/sa-ban-user..dto';
import { SaBanBlogDto } from '../dto/sa-ban-blog.dto';
import { CurrentUserDto } from '../../users/dto/currentUser.dto';
import { IdUserIdParams } from '../../../common/query/params/id-userId.params';
import { SaRemoveUserByUserIdCommand } from '../application/use-cases/sa-remove-user-by-user-id.use-case';
import { TablesUsersWithIdEntity } from '../../users/entities/tables-user-with-id.entity';
import { ParseQueriesService } from '../../../common/query/parse-queries.service';
import { SkipThrottle } from '@nestjs/throttler';
import { ReturnUsersBanInfoEntity } from '../entities/return-users-banInfo.entity';
import { SaBanUnbanBlogCommand } from '../application/use-cases/sa-ban-unban-blog-for-user.use-case';
import { SaBanUnbanUserCommand } from '../application/use-cases/sa-ban-unban-user.use-case';
import { SaBindBlogWithUserCommand } from '../application/use-cases/sa-bind-blog-with-user.use-case';
import { PaginatedResultDto } from '../../../common/pagination/dto/paginated-result.dto';
import { SearchBlogsForSaCommand } from '../application/use-cases/search-blogs-for-sa.use-case';

@SkipThrottle()
@Controller('sa')
export class SaController {
  constructor(
    private parseQueriesService: ParseQueriesService,
    private usersService: UsersService,
    private commandBus: CommandBus,
  ) {}

  @Get('users')
  @UseGuards(BaseAuthGuard)
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.READ, subject: CurrentUserDto })
  async saFindUsers(@Query() query: any): Promise<PaginatedResultDto> {
    const queryData = await this.parseQueriesService.getQueriesData(query);

    return this.usersService.saFindUsers(queryData);
  }

  @Get('blogs')
  @UseGuards(BaseAuthGuard)
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.READ, subject: CurrentUserDto })
  async searchBlogsForSa(
    @Request() req: any,
    @Query() query: any,
  ): Promise<PaginatedResultDto> {
    const queryData = await this.parseQueriesService.getQueriesData(query);
    return await this.commandBus.execute(
      new SearchBlogsForSaCommand(queryData),
    );
  }

  @Post('users')
  @UseGuards(BaseAuthGuard)
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.CREATE, subject: CurrentUserDto })
  async saCreateUser(
    @Request() req: any,
    @Body() createUserDto: CreateUserDto,
    @Ip() ip: string,
  ): Promise<ReturnUsersBanInfoEntity> {
    const userAgent = req.get('user-agent') || 'None';
    const registrationData = {
      ip: ip,
      userAgent: userAgent,
    };

    const newUser: TablesUsersWithIdEntity = await this.commandBus.execute(
      new CreateUserCommand(createUserDto, registrationData),
    );

    const saUser: TablesUsersWithIdEntity = await this.commandBus.execute(
      new ChangeRoleCommand(newUser),
    );

    return {
      id: saUser.id,
      login: saUser.login,
      email: saUser.email,
      createdAt: saUser.createdAt,
      banInfo: {
        isBanned: saUser.isBanned,
        banDate: saUser.banDate,
        banReason: saUser.banReason,
      },
    };
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BaseAuthGuard)
  async removeUserById(
    @Request() req: any,
    @Param() params: IdParams,
  ): Promise<boolean> {
    const currentUserDto: CurrentUserDto = req.user;

    return await this.commandBus.execute(
      new SaRemoveUserByUserIdCommand(params.id, currentUserDto),
    );
  }

  @Put('blogs/:id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BaseAuthGuard)
  async saBanBlog(
    @Request() req: any,
    @Param() params: IdParams,
    @Body() saBanBlogDto: SaBanBlogDto,
  ): Promise<boolean> {
    const currentUserDto = req.user;
    return await this.commandBus.execute(
      new SaBanUnbanBlogCommand(params.id, saBanBlogDto, currentUserDto),
    );
  }

  @Put('users/:id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BaseAuthGuard)
  async saBanUnbanUser(
    @Request() req: any,
    @Param() params: IdParams,
    @Body() updateSaBanDto: SaBanUserDto,
  ): Promise<boolean> {
    const currentUserDto = req.user;
    return await this.commandBus.execute(
      new SaBanUnbanUserCommand(params.id, updateSaBanDto, currentUserDto),
    );
  }

  @Put('blogs/:id/bind-with-user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BaseAuthGuard)
  async bindBlogWithUser(
    @Request() req: any,
    @Param() params: IdUserIdParams,
  ): Promise<boolean> {
    const currentUserDto: CurrentUserDto = req.user;

    return await this.commandBus.execute(
      new SaBindBlogWithUserCommand(params, currentUserDto),
    );
  }

  @Put('blogs/:id/ban-with-user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BaseAuthGuard)
  async banBlogWithUser(
    @Request() req: any,
    @Param() params: IdUserIdParams,
    @Body() updateSaBanDto: SaBanUserDto,
  ): Promise<boolean> {
    const currentUserDto = req.user;
    return await this.commandBus.execute(
      new SaBanUnbanUserCommand(params.id, updateSaBanDto, currentUserDto),
    );
  }
}
