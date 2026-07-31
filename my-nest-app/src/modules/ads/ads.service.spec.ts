import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AdsService } from './ads.service';
import { Ads } from './entities/ads.entity';
import { AdsType } from './entities/ads-type.entity';

describe('AdsService', () => {
  let service: AdsService;
  let adsRepository: Repository<Ads>;
  let adsTypeRepository: Repository<AdsType>;

  const mockAds = {
    id: 1,
    title: '测试广告',
    subtitle: '测试副标题',
    descs: '测试描述',
    bid: 1,
    url: 'https://example.com',
    ord: 1,
    simg: '/images/ad1.jpg',
    simg2: '',
    wap_simg: '',
    width_height: '1920x1080',
    hit: 100,
    download: '',
    content: '广告内容',
    target: '_blank',
  };

  const mockAdsType = {
    id: 1,
    title: '首页Banner',
    width_height: '1920x1080',
    wap_width_height: '750x400',
    simg2_width_height: '',
    ord: 1,
    content: '',
    wap_content: '',
    is_img: 1,
    is_img2: 0,
    is_img_wap: 1,
    is_download: 0,
    is_descs: 1,
    is_delete: 0,
    is_url: 1,
    is_subtitle: 1,
    is_content: 1,
    is_show: 1,
  };

  const mockAdsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  };

  const mockAdsTypeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdsService,
        {
          provide: getRepositoryToken(Ads),
          useValue: mockAdsRepository,
        },
        {
          provide: getRepositoryToken(AdsType),
          useValue: mockAdsTypeRepository,
        },
      ],
    }).compile();

    service = module.get<AdsService>(AdsService);
    adsRepository = module.get<Repository<Ads>>(getRepositoryToken(Ads));
    adsTypeRepository = module.get<Repository<AdsType>>(
      getRepositoryToken(AdsType),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAds', () => {
    it('should create a new ad', async () => {
      const createDto = {
        title: '新广告',
        bid: 1,
        url: 'https://example.com',
      };

      mockAdsRepository.create.mockReturnValue({ ...mockAds, ...createDto });
      mockAdsRepository.save.mockResolvedValue({ ...mockAds, ...createDto });

      const result = await service.createAds(createDto as any);

      expect(result.title).toBe('新广告');
      expect(mockAdsRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockAdsRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAllAds', () => {
    it('should return paginated ads list', async () => {
      const queryDto = { page: 1, limit: 10 };
      mockAdsRepository.findAndCount.mockResolvedValue([
        [mockAds],
        1,
      ]);

      const result = await service.findAllAds(queryDto as any);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should filter by title', async () => {
      const queryDto = { page: 1, limit: 10, title: '测试' };
      mockAdsRepository.findAndCount.mockResolvedValue([
        [mockAds],
        1,
      ]);

      await service.findAllAds(queryDto as any);

      expect(mockAdsRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOneAds', () => {
    it('should return an ad by id', async () => {
      mockAdsRepository.findOne.mockResolvedValue(mockAds);

      const result = await service.findOneAds(1);

      expect(result.title).toBe('测试广告');
      expect(mockAdsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when ad not found', async () => {
      mockAdsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneAds(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOneAds(999)).rejects.toThrow('广告 #999 不存在');
    });
  });

  describe('updateAds', () => {
    it('should update an ad', async () => {
      const updateDto = { title: '更新后的广告' };
      const adsCopy = { ...mockAds };

      mockAdsRepository.findOne.mockResolvedValue(adsCopy);
      mockAdsRepository.save.mockResolvedValue({
        ...adsCopy,
        ...updateDto,
      });

      const result = await service.updateAds(1, updateDto as any);

      expect(result.title).toBe('更新后的广告');
      expect(mockAdsRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when ad not found', async () => {
      mockAdsRepository.findOne.mockResolvedValue(null);

      await expect(service.updateAds(999, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeAds', () => {
    it('should delete an ad', async () => {
      mockAdsRepository.findOne.mockResolvedValue(mockAds);
      mockAdsRepository.remove.mockResolvedValue(mockAds);

      await service.removeAds(1);

      expect(mockAdsRepository.remove).toHaveBeenCalledWith(mockAds);
    });

    it('should throw NotFoundException when ad not found', async () => {
      mockAdsRepository.findOne.mockResolvedValue(null);

      await expect(service.removeAds(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAdsByPosition', () => {
    it('should return ads by position', async () => {
      mockAdsRepository.find.mockResolvedValue([mockAds]);

      const result = await service.findAdsByPosition(1);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('测试广告');
      expect(mockAdsRepository.find).toHaveBeenCalledWith({
        where: { bid: 1 },
        order: { ord: 'ASC', id: 'DESC' },
      });
    });
  });

  describe('createAdsType', () => {
    it('should create a new ads type', async () => {
      const createDto = {
        title: '新广告位',
        width_height: '1920x1080',
      };

      mockAdsTypeRepository.create.mockReturnValue({
        ...mockAdsType,
        ...createDto,
      });
      mockAdsTypeRepository.save.mockResolvedValue({
        ...mockAdsType,
        ...createDto,
      });

      const result = await service.createAdsType(createDto as any);

      expect(result.title).toBe('新广告位');
      expect(mockAdsTypeRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockAdsTypeRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAllAdsTypes', () => {
    it('should return all ads types', async () => {
      mockAdsTypeRepository.find.mockResolvedValue([mockAdsType]);

      const result = await service.findAllAdsTypes();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('首页Banner');
      expect(mockAdsTypeRepository.find).toHaveBeenCalledWith({
        where: { is_show: 1 },
        order: { ord: 'ASC', id: 'DESC' },
      });
    });
  });

  describe('findOneAdsType', () => {
    it('should return an ads type by id', async () => {
      mockAdsTypeRepository.findOne.mockResolvedValue(mockAdsType);

      const result = await service.findOneAdsType(1);

      expect(result.title).toBe('首页Banner');
      expect(mockAdsTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when ads type not found', async () => {
      mockAdsTypeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneAdsType(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOneAdsType(999)).rejects.toThrow(
        '广告位 #999 不存在',
      );
    });
  });

  describe('updateAdsType', () => {
    it('should update an ads type', async () => {
      const updateDto = { title: '更新后的广告位' };
      const adsTypeCopy = { ...mockAdsType };

      mockAdsTypeRepository.findOne.mockResolvedValue(adsTypeCopy);
      mockAdsTypeRepository.save.mockResolvedValue({
        ...adsTypeCopy,
        ...updateDto,
      });

      const result = await service.updateAdsType(1, updateDto as any);

      expect(result.title).toBe('更新后的广告位');
      expect(mockAdsTypeRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when ads type not found', async () => {
      mockAdsTypeRepository.findOne.mockResolvedValue(null);

      await expect(service.updateAdsType(999, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeAdsType', () => {
    it('should delete an ads type', async () => {
      mockAdsTypeRepository.findOne.mockResolvedValue(mockAdsType);
      mockAdsTypeRepository.remove.mockResolvedValue(mockAdsType);

      await service.removeAdsType(1);

      expect(mockAdsTypeRepository.remove).toHaveBeenCalledWith(mockAdsType);
    });

    it('should throw NotFoundException when ads type not found', async () => {
      mockAdsTypeRepository.findOne.mockResolvedValue(null);

      await expect(service.removeAdsType(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
