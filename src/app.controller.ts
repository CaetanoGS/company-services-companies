import { Controller, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {CompanyInterface} from "./interfaces/company.interface";

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppService.name);

  @EventPattern('create-company')
  async createCompany(@Payload() user: CompanyInterface, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const rabbitMQMessage = context.getMessage();
    try {
      await this.appService.createCompany(user);
      await channel.ack(rabbitMQMessage);
    } catch (e) {
      this.logger.error(`Error: ${JSON.stringify(e.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
          e.message.includes(ackError),
      );
      if (filterAckError) await channel.ack(rabbitMQMessage);
    }
  }

  @MessagePattern('get-companies')
  async getCompanies(@Payload() _id: string) {
    if (_id) {
      return await this.appService.retrieveCompany(_id);
    }
    return await this.appService.getCompanies();
  }
}
