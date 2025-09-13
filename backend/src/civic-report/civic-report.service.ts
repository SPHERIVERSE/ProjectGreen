import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportType } from '@prisma/client';

@Injectable()
export class CivicReportService {
  constructor(private prisma: PrismaService) {}

  async createReport(data: {
    title: string;
    description?: string;
    type: ReportType;
    imageUrl?: string | null;
    latitude: number;
    longitude: number;
    createdById: string;
  }) {
    const report = await this.prisma.civicReport.create({
      data: {
        title: data.title,
        description: data.description || '',
        type: data.type,
        imageUrl: data.imageUrl || null,
        latitude: data.latitude,
        longitude: data.longitude,
        createdBy: {
          connect: { id: data.createdById },
        },
      },
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        supports: true,
      },
    });

    return this.formatReportResponse(report, data.createdById);
  }

  async getAllReports(currentUserId: string) {
    const reports = await this.prisma.civicReport.findMany({
      include: {
        supports: true,
        createdBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reports.map((report) =>
      this.formatReportResponse(report, currentUserId),
    );
  }

  async getMyReports(userId: string) {
    const reports = await this.prisma.civicReport.findMany({
      where: { createdById: userId },
      include: {
        supports: true,
        createdBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reports.map((report) => this.formatReportResponse(report, userId));
  }
  
  // Add this new method to the CivicReportService class

async withdrawReport(reportId: string, userId: string) {
  const report = await this.prisma.civicReport.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundException('Report not found');
  }

  if (report.createdById !== userId) {
    throw new ForbiddenException('You do not have permission to withdraw this report');
  }

  await this.prisma.civicReport.delete({
    where: { id: reportId },
  });

  return { message: 'Report withdrawn successfully' };
}

  async getOtherReports(userId: string) {
    const reports = await this.prisma.civicReport.findMany({
      where: { NOT: { createdById: userId } },
      include: {
        supports: true,
        createdBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reports.map((report) => this.formatReportResponse(report, userId));
  }

  async getReportById(id: string, currentUserId: string) {
    const report = await this.prisma.civicReport.findUnique({
      where: { id },
      include: {
        supports: true,
        createdBy: { select: { id: true, name: true, role: true } },
      },
    });

    if (!report) throw new NotFoundException('Report not found');

    return this.formatReportResponse(report, currentUserId);
  }

  async supportReport(reportId: string, userId: string) {
    const report = await this.prisma.civicReport.findUnique({
      where: { id: reportId },
    });

    if (!report) throw new NotFoundException('Report not found');
    if (report.createdById === userId) {
      throw new ForbiddenException('Cannot vote on your own report');
    }

    const existing = await this.prisma.civicReportSupport.findUnique({
      where: { reportId_userId: { reportId, userId } }, // ✅ Correct usage
    });

    if (existing) {
      throw new BadRequestException('You have already voted on this report');
    }

    const support = await this.prisma.civicReportSupport.create({
      data: { reportId, userId, support: true },
    });

    await this.prisma.civicReport.update({
      where: { id: reportId },
      data: { supportCount: { increment: 1 } },
    });

    await this.checkThreshold(reportId);
    return support;
  }

  async opposeReport(reportId: string, userId: string) {
    const report = await this.prisma.civicReport.findUnique({
      where: { id: reportId },
    });

    if (!report) throw new NotFoundException('Report not found');
    if (report.createdById === userId) {
      throw new ForbiddenException('Cannot vote on your own report');
    }

    const existing = await this.prisma.civicReportSupport.findUnique({
      where: { reportId_userId: { reportId, userId } }, // ✅ Correct usage
    });

    if (existing) {
      throw new BadRequestException('You have already voted on this report');
    }

    const oppose = await this.prisma.civicReportSupport.create({
      data: { reportId, userId, support: false },
    });

    await this.prisma.civicReport.update({
      where: { id: reportId },
      data: { oppositionCount: { increment: 1 } },
    });

    await this.checkThreshold(reportId);
    return oppose;
  }

  private formatReportResponse(report: any, currentUserId: string) {
    const userVote = report.supports?.find(
      (s: any) => s.userId === currentUserId,
    );

    return {
      ...report,
      isOwnReport: report.createdById === currentUserId,
      userVote: userVote ? (userVote.support ? 'support' : 'oppose') : null,
      hasVoted: !!userVote,
      canVote: report.createdById !== currentUserId && !userVote,
    };
  }

  private async checkThreshold(reportId: string) {
    const supportCount = await this.prisma.civicReportSupport.count({
      where: { reportId, support: true },
    });

    const threshold = 10; // ⚡ configurable if needed
    if (supportCount >= threshold) {
      await this.prisma.civicReport.update({
        where: { id: reportId },
        data: { status: 'escalated' },
      });
      console.log(
        `Report ${reportId} escalated! Support count: ${supportCount}`,
      );
    }
  }
}

