import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './entities/gallery.entity';
import { Gallery2 } from './entities/gallery2.entity';
import { Gallery3 } from './entities/gallery3.entity';
import { ShowInfo } from './entities/show-info.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { CreateShowInfoDto } from './dto/create-show-info.dto';
import { UpdateShowInfoDto } from './dto/update-show-info.dto';
import { QueryGalleryDto } from './dto/query-gallery.dto';
import {
  GalleryResponseDto,
  Gallery2ResponseDto,
  Gallery3ResponseDto,
  ShowInfoResponseDto,
  GalleryListResponseDto,
  Gallery2ListResponseDto,
  Gallery3ListResponseDto,
  ShowInfoListResponseDto,
} from './dto/gallery-response.dto';
import { GalleryCrudHelper } from './gallery-crud.helper';

@Injectable()
export class GalleryService {
  private readonly galleryHelper: GalleryCrudHelper<Gallery>;
  private readonly gallery2Helper: GalleryCrudHelper<Gallery2>;
  private readonly gallery3Helper: GalleryCrudHelper<Gallery3>;

  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
    @InjectRepository(Gallery2)
    private gallery2Repository: Repository<Gallery2>,
    @InjectRepository(Gallery3)
    private gallery3Repository: Repository<Gallery3>,
    @InjectRepository(ShowInfo)
    private showInfoRepository: Repository<ShowInfo>,
  ) {
    this.galleryHelper = new GalleryCrudHelper(galleryRepository, '图片集');
    this.gallery2Helper = new GalleryCrudHelper(gallery2Repository, '图片组2');
    this.gallery3Helper = new GalleryCrudHelper(gallery3Repository, '图片组3');
  }

  // ==================== 图片集管理 ====================

  async createGallery(createGalleryDto: CreateGalleryDto): Promise<GalleryResponseDto> {
    const saved = await this.galleryHelper.create(createGalleryDto as Partial<Gallery>);
    return this.formatGalleryResponse(saved);
  }

  async findAllGalleries(query: QueryGalleryDto): Promise<GalleryListResponseDto> {
    const { items, total, page, limit } = await this.galleryHelper.findAll(query, 'gallery');
    return {
      items: items.map((item) => this.formatGalleryResponse(item)),
      total,
      page,
      limit,
    };
  }

  async findOneGallery(id: number): Promise<GalleryResponseDto> {
    const gallery = await this.galleryHelper.findOne(id);
    return this.formatGalleryResponse(gallery);
  }

  async updateGallery(id: number, updateGalleryDto: UpdateGalleryDto): Promise<GalleryResponseDto> {
    const updated = await this.galleryHelper.update(id, updateGalleryDto as Partial<Gallery>);
    return this.formatGalleryResponse(updated);
  }

  async removeGallery(id: number): Promise<void> {
    await this.galleryHelper.remove(id);
  }

  // ==================== 展示信息管理 ====================

  async createShowInfo(createShowInfoDto: CreateShowInfoDto): Promise<ShowInfoResponseDto> {
    const showInfo = this.showInfoRepository.create({
      ...createShowInfoDto,
      addtime: Math.floor(Date.now() / 1000),
    });
    const savedShowInfo = await this.showInfoRepository.save(showInfo);
    return this.formatShowInfoResponse(savedShowInfo);
  }

  async findAllShowInfos(query: QueryGalleryDto): Promise<ShowInfoListResponseDto> {
    const { page = 1, limit = 10, keyword, bid, sort = 'ord', order = 'ASC' } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.showInfoRepository.createQueryBuilder('showInfo');

    if (keyword) {
      queryBuilder.andWhere(
        '(showInfo.title LIKE :keyword OR showInfo.descs LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (bid !== undefined) {
      queryBuilder.andWhere('showInfo.bid = :bid', { bid });
    }

    queryBuilder.orderBy(`showInfo.${sort}`, order as 'ASC' | 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items: items.map((item) => this.formatShowInfoResponse(item)),
      total,
      page,
      limit,
    };
  }

  async findOneShowInfo(id: number): Promise<ShowInfoResponseDto> {
    const showInfo = await this.showInfoRepository.findOne({ where: { id } });
    if (!showInfo) {
      throw new NotFoundException('展示信息不存在');
    }
    return this.formatShowInfoResponse(showInfo);
  }

  async updateShowInfo(id: number, updateShowInfoDto: UpdateShowInfoDto): Promise<ShowInfoResponseDto> {
    const showInfo = await this.showInfoRepository.findOne({ where: { id } });
    if (!showInfo) {
      throw new NotFoundException('展示信息不存在');
    }

    Object.assign(showInfo, updateShowInfoDto);
    const updatedShowInfo = await this.showInfoRepository.save(showInfo);
    return this.formatShowInfoResponse(updatedShowInfo);
  }

  async removeShowInfo(id: number): Promise<void> {
    const showInfo = await this.showInfoRepository.findOne({ where: { id } });
    if (!showInfo) {
      throw new NotFoundException('展示信息不存在');
    }
    await this.showInfoRepository.remove(showInfo);
  }

  // ==================== 客户端接口 ====================

  /** 客户端列表查询（当前与 admin 一致，待 DB 添加 status 字段后加入 status=1 过滤） */
  async getGalleriesForClient(query: QueryGalleryDto): Promise<GalleryListResponseDto> {
    return this.findAllGalleries(query);
  }

  /** 客户端展示信息列表查询（当前与 admin 一致，待 DB 添加 status 字段后加入 status=1 过滤） */
  async getShowInfosForClient(query: QueryGalleryDto): Promise<ShowInfoListResponseDto> {
    return this.findAllShowInfos(query);
  }

  async getGalleryForClient(id: number): Promise<GalleryResponseDto> {
    return this.findOneGallery(id);
  }

  async getShowInfoForClient(id: number): Promise<ShowInfoResponseDto> {
    return this.findOneShowInfo(id);
  }

  // ==================== Gallery2 管理 ====================

  async findAllGallery2(query: QueryGalleryDto): Promise<Gallery2ListResponseDto> {
    const { items, total, page, limit } = await this.gallery2Helper.findAll(query, 'g2');
    return { items: items.map((i) => this.formatGallery2Response(i)), total, page, limit };
  }

  async findOneGallery2(id: number): Promise<Gallery2ResponseDto> {
    const item = await this.gallery2Helper.findOne(id);
    return this.formatGallery2Response(item);
  }

  async createGallery2(dto: Partial<Gallery2>): Promise<Gallery2ResponseDto> {
    const saved = await this.gallery2Helper.create(dto);
    return this.formatGallery2Response(saved);
  }

  async updateGallery2(id: number, dto: Partial<Gallery2>): Promise<Gallery2ResponseDto> {
    const saved = await this.gallery2Helper.update(id, dto);
    return this.formatGallery2Response(saved);
  }

  async removeGallery2(id: number): Promise<void> {
    await this.gallery2Helper.remove(id);
  }

  // ==================== Gallery3 管理 ====================

  async findAllGallery3(query: QueryGalleryDto): Promise<Gallery3ListResponseDto> {
    const { items, total, page, limit } = await this.gallery3Helper.findAll(query, 'g3');
    return { items: items.map((i) => this.formatGallery3Response(i)), total, page, limit };
  }

  async findOneGallery3(id: number): Promise<Gallery3ResponseDto> {
    const item = await this.gallery3Helper.findOne(id);
    return this.formatGallery3Response(item);
  }

  async createGallery3(dto: Partial<Gallery3>): Promise<Gallery3ResponseDto> {
    const saved = await this.gallery3Helper.create(dto);
    return this.formatGallery3Response(saved);
  }

  async updateGallery3(id: number, dto: Partial<Gallery3>): Promise<Gallery3ResponseDto> {
    const saved = await this.gallery3Helper.update(id, dto);
    return this.formatGallery3Response(saved);
  }

  async removeGallery3(id: number): Promise<void> {
    await this.gallery3Helper.remove(id);
  }

  // ==================== 格式化响应 ====================

  private formatGalleryResponse(gallery: Gallery): GalleryResponseDto {
    return {
      id: gallery.id,
      bid: gallery.bid,
      title: gallery.title,
      subtitle: gallery.subtitle,
      simg: gallery.simg,
      simg2: gallery.simg2,
      descs: gallery.descs,
      url: gallery.url,
      ord: gallery.ord,
      content: gallery.content,
      addtime: gallery.addtime,
      formatted_addtime: this.formatTimestamp(gallery.addtime),
    };
  }

  private formatGallery2Response(item: Gallery2): Gallery2ResponseDto {
    return {
      id: item.id, bid: item.bid, title: item.title, subtitle: item.subtitle,
      simg: item.simg, descs: item.descs, url: item.url, ord: item.ord,
      content: item.content, addtime: item.addtime,
      formatted_addtime: this.formatTimestamp(item.addtime),
    };
  }

  private formatGallery3Response(item: Gallery3): Gallery3ResponseDto {
    return {
      id: item.id, bid: item.bid, title: item.title, subtitle: item.subtitle,
      simg: item.simg, descs: item.descs, url: item.url, ord: item.ord,
      content: item.content, addtime: item.addtime,
      formatted_addtime: this.formatTimestamp(item.addtime),
    };
  }

  private formatShowInfoResponse(showInfo: ShowInfo): ShowInfoResponseDto {
    return {
      id: showInfo.id,
      bid: showInfo.bid,
      title: showInfo.title,
      subtitle: showInfo.subtitle,
      simg: showInfo.simg,
      descs: showInfo.descs,
      url: showInfo.url,
      ord: showInfo.ord,
      content: showInfo.content,
      addtime: showInfo.addtime,
      formatted_addtime: this.formatTimestamp(showInfo.addtime),
    };
  }

  private formatTimestamp(timestamp: number): string {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  }
}