import * as uuid4 from 'uuid4';
import { InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtConfig } from '../../../../config/jwt/jwt-config';
import { AccessTokenDto } from '../../dto/access-token.dto';
import { CurrentUserDto } from '../../../users/dto/currentUser.dto';

export class SignAccessJwtUseCommand {
  constructor(public currentUserDto: CurrentUserDto) {}
}

@CommandHandler(SignAccessJwtUseCommand)
export class SignAccessJwtUseCase
  implements ICommandHandler<SignAccessJwtUseCommand>
{
  constructor(private jwtService: JwtService, private jwtConfig: JwtConfig) {}
  async execute(command: SignAccessJwtUseCommand): Promise<AccessTokenDto> {
    const { currentUserDto } = command;

    const ACCESS_SECRET_KEY = this.jwtConfig.getAccSecretKey();
    const EXP_ACC_TIME = this.jwtConfig.getExpAccTime();

    const payloadData = {
      userId: currentUserDto.id,
      email: currentUserDto.email,
      deviceId: uuid4().toString(),
    };

    if (!ACCESS_SECRET_KEY || !EXP_ACC_TIME)
      throw new InternalServerErrorException();
    return {
      accessToken: this.jwtService.sign(payloadData, {
        secret: ACCESS_SECRET_KEY,
        expiresIn: EXP_ACC_TIME,
      }),
    };
  }
}
