import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFloatPipe,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';

import { CivicReportService } from './civic-report.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuthUser } from '../auth/auth-user.decorator';

@Controller('civic-report')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CivicReportController {
  constructor(private readonly civicReportService: CivicReportService) {}

  @Post()
  @Roles('CITIZEN')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        // ✅ The correct path to save files for Next.js to serve
        destination: '../frontend/public/uploads',
        filename: (_, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async createReport(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @AuthUser('sub') createdById: string,
  ) {
    const { title, description, type, latitude, longitude } = body;

    if (!title || !latitude || !longitude || !type) {
      throw new BadRequestException('Missing required fields');
    }

    return this.civicReportService.createReport({
      title,
      description: description || '',
      type,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      imageUrl: file ? `/uploads/${file.filename}` : null,
      createdById,
    });
  }

  @Get()
  async getAllReports(@AuthUser('sub') userId: string) {
    return this.civicReportService.getAllReports(userId);
  }

  @Get('my-reports')
  @Roles('CITIZEN')
  async getMyReports(@AuthUser('sub') userId: string) {
    return this.civicReportService.getMyReports(userId);
  }

  @Get('other-reports')
  @Roles('CITIZEN')
  async getOtherReports(@AuthUser('sub') userId: string) {
    return this.civicReportService.getOtherReports(userId);
  }

  @Get(':id')
  async getReportById(@Param('id') id: string, @AuthUser('sub') userId: string) {
    return this.civicReportService.getReportById(id, userId);
  }

  @Post(':id/support')
  @Roles('CITIZEN')
  async supportReport(@Param('id') id: string, @AuthUser('sub') userId: string) {
    return this.civicReportService.supportReport(id, userId);
  }

  @Post(':id/oppose')
  @Roles('CITIZEN')
  async opposeReport(@Param('id') id: string, @AuthUser('sub') userId: string) {
    return this.civicReportService.opposeReport(id, userId);
  }

  @Delete(':id')
  @Roles('CITIZEN')
  @HttpCode(HttpStatus.OK)
  async withdrawReport(@Param('id') id: string, @AuthUser('sub') userId: string) {
    return this.civicReportService.withdrawReport(id, userId);
  }
}
