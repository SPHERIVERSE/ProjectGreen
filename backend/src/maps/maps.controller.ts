import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { MapsService } from './maps.service';
import { AuthUser } from '../auth/auth-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { type User, Role, FacilityType } from '@prisma/client';
import { CreatePublicFacilityDto } from './dto/create-public-facility.dto';

@Controller('maps')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Post('facilities')
  @Roles(Role.ADMIN)
  async addPublicFacility(@Body() createPublicFacilityDto: CreatePublicFacilityDto) {
    return this.mapsService.addPublicFacility(createPublicFacilityDto);
  }

  @Get('facilities')
  @Public()
  async getPublicFacilities() {
    return this.mapsService.getPublicFacilities();
  }

  @Patch('facilities/:id')
  @Roles(Role.ADMIN)
  async updatePublicFacility(@Param('id') id: string, @Body() updateData: CreatePublicFacilityDto) {
    return this.mapsService.updatePublicFacility(id, updateData);
  }

  @Delete('facilities/:id')
  @Roles(Role.ADMIN)
  async deletePublicFacility(@Param('id') id: string) {
    return this.mapsService.deletePublicFacility(id);
  }

  @Post('worker-location')
  @Roles(Role.WORKER)
  async updateWorkerLocation(@AuthUser() user: User, @Body() body: { latitude: number; longitude: number }) {
    return this.mapsService.updateWorkerLocation(user.id, body.latitude, body.longitude);
  }

  @Get('worker-locations')
  @Public()
  async getWorkerLocations() {
    return this.mapsService.getWorkerLocations();
  }
}
