import { Module } from '@nestjs/common';
import { TestingService } from './testing.service';
import { TestingController } from './api/testing.controller';
import { TestingRepository } from './infrastructure/testing.repository';
import { testingProviders } from './infrastructure/testing.provaiders';
import { TestingRawSqlRepository } from './infrastructure/testing-raw-sql.repository';
import { MongoDBModule } from '../../config/db/mongo/mongo-db.module';

@Module({
  imports: [MongoDBModule],
  controllers: [TestingController],
  providers: [
    TestingService,
    TestingRepository,
    TestingRawSqlRepository,
    ...testingProviders,
  ],
})
export class TestingModule {}
