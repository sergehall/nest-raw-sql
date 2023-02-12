import { IsNotEmpty, Length, Validate } from 'class-validator';
import { PostExistsRule } from '../../../pipes/post-exist-validation';
import { BlogExistsRule } from '../../../pipes/blog-exist-validation';

export class BlogIdPostIdParams {
  @IsNotEmpty()
  @Length(1, 100, {
    message: 'Incorrect blogId length! Must be max 100 ch.',
  })
  @Validate(BlogExistsRule)
  blogId: string;
  @IsNotEmpty()
  @Length(1, 100, {
    message: 'Incorrect postId length! Must be max 100 ch.',
  })
  @Validate(PostExistsRule)
  postId: string;
}
