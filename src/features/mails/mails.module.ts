import { Module } from '@nestjs/common';
import { MailsService } from './application/mails.service';
import { mailsProviders } from './infrastructure/mails.provaiders';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { MailsRawSqlRepository } from './infrastructure/mails-raw-sql.repository';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailsAdapter } from './adapters/mails.adapter';
import { getConfiguration } from '../../config/configuration';
import { SendRegistrationCodesUseCase } from './adapters/use-case/send-registrationCodes.use-case';
import { SendRecoveryCodesUseCase } from './adapters/use-case/send-recoveryCodes';

const mailsAdapterUseCases = [
  SendRegistrationCodesUseCase,
  SendRecoveryCodesUseCase,
];

@Module({
  imports: [
    DatabaseModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: getConfiguration().mail.MAIL_HOST,
          port: getConfiguration().mail.EMAIL_PORT,
          ignoreTLS: true,
          secure: true,
          auth: {
            user: getConfiguration().mail.NODEMAILER_EMAIL,
            pass: getConfiguration().mail.NODEMAILER_APP_PASSWORD,
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [
    MailsService,
    MailsRawSqlRepository,
    MailsAdapter,
    ...mailsAdapterUseCases,
    ...mailsProviders,
  ],
  exports: [MailsService],
})
export class MailsModule {}
