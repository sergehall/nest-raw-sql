import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRawSqlRepository } from '../../../users/infrastructure/users-raw-sql.repository';
import { NewPasswordRecoveryDto } from '../../dto/newPasswordRecovery.dto';
import * as bcrypt from 'bcrypt';
import { ConfigType } from '../../../../config/configuration';
import { ConfigService } from '@nestjs/config';

export class newPasswordRecoveryCommand {
  constructor(public newPasswordRecoveryDto: NewPasswordRecoveryDto) {}
}

@CommandHandler(newPasswordRecoveryCommand)
export class NewPasswordRecoveryUseCase
  implements ICommandHandler<newPasswordRecoveryCommand>
{
  constructor(
    protected usersRawSqlRepository: UsersRawSqlRepository,
    protected configService: ConfigService<ConfigType, true>,
  ) {}
  async execute(command: newPasswordRecoveryCommand): Promise<boolean> {
    const SALT_FACTOR = this.configService.get('bcryptConfig', {
      infer: true,
    }).SALT_FACTOR;

    const { newPassword, recoveryCode } = command.newPasswordRecoveryDto;

    const passwordHash = await bcrypt.hash(newPassword, SALT_FACTOR);

    const isPasswordUpdated =
      await this.usersRawSqlRepository.updateUserPasswordHashByRecoveryCode(
        recoveryCode,
        passwordHash,
      );
    return isPasswordUpdated.length !== 0;
  }
}
