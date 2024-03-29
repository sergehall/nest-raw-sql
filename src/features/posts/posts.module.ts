import { Module } from '@nestjs/common';
import { PostsService } from './application/posts.service';
import { PostsController } from './api/posts.controller';
import { CommentsService } from '../comments/application/comments.service';
import { CaslModule } from '../../ability/casl.module';
import { AuthService } from '../auth/application/auth.service';
import { UsersService } from '../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { BloggerBlogsService } from '../blogger-blogs/application/blogger-blogs.service';
import { JwtConfig } from '../../config/jwt/jwt-config';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { ChangeLikeStatusPostUseCase } from './application/use-cases/change-likeStatus-post.use-case';
import { UsersRawSqlRepository } from '../users/infrastructure/users-raw-sql.repository';
import { BloggerBlogsRawSqlRepository } from '../blogger-blogs/infrastructure/blogger-blogs-raw-sql.repository';
import { PostsRawSqlRepository } from './infrastructure/posts-raw-sql.repository';
import { LikeStatusPostsRawSqlRepository } from './infrastructure/like-status-posts-raw-sql.repository';
import { CommentsRawSqlRepository } from '../comments/infrastructure/comments-raw-sql.repository';
import { BlacklistJwtRawSqlRepository } from '../auth/infrastructure/blacklist-jwt-raw-sql.repository';
import { UpdatePostByPostIdUseCase } from './application/use-cases/update-post.use-case';
import { BannedUsersForBlogsRawSqlRepository } from '../users/infrastructure/banned-users-for-blogs-raw-sql.repository';
import { LikeStatusCommentsRawSqlRepository } from '../comments/infrastructure/like-status-comments-raw-sql.repository';
import { ChangeBanStatusPostsByBlogIdUseCase } from './application/use-cases/change-banstatus-posts-by-blogid.use-case';
import { ChangeBanStatusPostsUseCase } from './application/use-cases/change-banstatus-posts.use-case';
import { ChangeBanStatusLikesPostForBannedUserUseCase } from './application/use-cases/change-banstatus-posts-by-userid-blogid.use-case';
import { ParseQueriesService } from '../../common/query/parse-queries.service';
import { FindPostsUseCase } from './application/use-cases/find-posts.use-case';
import { FindPostByIdUseCase } from './application/use-cases/find-post-by-id.use-case';
import { KeyResolver } from '../../common/helpers/key-resolver';

import { DeletePostByIdUseCase } from './application/use-cases/delete-post-by-id.use-case';
import { DeletePostByPostIdAndBlogIdUseCase } from './application/use-cases/delete-post-by-post-id-and-blog-id.use-case';

const postsUseCases = [
  FindPostsUseCase,
  FindPostByIdUseCase,
  CreatePostUseCase,
  UpdatePostByPostIdUseCase,
  ChangeBanStatusPostsUseCase,
  ChangeLikeStatusPostUseCase,
  ChangeBanStatusPostsByBlogIdUseCase,
  ChangeBanStatusLikesPostForBannedUserUseCase,
  DeletePostByPostIdAndBlogIdUseCase,
  DeletePostByIdUseCase,
];

@Module({
  imports: [CaslModule, CqrsModule],
  controllers: [PostsController],
  providers: [
    JwtConfig,
    AuthService,
    JwtService,
    PostsService,
    KeyResolver,
    CommentsService,
    UsersService,
    ParseQueriesService,
    BloggerBlogsService,
    UsersRawSqlRepository,
    CommentsRawSqlRepository,
    PostsRawSqlRepository,
    BloggerBlogsRawSqlRepository,
    LikeStatusPostsRawSqlRepository,
    BlacklistJwtRawSqlRepository,
    BannedUsersForBlogsRawSqlRepository,
    LikeStatusCommentsRawSqlRepository,
    ...postsUseCases,
  ],
})
export class PostsModule {}
