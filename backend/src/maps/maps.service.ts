import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Prisma, User } from '@prisma/client';

@Injectable()
export class MapsService {
  constructor(private prisma: PrismaService) {}

  async addPublicFacility(data: Prisma.PublicFacilityCreateInput) {
    return this.prisma.publicFacility.create({ data });
  }

  async getPublicFacilities() {
    return this.prisma.publicFacility.findMany();
  }

  async updatePublicFacility(id: string, data: Prisma.PublicFacilityUpdateInput) {
    try {
      return this.prisma.publicFacility.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Facility with ID ${id} not found.`);
    }
  }

  async deletePublicFacility(id: string) {
    try {
      return this.prisma.publicFacility.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Facility with ID ${id} not found.`);
    }
  }

  async updateWorkerLocation(workerId: string, lat: number, lng: number) {
    const worker = await this.prisma.user.findUnique({
      where: { id: workerId },
    });

    if (!worker || worker.role !== Role.WORKER) {
      throw new UnauthorizedException('Only waste workers can update their location.');
    }

    const existingLocation = await this.prisma.wasteWorkerLocation.findUnique({
      where: { workerId: workerId },
    });

    if (existingLocation) {
      return this.prisma.wasteWorkerLocation.update({
        where: { workerId: workerId },
        data: {
          latitude: lat,
          longitude: lng,
        },
      });
    } else {
      return this.prisma.wasteWorkerLocation.create({
        data: {
          workerId: workerId,
          latitude: lat,
          longitude: lng,
        },
      });
    }
  }

  async getWorkerLocations() {
    return this.prisma.wasteWorkerLocation.findMany({
      select: {
        id: true,
        latitude: true,
        longitude: true,
        workerId: true,
      },
    });
  }
}
