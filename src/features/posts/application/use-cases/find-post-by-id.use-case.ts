import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRawSqlRepository } from '../../infrastructure/posts-raw-sql.repository';
import { CurrentUserDto } from '../../../users/dto/currentUser.dto';
import { ReturnPostsEntity } from '../../entities/return-posts.entity';

export class FindPostByIdCommand {
  constructor(
    public postId: string,
    public currentUserDto: CurrentUserDto | null,
  ) {}
}

@CommandHandler(FindPostByIdCommand)
export class FindPostByIdUseCase
  implements ICommandHandler<FindPostByIdCommand>
{
  constructor(
    private readonly postsRawSqlRepository: PostsRawSqlRepository,
    protected commandBus: CommandBus,
  ) {}
  async execute(command: FindPostByIdCommand): Promise<ReturnPostsEntity> {
    const { postId, currentUserDto } = command;

    return await this.postsRawSqlRepository.findPostByPostIdWithLikes(
      postId,
      currentUserDto,
    );
  }
}
