import { Injectable } from '@nestjs/common';
import { MailsRawSqlRepository } from '../infrastructure/mails-raw-sql.repository';
import { EmailsConfirmCodeEntity } from '../entities/emails-confirm-code.entity';
import { EmailsRecoveryCodesEntity } from '../entities/emails-recovery-codes.entity';
import * as uuid4 from 'uuid4';
import { MailingStatus } from '../enums/status.enums';
import { CommandBus } from '@nestjs/cqrs';
import { SendRecoveryCodesCommand } from './use-case/send-recovery-codes.use-case';
import { SendConfirmationCodesCommand } from './use-case/send-confirmation-codes.use-case';

@Injectable()
export class MailsService {
  constructor(
    private mailsRawSqlRepository: MailsRawSqlRepository,
    protected commandBus: CommandBus,
  ) {}

  async registrationSendCode(email: string, confirmationCode: string) {
    return await this.commandBus.execute(
      new SendConfirmationCodesCommand(email, confirmationCode),
    );
  }

  async sendRecoveryCode(email: string, recoveryCode: string) {
    return await this.commandBus.execute(
      new SendRecoveryCodesCommand(email, recoveryCode),
    );
  }

  async updateConfirmationCode(
    email: string,
    confirmationCode: string,
    expirationDate: string,
  ): Promise<EmailsConfirmCodeEntity> {
    const newEmailConfirmCodeEntity: EmailsConfirmCodeEntity =
      await this.createEmailConfirmCode(
        email,
        confirmationCode,
        expirationDate,
      );

    await this.insertEmailConfirmationCode(newEmailConfirmCodeEntity);
    return newEmailConfirmCodeEntity;
  }

  async updateRecoveryCode(
    email: string,
    confirmationCode: string,
    expirationDate: string,
  ): Promise<EmailsRecoveryCodesEntity> {
    const newEmailRecoveryCode: EmailsRecoveryCodesEntity =
      await this.createEmailRecoveryCode(
        email,
        confirmationCode,
        expirationDate,
      );

    await this.insertEmailRecoveryCode(newEmailRecoveryCode);
    return newEmailRecoveryCode;
  }

  async createEmailRecoveryCode(
    email: string,
    recoveryCode: string,
    expirationDate: string,
  ): Promise<EmailsRecoveryCodesEntity> {
    return {
      codeId: uuid4().toString(),
      email: email,
      recoveryCode: recoveryCode,
      expirationDate: expirationDate,
      createdAt: new Date().toISOString(),
      status: MailingStatus.PENDING,
    };
  }

  async createEmailConfirmCode(
    email: string,
    confirmationCode: string,
    expirationDate: string,
  ): Promise<EmailsConfirmCodeEntity> {
    return {
      codeId: uuid4().toString(),
      email: email,
      confirmationCode: confirmationCode,
      expirationDate: expirationDate,
      createdAt: new Date().toISOString(),
      status: MailingStatus.PENDING,
    };
  }

  async insertEmailRecoveryCode(
    newRecoveryCode: EmailsRecoveryCodesEntity,
  ): Promise<EmailsRecoveryCodesEntity> {
    return await this.mailsRawSqlRepository.insertEmailRecoveryCode(
      newRecoveryCode,
    );
  }

  async insertEmailConfirmationCode(
    newConfirmationCode: EmailsConfirmCodeEntity,
  ): Promise<EmailsConfirmCodeEntity> {
    return await this.mailsRawSqlRepository.insertEmailConfirmationCode2(
      newConfirmationCode,
    );
  }
}
