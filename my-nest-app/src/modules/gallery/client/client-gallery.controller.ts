import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { GalleryService } from '../gallery.service';
import { QueryGalleryDto } from '../dto/query-gallery.dto';
import {
  GalleryResponseDto,
  ShowInfoResponseDto,
  GalleryListResponseDto,
  ShowInfoListResponseDto,
} from '../dto/gallery-response.dto';

@Controller('v1/client/gallery')
@Public()
export class ClientGalleryController {
  constructor(private readonly galleryService: GalleryService) { }

  // 获取图片集列表
  @Get('images')
  async getGalleries(@Query() query: QueryGalleryDto): Promise<GalleryListResponseDto> {
    return this.galleryService.getGalleriesForClient(query);
  }

  // 获取图片集详情
  @Get('images/:id')
  async getGallery(@Param('id', ParseIntPipe) id: number): Promise<GalleryResponseDto> {
    return this.galleryService.getGalleryForClient(id);
  }

  // 获取展示信息列表
  @Get('show-info')
  async getShowInfos(@Query() query: QueryGalleryDto): Promise<ShowInfoListResponseDto> {
    return this.galleryService.getShowInfosForClient(query);
  }

  // 获取展示信息详情
  @Get('show-info/:id')
  async getShowInfo(@Param('id', ParseIntPipe) id: number): Promise<ShowInfoResponseDto> {
    return this.galleryService.getShowInfoForClient(id);
  }
}