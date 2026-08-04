import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto, CategoryListResponseDto } from './dto/category-response.dto';
import { BusinessException } from '../../common/exceptions/business.exception';
import { RESPONSE_CODE } from '../../common/constants/response-code';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // 检查英文名称是否已存在
    const existingCategory = await this.categoryRepository.findOne({
      where: { english: createCategoryDto.english },
    });

    if (existingCategory) {
      throw new BusinessException(
        RESPONSE_CODE.VALIDATION_ERROR,
        '英文名称已存在',
      );
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      addtime: Math.floor(Date.now() / 1000),
      updatetime: Math.floor(Date.now() / 1000),
    });

    const savedCategory = await this.categoryRepository.save(category);
    return new CategoryResponseDto(savedCategory);
  }

  async findAll(keyword?: string, page = 1, limit = 10, sortBy = 'ord_asc'): Promise<CategoryListResponseDto & { total: number; page: number; limit: number }> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    if (keyword && keyword.trim()) {
      queryBuilder.where(
        'category.title LIKE :keyword OR category.english LIKE :keyword OR category.descs LIKE :keyword',
        { keyword: `%${keyword.trim()}%` }
      );
    }

    const orderMap: Record<string, [string, 'ASC' | 'DESC']> = {
      id_desc: ['category.id', 'DESC'],
      id_asc: ['category.id', 'ASC'],
      ord_asc: ['category.ord', 'ASC'],
      ord_desc: ['category.ord', 'DESC'],
    };
    const [field, dir] = orderMap[sortBy] ?? ['category.ord', 'ASC'];

    const skip = (page - 1) * limit;
    const [categories, total] = await queryBuilder
      .orderBy(field, dir)
      .addOrderBy('category.id', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { ...new CategoryListResponseDto(categories, total), total, page, limit };
  }

  async findAllForClient(includeAll = false): Promise<CategoryListResponseDto> {
    const where: Record<string, number> = { status: 1 };
    if (!includeAll) {
      where.is_nav = 1;
    }

    const categories = await this.categoryRepository.find({
      where,
      order: {
        ord: 'ASC',
        id: 'ASC',
      },
    });

    return new CategoryListResponseDto(categories, categories.length);
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new BusinessException(
        RESPONSE_CODE.RESOURCE_NOT_FOUND,
        '栏目不存在',
      );
    }

    return new CategoryResponseDto(category);
  }

  async findOneBySlugForClient(slug: string): Promise<CategoryResponseDto> {
    const normalized = (slug || '').trim();
    if (!normalized) {
      throw new BusinessException(RESPONSE_CODE.VALIDATION_ERROR, '栏目标识不能为空');
    }

    const category = await this.findEnabledCategoryBySlug(normalized);
    if (!category) {
      throw new BusinessException(RESPONSE_CODE.RESOURCE_NOT_FOUND, '栏目不存在或已下线');
    }

    return new CategoryResponseDto(category);
  }

  /** 供内部模块调用的原始实体查询 — 返回 Category 实体 */
  async findEnabledCategoryBySlug(slug: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { english: slug.trim(), status: 1 },
    });
  }

  /** 获取指定父类目下所有已启用子类目的 ID 列表 */
  async findChildBidIds(parentId: number): Promise<number[]> {
    const children = await this.categoryRepository.find({
      where: { pid: parentId, status: 1 },
      select: ['id'],
    });
    return children.map((c) => c.id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new BusinessException(
        RESPONSE_CODE.RESOURCE_NOT_FOUND,
        '栏目不存在',
      );
    }

    // 如果更新英文名称，检查是否与其他栏目冲突
    if (updateCategoryDto.english && updateCategoryDto.english !== category.english) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { english: updateCategoryDto.english },
      });

      if (existingCategory) {
        throw new BusinessException(
          RESPONSE_CODE.VALIDATION_ERROR,
          '英文名称已存在',
        );
      }
    }

    await this.categoryRepository.update(id, {
      ...updateCategoryDto,
      updatetime: Math.floor(Date.now() / 1000),
    });

    const updatedCategory = await this.categoryRepository.findOne({
      where: { id },
    });

    return new CategoryResponseDto(updatedCategory);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new BusinessException(
        RESPONSE_CODE.RESOURCE_NOT_FOUND,
        '栏目不存在',
      );
    }

    // 检查是否允许删除
    if (category.is_delete === 0) {
      throw new BusinessException(
        RESPONSE_CODE.FORBIDDEN,
        '该栏目不允许删除',
      );
    }

    // 检查是否有子栏目
    const childCategories = await this.categoryRepository.count({
      where: { pid: id },
    });

    if (childCategories > 0) {
      throw new BusinessException(
        RESPONSE_CODE.FORBIDDEN,
        '该栏目下还有子栏目，不能删除',
      );
    }

    await this.categoryRepository.delete(id);
  }
}
