import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../../../../ability/roles/action.enum';
import { CaslAbilityFactory } from '../../../../ability/casl-ability.factory';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CurrentUserDto } from '../../../users/dto/currentUser.dto';
import { PostsRawSqlRepository } from '../../infrastructure/posts-raw-sql.repository';
import { IdParams } from '../../../../common/query/params/id.params';

export class RemovePostByIdOldCommand {
  constructor(public params: IdParams, public currentUserDto: CurrentUserDto) {}
}

@CommandHandler(RemovePostByIdOldCommand)
export class RemovePostByIdOldUseCase
  implements ICommandHandler<RemovePostByIdOldCommand>
{
  constructor(
    protected caslAbilityFactory: CaslAbilityFactory,
    protected postsRawSqlRepository: PostsRawSqlRepository,
  ) {}
  async execute(
    command: RemovePostByIdOldCommand,
  ): Promise<boolean | undefined> {
    const { params, currentUserDto } = command;
    const { id } = params;
    const postToDelete = await this.postsRawSqlRepository.getPostById(
      params.id,
    );
    if (!postToDelete) {
      throw new NotFoundException(`Post with id: ${id} not found.`);
    }
    const ability = this.caslAbilityFactory.createForUserId({
      id: currentUserDto.id,
    });
    try {
      // ForbiddenError.from(ability).throwUnlessCan(Action.DELETE, {
      //   id: postToDelete.postOwnerId,
      // });
      // The old conditions, then it was not necessary to check the owner post
      ForbiddenError.from(ability).throwUnlessCan(Action.DELETE, {
        id: currentUserDto.id,
      });
      return await this.postsRawSqlRepository.deletePostByPostId(id);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
