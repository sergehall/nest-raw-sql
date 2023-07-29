import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StatusLike } from '../../../../config/db/mongo/enums/like-status.enums';

export type LikeStatusCommentDocument = HydratedDocument<LikeStatusComment>;

@Schema()
export class LikeStatusComment {
  @Prop({ required: true })
  blogId: string;
  @Prop({ required: true })
  postId: string;
  @Prop({ required: true })
  commentId: string;
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  isBanned: boolean;
  @Prop({ required: true, enum: StatusLike })
  likeStatus: StatusLike;
  @Prop({ required: true })
  createdAt: string;
}

export const LikeStatusCommentSchema =
  SchemaFactory.createForClass(LikeStatusComment);
