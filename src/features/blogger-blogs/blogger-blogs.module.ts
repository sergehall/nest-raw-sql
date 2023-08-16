import { Module } from '@nestjs/common';
import { BloggerBlogsController } from './api/blogger-blogs.controller';
import { BloggerBlogsService } from './application/blogger-blogs.service';
import { PostsService } from '../posts/application/posts.service';
import { CaslAbilityFactory } from '../../ability/casl-ability.factory';
import { CreateBloggerBlogUseCase } from './application/use-cases/create-blogger-blog.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateBlogByIdUseCase } from './application/use-cases/update-blog-byId.use-case';
import { RemoveBlogByIdUseCase } from './application/use-cases/remove-blog-byId.use-case';
import { BanUserForBlogUseCase } from './application/use-cases/old/ban-user-for-blog.use-case';
import { AddBannedUserToBanListUseCase } from '../sa/application/use-cases/old/add-banned-user-to-ban-list.use-case';
import { ChangeBanStatusOwnerBlogUseCase } from './application/use-cases/old/change-ban-status-owner-blog.use-case';
import { BloggerBlogsRawSqlRepository } from './infrastructure/blogger-blogs-raw-sql.repository';
import { CommentsRawSqlRepository } from '../comments/infrastructure/comments-raw-sql.repository';
import { PostsRawSqlRepository } from '../posts/infrastructure/posts-raw-sql.repository';
import { LikeStatusPostsRawSqlRepository } from '../posts/infrastructure/like-status-posts-raw-sql.repository';
import { UsersRawSqlRepository } from '../users/infrastructure/users-raw-sql.repository';
import { BannedUsersForBlogsRawSqlRepository } from '../users/infrastructure/banned-users-for-blogs-raw-sql.repository';
import { FindAllBannedUsersForBlogUseCase } from './application/use-cases/find-all-banned-users-for-blog.use.case';
import { LikeStatusCommentsRawSqlRepository } from '../comments/infrastructure/like-status-comments-raw-sql.repository';
import { ChangeBanStatusLikesPostForBannedUserUseCase } from '../posts/application/use-cases/change-banstatus-posts-by-userid-blogid.use-case';
import { ParseQueriesService } from '../../common/query/parse-queries.service';
import { BanUnbanBlogForUserUseCase } from './application/use-cases/ban-unban-user-for-blog.use-case';
import { SaChangeBanStatusBlogsByBlogIdUseCase } from '../sa/application/use-cases/old/sa-change-ban-status-blogs-by-blog-id.use-case';
import { KeyResolver } from '../../common/helpers/key-resolver';
import { SearchUserCommentsUseCase } from './application/use-cases/search-user-comments.use-case';
import { SearchUserBlogsUseCase } from './application/use-cases/search-user-blogs.use-case';
import { SearchPostsInBlogUseCase } from '../posts/application/use-cases/search-posts-in-blog.use-case';

const bloggersBlogUseCases = [
  BanUnbanBlogForUserUseCase,
  CreateBloggerBlogUseCase,
  UpdateBlogByIdUseCase,
  RemoveBlogByIdUseCase,
  SearchUserCommentsUseCase,
  SearchUserBlogsUseCase,
  BanUserForBlogUseCase,
  AddBannedUserToBanListUseCase,
  ChangeBanStatusOwnerBlogUseCase,
  FindAllBannedUsersForBlogUseCase,
  SaChangeBanStatusBlogsByBlogIdUseCase,
  ChangeBanStatusLikesPostForBannedUserUseCase,
  SearchPostsInBlogUseCase,
];

@Module({
  imports: [CqrsModule],
  controllers: [BloggerBlogsController],
  providers: [
    CaslAbilityFactory,
    ParseQueriesService,
    BloggerBlogsService,
    PostsService,
    KeyResolver,
    UsersRawSqlRepository,
    BloggerBlogsRawSqlRepository,
    CommentsRawSqlRepository,
    PostsRawSqlRepository,
    LikeStatusPostsRawSqlRepository,
    LikeStatusCommentsRawSqlRepository,
    BannedUsersForBlogsRawSqlRepository,
    ...bloggersBlogUseCases,
  ],
})
export class BloggerBlogsModule {}
