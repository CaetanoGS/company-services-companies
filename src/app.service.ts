import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {CompanyInterface} from "./interfaces/company.interface";

@Injectable()
export class AppService {
  constructor(
      @InjectModel('Company') private readonly companyModel: Model<CompanyInterface>,
  ) {}

  private readonly logger = new Logger(AppService.name);

  async createCompany(company: CompanyInterface): Promise<CompanyInterface> {
    try {
      const createdCompany = new this.companyModel(company);
      return await createdCompany.save();
    } catch (error) {
      this.logger.log(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error);
    }
  }

  async getCompanies(): Promise<CompanyInterface[]> {
    return await this.companyModel.find().exec();
  }

  async retrieveCompany(_id: string): Promise<CompanyInterface> {
    return await this.companyModel.findOne({ _id }).exec();
  }
}
