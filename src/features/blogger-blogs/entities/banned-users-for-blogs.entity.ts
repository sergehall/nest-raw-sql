import { IsBoolean, IsNotEmpty, Length, Matches } from 'class-validator';

export class BannedUsersForBlogsEntity {
  @IsNotEmpty()
  @Length(0, 100, {
    message: 'Incorrect id! Must be max 100 ch.',
  })
  id: string;
  @IsNotEmpty()
  @Length(0, 100, {
    message: 'Incorrect blogId! Must be max 100 ch.',
  })
  blogId: string;
  @IsNotEmpty()
  @Length(0, 100, {
    message: 'Incorrect userId! Must be max 100 ch.',
  })
  userId: string;
  @IsNotEmpty()
  @Length(3, 10, {
    message: 'Incorrect login length! Must be min 3, max 10 ch.',
  })
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;
  @IsNotEmpty()
  @Length(20, 300, {
    message: 'Incorrect banReason length! Must be min 20 max 300 ch.',
  })
  @IsNotEmpty()
  @IsBoolean({
    message: 'Incorrect isBanned length! Must be boolean.',
  })
  isBanned: boolean;
  @IsNotEmpty()
  @Length(0, 100, {
    message: 'Incorrect banDate length! Must be max 100 ch.',
  })
  @Matches(
    '/\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)/',
  )
  banDate: string;
  @IsNotEmpty()
  @Length(20, 300, {
    message: 'Incorrect banReason length! Must be min 20 max 300 ch.',
  })
  banReason: string;
}
