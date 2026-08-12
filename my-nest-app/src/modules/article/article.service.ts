import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { ArticleResponseDto, ArticleListResponseDto, ArticleDetailWithNavDto, ArticleNavInfo } from './dto/article-response.dto';
import { BusinessException } from '../../common/exceptions/business.exception';
import { RESPONSE_CODE } from '../../common/constants/response-code';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) { }

  async create(createArticleDto: CreateArticleDto, publisherId?: number): Promise<ArticleResponseDto> {
    const article = this.articleRepository.create({
      ...createArticleDto,
      publisher_id: publisherId || 1,
      addtime: Math.floor(Date.now() / 1000),
      updatetime: Math.floor(Date.now() / 1000),
    });

    const savedArticle = await this.articleRepository.save(article);
    return new ArticleResponseDto(savedArticle);
  }

  async findAll(queryDto: QueryArticleDto): Promise<ArticleListResponseDto> {
    const { page = 1, limit = 10, title, bid, status, author, isRecommended, sortBy = 'addtime_desc' } = queryDto;

    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    // 默认排除回收站中的文章（status = -1），除非显式查询回收站状态
    if (status === undefined) {
      queryBuilder.andWhere('article.status != :trashStatus', { trashStatus: -1 });
    }

    // 应用过滤条件
    if (title) {
      queryBuilder.andWhere('article.title LIKE :title', { title: `%${title}%` });
    }
    if (bid !== undefined) {
      queryBuilder.andWhere('article.bid = :bid', { bid });
    }
    if (status !== undefined) {
      queryBuilder.andWhere('article.status = :status', { status });
    }
    if (author) {
      queryBuilder.andWhere('article.author LIKE :author', { author: `%${author}%` });
    }
    if (isRecommended !== undefined) {
      if (isRecommended === 1) {
        queryBuilder.andWhere('article.flag LIKE :flag', { flag: '%1%' });
      } else {
        queryBuilder.andWhere('(article.flag IS NULL OR article.flag NOT LIKE :flag)', { flag: '%1%' });
      }
    }

    // 动态排序
    switch (sortBy) {
      case 'addtime_asc':
        queryBuilder.orderBy('article.addtime', 'ASC').addOrderBy('article.id', 'ASC');
        break;
      case 'hit_desc':
        queryBuilder.orderBy('article.hit', 'DESC').addOrderBy('article.addtime', 'DESC');
        break;
      case 'hit_asc':
        queryBuilder.orderBy('article.hit', 'ASC').addOrderBy('article.addtime', 'DESC');
        break;
      case 'ord_asc':
        queryBuilder.orderBy('article.ord', 'ASC').addOrderBy('article.addtime', 'DESC');
        break;
      case 'ord_desc':
        queryBuilder.orderBy('article.ord', 'DESC').addOrderBy('article.addtime', 'DESC');
        break;
      case 'addtime_desc':
      default:
        queryBuilder.orderBy('article.addtime', 'DESC').addOrderBy('article.ord', 'ASC').addOrderBy('article.id', 'DESC');
        break;
    }

    // 分页
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return new ArticleListResponseDto(items, total, page, limit);
  }

  async findAllForClient(queryDto: QueryArticleDto): Promise<ArticleListResponseDto> {
    const { page = 1, limit = 10, title, bid, bids, isRecommended, sortBy = 'addtime_desc' } = queryDto;

    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    // 客户端只显示状态为1的文章
    queryBuilder.where('article.status = :status', { status: 1 });

    // 应用过滤条件
    if (title) {
      queryBuilder.andWhere('article.title LIKE :title', { title: `%${title}%` });
    }
    if (bid !== undefined) {
      queryBuilder.andWhere('article.bid = :bid', { bid });
    }
    if (bids) {
      const bidArray = bids.split(',').map(Number).filter((n) => !isNaN(n));
      if (bidArray.length > 0) {
        queryBuilder.andWhere('article.bid IN (:...bids)', { bids: bidArray });
      }
    }
    if (isRecommended !== undefined) {
      if (isRecommended === 1) {
        queryBuilder.andWhere('article.flag LIKE :flag', { flag: '%1%' });
      } else {
        queryBuilder.andWhere('(article.flag IS NULL OR article.flag NOT LIKE :flag)', { flag: '%1%' });
      }
    }

    // 动态排序
    switch (sortBy) {
      case 'addtime_asc':
        queryBuilder.orderBy('article.addtime', 'ASC').addOrderBy('article.id', 'ASC');
        break;
      case 'hit_desc':
        queryBuilder.orderBy('article.hit', 'DESC').addOrderBy('article.addtime', 'DESC');
        break;
      case 'hit_asc':
        queryBuilder.orderBy('article.hit', 'ASC').addOrderBy('article.addtime', 'DESC');
        break;
      case 'ord_asc':
        queryBuilder.orderBy('article.ord', 'ASC').addOrderBy('article.addtime', 'DESC');
        break;
      case 'ord_desc':
        queryBuilder.orderBy('article.ord', 'DESC').addOrderBy('article.addtime', 'DESC');
        break;
      case 'addtime_desc':
      default:
        queryBuilder.orderBy('article.addtime', 'DESC').addOrderBy('article.ord', 'ASC').addOrderBy('article.id', 'DESC');
        break;
    }

    // 分页
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return new ArticleListResponseDto(items, total, page, limit);
  }

  async findOne(id: number): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new BusinessException(
        RESPONSE_CODE.RESOURCE_NOT_FOUND,
        '文章不存在',
      );
    }

    return new ArticleResponseDto(article);
  }

  async findOneForClient(id: number): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.findOne({
      where: { id, status: 1 },
    });

    if (!article) {
      throw new BusinessException(
        RESPONSE_CODE.RESOURCE_NOT_FOUND,
        '文章不存在或已下线',
      );
    }

    // 增加访问量（异步，不阻塞响应）
    this.articleRepository.increment({ id }, 'hit', 1).catch(() => {});

    // 直接在内存中更新 hit，无需重新查库
    article.hit = (article.hit || 0) + 1;

    return new ArticleResponseDto(article);
  }

  /** 查询文章详情并附带上一篇/下一篇导航（客户端） */
  async findOneForClientWithNavigation(id: number): Promise<ArticleDetailWithNavDto> {
    const article = await this.articleRepository.findOne({
      where: { id, status: 1 },
    });

    if (!article) {
      throw new BusinessException(
        RESPONSE_CODE.RESOURCE_NOT_FOUND,
        '文章不存在或已下线',
      );
    }

    // 增加访问量（异步，不阻塞响应）
    this.articleRepository.increment({ id }, 'hit', 1).catch(() => {});
    article.hit = (article.hit || 0) + 1;

    // 查询上一篇：同分类下 addtime 更早（或同时但 id 更小）的最新一篇
    const prevArticle = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.status = :status', { status: 1 })
      .andWhere('article.bid = :bid', { bid: article.bid })
      .andWhere(
        '(article.addtime < :addtime OR (article.addtime = :addtime AND article.id < :id))',
        { addtime: article.addtime, id: article.id },
      )
      .orderBy('article.addtime', 'DESC')
      .addOrderBy('article.id', 'DESC')
      .getOne();

    // 查询下一篇：同分类下 addtime 更晚（或同时但 id 更大）的最早一篇
    const nextArticle = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.status = :status', { status: 1 })
      .andWhere('article.bid = :bid', { bid: article.bid })
      .andWhere(
        '(article.addtime > :addtime OR (article.addtime = :addtime AND article.id > :id))',
        { addtime: article.addtime, id: article.id },
      )
      .orderBy('article.addtime', 'ASC')
      .addOrderBy('article.id', 'ASC')
      .getOne();

    const articleDto = new ArticleResponseDto(article);
    const prev = prevArticle ? new ArticleNavInfo(prevArticle) : null;
    const next = nextArticle ? new ArticleNavInfo(nextArticle) : null;

    return new ArticleDetailWithNavDto(articleDto, prev, next);
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new BusinessException(
        RESPONSE_CODE.RESOURCE_NOT_FOUND,
        '文章不存在',
      );
    }

    // 更新文章
    await this.articleRepository.update(id, {
      ...updateArticleDto,
      updatetime: Math.floor(Date.now() / 1000),
    });

    const updatedArticle = await this.articleRepository.findOne({
      where: { id },
    });

    return new ArticleResponseDto(updatedArticle);
  }

  /** 软删除：移入回收站（status = -1） */
  async remove(id: number): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new BusinessException(
        RESPONSE_CODE.RESOURCE_NOT_FOUND,
        '文章不存在',
      );
    }

    // 检查是否允许删除
    if (article.is_delete === 1) {
      throw new BusinessException(
        RESPONSE_CODE.FORBIDDEN,
        '该文章不允许删除',
      );
    }

    await this.articleRepository.update(id, {
      status: -1,
      updatetime: Math.floor(Date.now() / 1000),
    });
  }

  /** 从回收站恢复（status = 1） */
  async restore(id: number): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { id, status: -1 },
    });

    if (!article) {
      throw new BusinessException(
        RESPONSE_CODE.RESOURCE_NOT_FOUND,
        '回收站中未找到该文章',
      );
    }

    await this.articleRepository.update(id, {
      status: 1,
      updatetime: Math.floor(Date.now() / 1000),
    });
  }

  /** 物理删除 */
  async permanentDelete(id: number): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new BusinessException(
        RESPONSE_CODE.RESOURCE_NOT_FOUND,
        '文章不存在',
      );
    }

    if (article.is_delete === 1) {
      throw new BusinessException(
        RESPONSE_CODE.FORBIDDEN,
        '该文章不允许删除',
      );
    }

    await this.articleRepository.delete(id);
  }

  /** 批量恢复 */
  async batchRestore(ids: number[]): Promise<number> {
    if (!ids.length) return 0;

    const result = await this.articleRepository
      .createQueryBuilder()
      .update()
      .set({ status: 1, updatetime: Math.floor(Date.now() / 1000) })
      .where('id IN (:...ids)', { ids })
      .andWhere('status = :status', { status: -1 })
      .execute();

    return result.affected || 0;
  }

  /** 批量移入回收站（软删除） */
  async batchTrash(ids: number[]): Promise<number> {
    if (!ids.length) return 0;

    const result = await this.articleRepository
      .createQueryBuilder()
      .update()
      .set({ status: -1, updatetime: Math.floor(Date.now() / 1000) })
      .where('id IN (:...ids)', { ids })
      .execute();

    return result.affected || 0;
  }

  /** 批量物理删除 */
  async batchPermanentDelete(ids: number[]): Promise<number> {
    if (!ids.length) return 0;

    const result = await this.articleRepository
      .createQueryBuilder()
      .delete()
      .where('id IN (:...ids)', { ids })
      .execute();

    return result.affected || 0;
  }

  /** 获取所有分类的文章数量统计（按 bid 分组，排除回收站） */
  async getArticleCounts(): Promise<Record<number, number>> {
    const result = await this.articleRepository
      .createQueryBuilder('article')
      .select('article.bid', 'bid')
      .addSelect('COUNT(article.id)', 'count')
      .where('article.status != :trashStatus', { trashStatus: -1 })
      .groupBy('article.bid')
      .getRawMany<{ bid: number; count: string }>()

    const counts: Record<number, number> = {}
    for (const row of result) {
      counts[row.bid] = parseInt(row.count, 10)
    }
    return counts
  }
}