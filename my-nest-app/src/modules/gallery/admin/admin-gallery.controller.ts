import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { GalleryService } from '../gallery.service';
import { CreateGalleryDto } from '../dto/create-gallery.dto';
import { UpdateGalleryDto } from '../dto/update-gallery.dto';
import { CreateShowInfoDto } from '../dto/create-show-info.dto';
import { UpdateShowInfoDto } from '../dto/update-show-info.dto';
import { QueryGalleryDto } from '../dto/query-gallery.dto';
import {
  GalleryResponseDto,
  Gallery2ResponseDto,
  Gallery3ResponseDto,
  ShowInfoResponseDto,
  GalleryListResponseDto,
  Gallery2ListResponseDto,
  Gallery3ListResponseDto,
  ShowInfoListResponseDto,
} from '../dto/gallery-response.dto';

@Controller('v1/admin/gallery')
@UseGuards(JwtAuthGuard)
@RequirePermissions('gallery', 'images')
export class AdminGalleryController {
  constructor(private readonly galleryService: GalleryService) { }

  @Post('images')
  async createGallery(@Body() createGalleryDto: CreateGalleryDto): Promise<GalleryResponseDto> {
    return this.galleryService.createGallery(createGalleryDto);
  }

  @Get('images')
  async findAllGalleries(@Query() query: QueryGalleryDto): Promise<GalleryListResponseDto> {
    return this.galleryService.findAllGalleries(query);
  }

  @Get('images/:id')
  async findOneGallery(@Param('id', ParseIntPipe) id: number): Promise<GalleryResponseDto> {
    return this.galleryService.findOneGallery(id);
  }

  @Patch('images/:id')
  async updateGallery(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGalleryDto): Promise<GalleryResponseDto> {
    return this.galleryService.updateGallery(id, dto);
  }

  @Delete('images/:id')
  async removeGallery(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.galleryService.removeGallery(id);
  }

  @Post('images2')
  async createGallery2(@Body() dto: any): Promise<Gallery2ResponseDto> {
    return this.galleryService.createGallery2(dto);
  }

  @Get('images2')
  async findAllGallery2(@Query() query: QueryGalleryDto): Promise<Gallery2ListResponseDto> {
    return this.galleryService.findAllGallery2(query);
  }

  @Get('images2/:id')
  async findOneGallery2(@Param('id', ParseIntPipe) id: number): Promise<Gallery2ResponseDto> {
    return this.galleryService.findOneGallery2(id);
  }

  @Patch('images2/:id')
  async updateGallery2(@Param('id', ParseIntPipe) id: number, @Body() dto: any): Promise<Gallery2ResponseDto> {
    return this.galleryService.updateGallery2(id, dto);
  }

  @Delete('images2/:id')
  async removeGallery2(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.galleryService.removeGallery2(id);
  }

  @Post('images3')
  async createGallery3(@Body() dto: any): Promise<Gallery3ResponseDto> {
    return this.galleryService.createGallery3(dto);
  }

  @Get('images3')
  async findAllGallery3(@Query() query: QueryGalleryDto): Promise<Gallery3ListResponseDto> {
    return this.galleryService.findAllGallery3(query);
  }

  @Get('images3/:id')
  async findOneGallery3(@Param('id', ParseIntPipe) id: number): Promise<Gallery3ResponseDto> {
    return this.galleryService.findOneGallery3(id);
  }

  @Patch('images3/:id')
  async updateGallery3(@Param('id', ParseIntPipe) id: number, @Body() dto: any): Promise<Gallery3ResponseDto> {
    return this.galleryService.updateGallery3(id, dto);
  }

  @Delete('images3/:id')
  async removeGallery3(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.galleryService.removeGallery3(id);
  }

  @Post('show-info')
  async createShowInfo(@Body() createShowInfoDto: CreateShowInfoDto): Promise<ShowInfoResponseDto> {
    return this.galleryService.createShowInfo(createShowInfoDto);
  }

  @Get('show-info')
  async findAllShowInfos(@Query() query: QueryGalleryDto): Promise<ShowInfoListResponseDto> {
    return this.galleryService.findAllShowInfos(query);
  }

  @Get('show-info/:id')
  async findOneShowInfo(@Param('id', ParseIntPipe) id: number): Promise<ShowInfoResponseDto> {
    return this.galleryService.findOneShowInfo(id);
  }

  @Patch('show-info/:id')
  async updateShowInfo(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateShowInfoDto): Promise<ShowInfoResponseDto> {
    return this.galleryService.updateShowInfo(id, dto);
  }

  @Delete('show-info/:id')
  async removeShowInfo(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.galleryService.removeShowInfo(id);
  }
}
