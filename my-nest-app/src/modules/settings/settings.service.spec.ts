import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Base } from './entities/base.entity';
import { Setting } from './entities/setting.entity';

describe('SettingsService', () => {
  let service: SettingsService;
  let baseRepository: Repository<Base>;
  let settingRepository: Repository<Setting>;

  const mockBase = {
    id: 1,
    title: '测试网站',
    keyword: '测试,关键词',
    descs: '测试描述',
    company: '测试公司',
    tel: '0755-12345678',
    phone: '13800138000',
    email: 'test@example.com',
    address: '深圳市测试区',
    fax: '',
    postcode: '',
    QQ: '',
    content: '',
    content2: '',
    QQName: '',
    isQQ: 0,
    hot_kwd: '',
    logo: '',
    wap_logo: '',
    ico_logo: '',
    video: '',
    toolscode_bottom: '',
    hot_online: '',
    download: '',
    toolscode_top: '',
    wap_content: '',
    keyreplace: '',
    send_email: '',
    weibo_simg: '',
    weixin_simg: '',
    douyin_simg: '',
    wxurl: '',
    wxappid: '',
    wxappsecret: '',
  };

  const mockSetting = {
    id: 1,
    is_banner: 1,
    is_banner_url: '',
    is_english_open: 0,
    is_wap_open: 1,
    is_wap_banner: 0,
    is_wap_banner_url: '',
    is_keyreplace: 1,
    is_tags: 1,
    is_open_cache: 1,
    is_open_close: 0,
    logo_size: '',
    banner_size: '',
    wap_banner_size: '',
    show_imgs_size: '',
  };

  const mockBaseRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockSettingRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getRepositoryToken(Base),
          useValue: mockBaseRepository,
        },
        {
          provide: getRepositoryToken(Setting),
          useValue: mockSettingRepository,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    baseRepository = module.get<Repository<Base>>(getRepositoryToken(Base));
    settingRepository = module.get<Repository<Setting>>(
      getRepositoryToken(Setting),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllSettings', () => {
    it('should return all settings', async () => {
      mockBaseRepository.findOne.mockResolvedValue(mockBase);
      mockSettingRepository.findOne.mockResolvedValue(mockSetting);

      const result = await service.getAllSettings();

      expect(result).toHaveProperty('base');
      expect(result).toHaveProperty('setting');
      expect(result.base.title).toBe('测试网站');
      expect(result.setting.is_banner).toBe(1);
      expect(mockBaseRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockSettingRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when base not found', async () => {
      mockBaseRepository.findOne.mockResolvedValue(null);
      mockSettingRepository.findOne.mockResolvedValue(mockSetting);

      await expect(service.getAllSettings()).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getAllSettings()).rejects.toThrow(
        '网站基础信息不存在',
      );
    });

    it('should throw NotFoundException when setting not found', async () => {
      mockBaseRepository.findOne.mockResolvedValue(mockBase);
      mockSettingRepository.findOne.mockResolvedValue(null);

      await expect(service.getAllSettings()).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getAllSettings()).rejects.toThrow(
        '系统设置不存在',
      );
    });
  });

  describe('getBase', () => {
    it('should return base information', async () => {
      mockBaseRepository.findOne.mockResolvedValue(mockBase);

      const result = await service.getBase();

      expect(result.title).toBe('测试网站');
      expect(result.company).toBe('测试公司');
      expect(mockBaseRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when base not found', async () => {
      mockBaseRepository.findOne.mockResolvedValue(null);

      await expect(service.getBase()).rejects.toThrow(NotFoundException);
      await expect(service.getBase()).rejects.toThrow('网站基础信息不存在');
    });
  });

  describe('updateBase', () => {
    it('should update existing base', async () => {
      const updateDto = {
        title: '更新后的标题',
        company: '更新后的公司',
      };

      const baseCopy = { ...mockBase };
      mockBaseRepository.findOne.mockResolvedValue(baseCopy);
      mockBaseRepository.save.mockResolvedValue({
        ...baseCopy,
        ...updateDto,
      });

      const result = await service.updateBase(updateDto);

      expect(result.title).toBe('更新后的标题');
      expect(result.company).toBe('更新后的公司');
      expect(mockBaseRepository.save).toHaveBeenCalled();
    });

    it('should create new base if not exists', async () => {
      const updateDto = {
        title: '新标题',
        company: '新公司',
      };

      mockBaseRepository.findOne.mockResolvedValue(null);
      mockBaseRepository.create.mockReturnValue({ id: 1, ...updateDto });
      mockBaseRepository.save.mockResolvedValue({ id: 1, ...updateDto });

      const result = await service.updateBase(updateDto);

      expect(mockBaseRepository.create).toHaveBeenCalledWith({
        id: 1,
        ...updateDto,
      });
      expect(mockBaseRepository.save).toHaveBeenCalled();
    });
  });

  describe('getSetting', () => {
    it('should return setting information', async () => {
      mockSettingRepository.findOne.mockResolvedValue(mockSetting);

      const result = await service.getSetting();

      expect(result.is_banner).toBe(1);
      expect(result.is_wap_open).toBe(1);
      expect(mockSettingRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when setting not found', async () => {
      mockSettingRepository.findOne.mockResolvedValue(null);

      await expect(service.getSetting()).rejects.toThrow(NotFoundException);
      await expect(service.getSetting()).rejects.toThrow('系统设置不存在');
    });
  });

  describe('updateSetting', () => {
    it('should update existing setting', async () => {
      const updateDto = {
        is_banner: 0,
        is_wap_open: 0,
      };

      mockSettingRepository.findOne.mockResolvedValue(mockSetting);
      mockSettingRepository.save.mockResolvedValue({
        ...mockSetting,
        ...updateDto,
      });

      const result = await service.updateSetting(updateDto);

      expect(result.is_banner).toBe(0);
      expect(result.is_wap_open).toBe(0);
      expect(mockSettingRepository.save).toHaveBeenCalled();
    });

    it('should create new setting if not exists', async () => {
      const updateDto = {
        is_banner: 1,
      };

      mockSettingRepository.findOne.mockResolvedValue(null);
      mockSettingRepository.create.mockReturnValue({ id: 1, ...updateDto });
      mockSettingRepository.save.mockResolvedValue({ id: 1, ...updateDto });

      const result = await service.updateSetting(updateDto);

      expect(mockSettingRepository.create).toHaveBeenCalledWith({
        id: 1,
        ...updateDto,
      });
      expect(mockSettingRepository.save).toHaveBeenCalled();
    });
  });

  describe('getSiteInfo', () => {
    it('should return public site information', async () => {
      // 重新设置 mock 数据，避免被之前的测试影响
      const freshMockBase = { ...mockBase };
      mockBaseRepository.findOne.mockResolvedValue(freshMockBase);

      const result = await service.getSiteInfo();

      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('keyword');
      expect(result).toHaveProperty('descs');
      expect(result).toHaveProperty('company');
      expect(result).not.toHaveProperty('QQ'); // 不应包含所有字段
      expect(result.title).toBe('测试网站');
    });

    it('should throw NotFoundException when base not found', async () => {
      mockBaseRepository.findOne.mockResolvedValue(null);

      await expect(service.getSiteInfo()).rejects.toThrow(NotFoundException);
      await expect(service.getSiteInfo()).rejects.toThrow(
        '网站基础信息不存在',
      );
    });
  });

  describe('updateAllSettings', () => {
    it('should update both base and setting', async () => {
      const baseDto = { title: '批量更新标题' };
      const settingDto = { is_banner: 0 };

      mockBaseRepository.findOne.mockResolvedValue(mockBase);
      mockSettingRepository.findOne.mockResolvedValue(mockSetting);
      mockBaseRepository.save.mockResolvedValue({ ...mockBase, ...baseDto });
      mockSettingRepository.save.mockResolvedValue({
        ...mockSetting,
        ...settingDto,
      });

      const result = await service.updateAllSettings(baseDto, settingDto);

      expect(result.base.title).toBe('批量更新标题');
      expect(result.setting.is_banner).toBe(0);
      expect(mockBaseRepository.save).toHaveBeenCalled();
      expect(mockSettingRepository.save).toHaveBeenCalled();
    });
  });
});
