import { Module } from '@nestjs/common';
import { PostsService } from './application/posts.service';
import { PostsController } from './api/posts.controller';
import { CommentsService } from '../comments/application/comments.service';
import { Pagination } from '../common/pagination/pagination';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { CaslModule } from '../../ability/casl.module';
import { postsProviders } from './infrastructure/posts.providers';
import { ConvertFiltersForDB } from '../common/convert-filters/convertFiltersForDB';
import { PostsRepository } from './infrastructure/posts.repository';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { LikeStatusPostsRepository } from './infrastructure/like-status-posts.repository';
import { LikeStatusCommentsRepository } from '../comments/infrastructure/like-status-comments.repository';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { AuthService } from '../auth/application/auth.service';
import { UsersService } from '../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailsRepository } from '../mails/infrastructure/mails.repository';
import { BlacklistJwtRepository } from '../auth/infrastructure/blacklist-jwt.repository';
import { BloggerBlogsService } from '../blogger-blogs/application/blogger-blogs.service';
import { BloggerBlogsRepository } from '../blogger-blogs/infrastructure/blogger-blogs.repository';
import { JwtConfig } from '../../config/jwt/jwt-config';
import { CqrsModule } from '@nestjs/cqrs';
import { ChangeBanStatusPostsUseCase } from './application/use-cases/change-banStatus-posts.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { RemovePostByPostIdUseCase } from './application/use-cases/remove-post-byPostId.use-case';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { RemovePostByIdOldUseCase } from './application/use-cases/remove-post-byId-old.use-case';
import { ChangeLikeStatusPostUseCase } from './application/use-cases/change-likeStatus-post.use-case';
import { ChangeBanStatusPostsByUserIdBlogIdUseCase } from './application/use-cases/change-banStatus-posts -by-userId-blogId.use-case';
import { ChangeBanStatusPostsByBlogIdUseCase } from './application/use-cases/change-banStatus-posts -by-blogId.use-case';
import { UsersSqlRepository } from '../auth/infrastructure/rawSql-repository/usersSql.repository';

const postsUseCases = [
  CreatePostUseCase,
  ChangeBanStatusPostsUseCase,
  UpdatePostUseCase,
  RemovePostByPostIdUseCase,
  RemovePostByIdOldUseCase,
  ChangeLikeStatusPostUseCase,
  ChangeBanStatusPostsByUserIdBlogIdUseCase,
  ChangeBanStatusPostsByBlogIdUseCase,
];

@Module({
  imports: [DatabaseModule, CaslModule, CqrsModule],
  controllers: [PostsController],
  providers: [
    AuthService,
    BlacklistJwtRepository,
    JwtConfig,
    JwtService,
    PostsService,
    CommentsService,
    MailsRepository,
    CommentsRepository,
    ConvertFiltersForDB,
    UsersService,
    UsersRepository,
    BloggerBlogsService,
    Pagination,
    PostsRepository,
    UsersSqlRepository,
    BloggerBlogsRepository,
    LikeStatusPostsRepository,
    LikeStatusCommentsRepository,
    ...postsUseCases,
    ...postsProviders,
  ],
})
export class PostsModule {}
