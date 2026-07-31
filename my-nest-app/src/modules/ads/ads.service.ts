import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Ads } from './entities/ads.entity';
import { AdsType } from './entities/ads-type.entity';
import { CreateAdsDto } from './dto/create-ads.dto';
import { UpdateAdsDto } from './dto/update-ads.dto';
import { CreateAdsTypeDto } from './dto/create-ads-type.dto';
import { UpdateAdsTypeDto } from './dto/update-ads-type.dto';
import { QueryAdsDto } from './dto/query-ads.dto';
import { AdsResponseDto, AdsTypeResponseDto } from './dto/ads-response.dto';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ads)
    private adsRepository: Repository<Ads>,
    @InjectRepository(AdsType)
    private adsTypeRepository: Repository<AdsType>,
  ) { }

  // ==================== 广告管理 ====================

  async createAds(createAdsDto: CreateAdsDto): Promise<AdsResponseDto> {
    const ads = this.adsRepository.create(createAdsDto);
    const saved = await this.adsRepository.save(ads);
    return this.formatAdsResponse(saved);
  }

  async findAllAds(query: QueryAdsDto): Promise<{
    items: AdsResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, title, bid, sortBy = 'id_desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (title) where.title = Like(`%${title}%`);
    if (bid) where.bid = bid;

    const orderMap: Record<string, object> = {
      id_desc: { id: 'DESC' },
      id_asc: { id: 'ASC' },
      ord_asc: { ord: 'ASC', id: 'DESC' },
      ord_desc: { ord: 'DESC', id: 'DESC' },
    };
    const order = orderMap[sortBy] ?? { id: 'DESC' };

    const [items, total] = await this.adsRepository.findAndCount({
      where,
      order,
      skip,
      take: limit,
    });

    return {
      items: items.map((item) => this.formatAdsResponse(item)),
      total,
      page,
      limit,
    };
  }

  async findOneAds(id: number): Promise<AdsResponseDto> {
    const ads = await this.adsRepository.findOne({ where: { id } });
    if (!ads) {
      throw new NotFoundException(`广告 #${id} 不存在`);
    }
    return this.formatAdsResponse(ads);
  }

  async updateAds(
    id: number,
    updateAdsDto: UpdateAdsDto,
  ): Promise<AdsResponseDto> {
    const ads = await this.adsRepository.findOne({ where: { id } });
    if (!ads) {
      throw new NotFoundException(`广告 #${id} 不存在`);
    }

    Object.assign(ads, updateAdsDto);
    const updated = await this.adsRepository.save(ads);
    return this.formatAdsResponse(updated);
  }

  async removeAds(id: number): Promise<void> {
    const ads = await this.adsRepository.findOne({ where: { id } });
    if (!ads) {
      throw new NotFoundException(`广告 #${id} 不存在`);
    }
    await this.adsRepository.remove(ads);
  }

  // ==================== 广告位管理 ====================

  async createAdsType(
    createAdsTypeDto: CreateAdsTypeDto,
  ): Promise<AdsTypeResponseDto> {
    const adsType = this.adsTypeRepository.create(createAdsTypeDto);
    const saved = await this.adsTypeRepository.save(adsType);
    return this.formatAdsTypeResponse(saved);
  }

  async findAllAdsTypes(page = 1, limit = 10, sortBy = 'id_desc'): Promise<{ items: AdsTypeResponseDto[]; total: number; page: number; limit: number }> {
    const orderMap: Record<string, object> = {
      id_desc: { id: 'DESC' },
      id_asc: { id: 'ASC' },
      ord_asc: { ord: 'ASC', id: 'DESC' },
      ord_desc: { ord: 'DESC', id: 'DESC' },
    };
    const order = orderMap[sortBy] ?? { id: 'DESC' };
    const skip = (page - 1) * limit;
    const [items, total] = await this.adsTypeRepository.findAndCount({
      where: { is_show: 1 },
      order,
      skip,
      take: limit,
    });
    return { items: items.map((item) => this.formatAdsTypeResponse(item)), total, page, limit };
  }

  async findOneAdsType(id: number): Promise<AdsTypeResponseDto> {
    const adsType = await this.adsTypeRepository.findOne({ where: { id } });
    if (!adsType) {
      throw new NotFoundException(`广告位 #${id} 不存在`);
    }
    return this.formatAdsTypeResponse(adsType);
  }

  async updateAdsType(
    id: number,
    updateAdsTypeDto: UpdateAdsTypeDto,
  ): Promise<AdsTypeResponseDto> {
    const adsType = await this.adsTypeRepository.findOne({ where: { id } });
    if (!adsType) {
      throw new NotFoundException(`广告位 #${id} 不存在`);
    }

    Object.assign(adsType, updateAdsTypeDto);
    const updated = await this.adsTypeRepository.save(adsType);
    return this.formatAdsTypeResponse(updated);
  }

  async removeAdsType(id: number): Promise<void> {
    const adsType = await this.adsTypeRepository.findOne({ where: { id } });
    if (!adsType) {
      throw new NotFoundException(`广告位 #${id} 不存在`);
    }
    await this.adsTypeRepository.remove(adsType);
  }

  // ==================== 客户端接口 ====================

  async findAdsByPosition(position: number): Promise<AdsResponseDto[]> {
    const ads = await this.adsRepository.find({
      where: { bid: position },
      order: { ord: 'ASC', id: 'DESC' },
    });
    return ads.map((item) => this.formatAdsResponse(item));
  }

  // ==================== 辅助方法 ====================

  private formatAdsResponse(ads: Ads): AdsResponseDto {
    return {
      id: ads.id,
      title: ads.title,
      subtitle: ads.subtitle,
      descs: ads.descs,
      bid: ads.bid,
      url: ads.url,
      ord: ads.ord,
      simg: ads.simg,
      simg2: ads.simg2,
      wap_simg: ads.wap_simg,
      width_height: ads.width_height,
      hit: ads.hit,
      download: ads.download,
      content: ads.content,
      target: ads.target,
    };
  }

  private formatAdsTypeResponse(adsType: AdsType): AdsTypeResponseDto {
    return {
      id: adsType.id,
      title: adsType.title,
      width_height: adsType.width_height,
      wap_width_height: adsType.wap_width_height,
      simg2_width_height: adsType.simg2_width_height,
      ord: adsType.ord,
      content: adsType.content,
      wap_content: adsType.wap_content,
      is_img: adsType.is_img,
      is_img2: adsType.is_img2,
      is_img_wap: adsType.is_img_wap,
      is_download: adsType.is_download,
      is_descs: adsType.is_descs,
      is_delete: adsType.is_delete,
      is_url: adsType.is_url,
      is_subtitle: adsType.is_subtitle,
      is_content: adsType.is_content,
      is_show: adsType.is_show,
    };
  }
}
