import { PayloadDto } from '../../dto/payload.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtConfig } from '../../../../config/jwt/jwt-config';
import { RefreshTokenDto } from '../../dto/refresh-token.dto';

export class UpdateRefreshJwtCommand {
  constructor(public currentPayload: PayloadDto) {}
}

@CommandHandler(UpdateRefreshJwtCommand)
export class UpdateRefreshJwtUseCase
  implements ICommandHandler<UpdateRefreshJwtCommand>
{
  constructor(private jwtService: JwtService, private jwtConfig: JwtConfig) {}
  async execute(command: UpdateRefreshJwtCommand): Promise<RefreshTokenDto> {
    const { currentPayload } = command;
    const REFRESH_SECRET_KEY = await this.jwtConfig.getRefSecretKey();

    const EXP_REF_TIME = await this.jwtConfig.getRefSecretKey();

    const payload = {
      userId: currentPayload.userId,
      deviceId: currentPayload.deviceId,
    };

    if (!REFRESH_SECRET_KEY || !EXP_REF_TIME)
      throw new InternalServerErrorException();
    return {
      refreshToken: this.jwtService.sign(payload, {
        secret: REFRESH_SECRET_KEY,
        expiresIn: EXP_REF_TIME,
      }),
    };
  }
}
