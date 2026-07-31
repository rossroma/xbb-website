import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseGalleryEntity } from './entities/base-gallery.entity';
import { QueryGalleryDto } from './dto/query-gallery.dto';

/**
 * 泛型 Gallery CRUD 辅助类，消除 Gallery/Gallery2/Gallery3 的重复代码
 */
export class GalleryCrudHelper<T extends BaseGalleryEntity> {
  constructor(
    private readonly repository: Repository<T>,
    private readonly entityName: string,
  ) {}

  async findAll(
    query: QueryGalleryDto,
    alias: string,
  ): Promise<{ items: T[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, keyword, bid, sort = 'ord', order = 'ASC' } = query;
    const skip = (page - 1) * limit;

    const qb = this.repository.createQueryBuilder(alias);

    if (keyword) {
      qb.andWhere(
        `(${alias}.title LIKE :kw OR ${alias}.descs LIKE :kw)`,
        { kw: `%${keyword}%` },
      );
    }

    if (bid !== undefined) {
      qb.andWhere(`${alias}.bid = :bid`, { bid });
    }

    qb.orderBy(`${alias}.${sort}`, order as 'ASC' | 'DESC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, limit };
  }

  async findOne(id: number): Promise<T> {
    const item = await this.repository.findOne({ where: { id } as any });
    if (!item) {
      throw new NotFoundException(`${this.entityName}不存在`);
    }
    return item;
  }

  async create(dto: Partial<T>): Promise<T> {
    const item = this.repository.create({
      ...dto,
      addtime: Math.floor(Date.now() / 1000),
    } as T);
    return this.repository.save(item);
  }

  async update(id: number, dto: Partial<T>): Promise<T> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.repository.remove(item);
  }
}