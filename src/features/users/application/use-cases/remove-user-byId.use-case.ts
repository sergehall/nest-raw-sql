import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../../../../ability/roles/action.enum';
import { CaslAbilityFactory } from '../../../../ability/casl-ability.factory';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CurrentUserDto } from '../../dto/currentUser.dto';

export class RemoveUserByIdCommand {
  constructor(public id: string, public currentUser: CurrentUserDto) {}
}

@CommandHandler(RemoveUserByIdCommand)
export class RemoveUserByIdUseCase
  implements ICommandHandler<RemoveUserByIdCommand>
{
  constructor(
    protected caslAbilityFactory: CaslAbilityFactory,
    protected usersRepository: UsersRepository,
  ) {}
  async execute(command: RemoveUserByIdCommand) {
    const userToDelete = await this.usersRepository.findUserByUserId(
      command.id,
    );
    if (!userToDelete) throw new NotFoundException('Not found user.');
    try {
      const ability = this.caslAbilityFactory.createSaUser(command.currentUser);
      ForbiddenError.from(ability).throwUnlessCan(Action.DELETE, userToDelete);
      return this.usersRepository.removeUserById(command.id);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(
          'You are not allowed to delete this user. ' + error.message,
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
