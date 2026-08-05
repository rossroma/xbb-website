import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Base } from './entities/base.entity';
import { Setting } from './entities/setting.entity';
import { UpdateBaseDto } from './dto/update-base.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import {
  BaseResponseDto,
  SettingResponseDto,
  AllSettingsResponseDto,
  SiteInfoResponseDto,
} from './dto/settings-response.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Base)
    private baseRepository: Repository<Base>,
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  // ==================== 获取所有配置 ====================

  async getAllSettings(): Promise<AllSettingsResponseDto> {
    const base = await this.baseRepository.findOne({ where: { id: 1 } });
    const setting = await this.settingRepository.findOne({ where: { id: 1 } });

    if (!base) {
      throw new NotFoundException('网站基础信息不存在');
    }

    if (!setting) {
      throw new NotFoundException('系统设置不存在');
    }

    return {
      base: this.formatBaseResponse(base),
      setting: this.formatSettingResponse(setting),
    };
  }

  // ==================== 批量更新配置 ====================

  async updateAllSettings(
    baseDto: UpdateBaseDto,
    settingDto: UpdateSettingDto,
  ): Promise<AllSettingsResponseDto> {
    // 更新基础信息
    let base = await this.baseRepository.findOne({ where: { id: 1 } });
    if (!base) {
      // 如果不存在，创建新记录
      base = this.baseRepository.create({ id: 1, ...baseDto });
    } else {
      Object.assign(base, baseDto);
    }
    const updatedBase = await this.baseRepository.save(base);
    await this.cacheManager.del('settings:siteInfo');

    // 更新系统设置
    let setting = await this.settingRepository.findOne({ where: { id: 1 } });
    if (!setting) {
      // 如果不存在，创建新记录
      setting = this.settingRepository.create({ id: 1, ...settingDto });
    } else {
      Object.assign(setting, settingDto);
    }
    const updatedSetting = await this.settingRepository.save(setting);

    return {
      base: this.formatBaseResponse(updatedBase),
      setting: this.formatSettingResponse(updatedSetting),
    };
  }

  // ==================== 获取基础信息 ====================

  async getBase(): Promise<BaseResponseDto> {
    const base = await this.baseRepository.findOne({ where: { id: 1 } });
    if (!base) {
      throw new NotFoundException('网站基础信息不存在');
    }
    return this.formatBaseResponse(base);
  }

  // ==================== 更新基础信息 ====================

  async updateBase(updateBaseDto: UpdateBaseDto): Promise<BaseResponseDto> {
    let base = await this.baseRepository.findOne({ where: { id: 1 } });
    if (!base) {
      base = this.baseRepository.create({ id: 1, ...updateBaseDto });
    } else {
      Object.assign(base, updateBaseDto);
    }
    const updated = await this.baseRepository.save(base);
    await this.cacheManager.del('settings:siteInfo');
    return this.formatBaseResponse(updated);
  }

  // ==================== 获取系统设置 ====================

  async getSetting(): Promise<SettingResponseDto> {
    const setting = await this.settingRepository.findOne({ where: { id: 1 } });
    if (!setting) {
      throw new NotFoundException('系统设置不存在');
    }
    return this.formatSettingResponse(setting);
  }

  // ==================== 更新系统设置 ====================

  async updateSetting(
    updateSettingDto: UpdateSettingDto,
  ): Promise<SettingResponseDto> {
    let setting = await this.settingRepository.findOne({ where: { id: 1 } });
    if (!setting) {
      setting = this.settingRepository.create({ id: 1, ...updateSettingDto });
    } else {
      Object.assign(setting, updateSettingDto);
    }
    const updated = await this.settingRepository.save(setting);
    await this.cacheManager.del('settings:siteInfo');
    return this.formatSettingResponse(updated);
  }

  // ==================== 客户端获取网站信息 ====================

  async getSiteInfo(): Promise<SiteInfoResponseDto> {
    const cacheKey = 'settings:siteInfo';
    const cached = await this.cacheManager.get<SiteInfoResponseDto>(cacheKey);
    if (cached) return cached;

    const base = await this.baseRepository.findOne({ where: { id: 1 } });
    if (!base) {
      throw new NotFoundException('网站基础信息不存在');
    }

    const result = {
      title: base.title,
      keyword: base.keyword,
      descs: base.descs,
      company: base.company,
      logo: base.logo,
      wap_logo: base.wap_logo,
      ico_logo: base.ico_logo,
      tel: base.tel,
      phone: base.phone,
      email: base.email,
      address: base.address,
      fax: base.fax,
      postcode: base.postcode,
      content2: base.content2,
      toolscode_top: base.toolscode_top,
      toolscode_bottom: base.toolscode_bottom,
    };
    await this.cacheManager.set(cacheKey, result, 3_600_000); // 1 小时
    return result;
  }

  // ==================== 辅助方法 ====================

  private formatBaseResponse(base: Base): BaseResponseDto {
    return {
      id: base.id,
      title: base.title,
      keyword: base.keyword,
      descs: base.descs,
      QQ: base.QQ,
      content: base.content,
      content2: base.content2,
      QQName: base.QQName,
      isQQ: base.isQQ,
      hot_kwd: base.hot_kwd,
      company: base.company,
      logo: base.logo,
      wap_logo: base.wap_logo,
      ico_logo: base.ico_logo,
      tel: base.tel,
      address: base.address,
      video: base.video,
      toolscode_bottom: base.toolscode_bottom,
      phone: base.phone,
      fax: base.fax,
      email: base.email,
      postcode: base.postcode,
      hot_online: base.hot_online,
      download: base.download,
      toolscode_top: base.toolscode_top,
      wap_content: base.wap_content,
      keyreplace: base.keyreplace,
      send_email: base.send_email,
      weibo_simg: base.weibo_simg,
      weixin_simg: base.weixin_simg,
      douyin_simg: base.douyin_simg,
      wxurl: base.wxurl,
      wxappid: base.wxappid,
      wxappsecret: base.wxappsecret,
    };
  }

  private formatSettingResponse(setting: Setting): SettingResponseDto {
    return {
      id: setting.id,
      is_banner: setting.is_banner,
      is_banner_url: setting.is_banner_url,
      is_english_open: setting.is_english_open,
      is_wap_open: setting.is_wap_open,
      is_wap_banner: setting.is_wap_banner,
      is_wap_banner_url: setting.is_wap_banner_url,
      is_keyreplace: setting.is_keyreplace,
      is_tags: setting.is_tags,
      is_open_cache: setting.is_open_cache,
      is_open_close: setting.is_open_close,
      logo_size: setting.logo_size,
      banner_size: setting.banner_size,
      wap_banner_size: setting.wap_banner_size,
      show_imgs_size: setting.show_imgs_size,
    };
  }

  }
