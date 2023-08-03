import { IsNotEmpty, Length, Matches } from 'class-validator';

export class EmailsRecoveryCodesEntity {
  @IsNotEmpty()
  @Length(0, 50, {
    message: 'Incorrect id length! Must be min 1, max 100 ch.',
  })
  codeId: string;
  @IsNotEmpty()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
  @IsNotEmpty()
  @Length(0, 100, {
    message: 'Incorrect confirmationCode length! Must be min 0, max 30 ch.',
  })
  recoveryCode: string;
  @IsNotEmpty()
  @Length(0, 100, {
    message: 'Incorrect expirationDate length! Must be min 1, max 100 ch.',
  })
  @Matches(
    '/\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)/',
  )
  expirationDate: string;
  @IsNotEmpty()
  @Length(0, 100, {
    message: 'Incorrect createdAt length! Must be min 1, max 100 ch.',
  })
  @Matches(
    '/\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)/',
  )
  createdAt: string;
}
