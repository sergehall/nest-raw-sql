import { Mongoose } from 'mongoose';
import { PostsDocument, PostsSchema } from './schemas/posts.schema';
import { ProvidersEnums } from '../../../config/db/mongo/enums/providers.enums';
import { ConnectionEnums } from '../../../config/db/mongo/enums/connection.enums';
import { NamesCollectionsEnums } from '../../../config/db/mongo/enums/names-collections.enums';
import {
  CommentsDocument,
  CommentsSchema,
} from '../../comments/infrastructure/schemas/comments.schema';
import {
  LikeStatusCommentDocument,
  LikeStatusCommentSchema,
} from '../../comments/infrastructure/schemas/like-status-comments.schema';
import {
  LikeStatusPostSchema,
  LikeStatusPostsDocument,
} from './schemas/like-status-posts.schemas';
import {
  UsersDocument,
  UsersSchema,
} from '../../users/infrastructure/schemas/user.schema';
import {
  EmailsConfirmCodeDocument,
  EmailsConfirmCodeSchema,
} from '../../mails/infrastructure/schemas/email-confirm-code.schema';
import {
  refreshTokenBlackListDocument,
  RefreshTokenBlacklistSchema,
} from '../../auth/infrastructure/schemas/refreshToken-blacklist.schema';
import {
  BBlogsSchema,
  BBlogsDocument,
} from '../../blogger-blogs/infrastructure/schemas/blogger-blogs.schema';
import {
  BBlogsBannedUserDocument,
  BBlogsBannedUsersSchema,
} from '../../blogger-blogs/infrastructure/schemas/blogger-blogs-banned-users.schema';

export const postsProviders = [
  {
    provide: ProvidersEnums.BL_REFRESH_JWT_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<refreshTokenBlackListDocument>(
        NamesCollectionsEnums.REFRESH_TOKEN_BL,
        RefreshTokenBlacklistSchema,
        NamesCollectionsEnums.REFRESH_TOKEN_BL,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.POST_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<PostsDocument>(
        NamesCollectionsEnums.POSTS,
        PostsSchema,
        NamesCollectionsEnums.POSTS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.COMMENT_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<CommentsDocument>(
        NamesCollectionsEnums.COMMENTS,
        CommentsSchema,
        NamesCollectionsEnums.COMMENTS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.LIKE_STATUS_COMMENTS_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<LikeStatusCommentDocument>(
        NamesCollectionsEnums.LIKE_STATUS_COMMENTS,
        LikeStatusCommentSchema,
        NamesCollectionsEnums.LIKE_STATUS_COMMENTS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.LIKE_STATUS_POSTS_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<LikeStatusPostsDocument>(
        NamesCollectionsEnums.LIKE_STATUS_POST,
        LikeStatusPostSchema,
        NamesCollectionsEnums.LIKE_STATUS_POST,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.USER_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<UsersDocument>(
        NamesCollectionsEnums.USERS,
        UsersSchema,
        NamesCollectionsEnums.USERS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.CONFIRM_CODE_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<EmailsConfirmCodeDocument>(
        NamesCollectionsEnums.EMAILS_CONFIRM_CODES,
        EmailsConfirmCodeSchema,
        NamesCollectionsEnums.EMAILS_CONFIRM_CODES,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.BBLOG_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<BBlogsDocument>(
        NamesCollectionsEnums.BBLOGS,
        BBlogsSchema,
        NamesCollectionsEnums.BBLOGS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
  {
    provide: ProvidersEnums.BBLOG_BANNED_USER_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model<BBlogsBannedUserDocument>(
        NamesCollectionsEnums.BBLOGS_BANNED_USERS,
        BBlogsBannedUsersSchema,
        NamesCollectionsEnums.BBLOGS_BANNED_USERS,
      ),
    inject: [ConnectionEnums.ASYNC_CONNECTION],
  },
];
