import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseResponseDto, CaseDetailWithNavDto, CaseNavInfo, CaseListResponseDto } from './dto/case-response.dto';
import { BusinessException } from '../../common/exceptions/business.exception';
import { RESPONSE_CODE } from '../../common/constants/response-code';
import { Case } from './entities/case.entity';

/** 行业案例栏目 ID（web_category_type 中 id=18） */
const CASE_BID = 18;

@Injectable()
export class CaseService {
  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
  ) {}

  /** 查询案例列表（客户端） */
  async findAllForClient(
    page: number = 1,
    limit: number = 20,
    tag?: string,
  ): Promise<CaseListResponseDto> {
    const queryBuilder = this.caseRepository
      .createQueryBuilder('case')
      .where('case.bid = :bid', { bid: CASE_BID })
      .andWhere('case.status = :status', { status: 1 });

    // 按标签过滤
    if (tag) {
      queryBuilder.andWhere('case.tags LIKE :tag', { tag: `%${tag}%` });
    }

    // 排序：按发布时间降序
    queryBuilder
      .orderBy('case.addtime', 'DESC')
      .addOrderBy('case.ord', 'ASC')
      .addOrderBy('case.id', 'DESC');

    // 分页
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    return new CaseListResponseDto(items, total, page, limit);
  }

  /** 查询案例详情并附带上一篇/下一篇导航 + 3 个相关案例（客户端） */
  async findOneForClientWithNavigation(id: number): Promise<CaseDetailWithNavDto> {
    const caseEntity = await this.caseRepository.findOne({
      where: { id, bid: CASE_BID, status: 1 },
    });

    if (!caseEntity) {
      throw new BusinessException(
        RESPONSE_CODE.RESOURCE_NOT_FOUND,
        '案例不存在或已下线',
      );
    }

    // 增加访问量
    await this.caseRepository.update(id, {
      hit: () => 'hit + 1',
    });

    // 重新获取更新后的案例
    const updatedCase = await this.caseRepository.findOne({
      where: { id },
    });

    // 查询上一篇：同栏目下 addtime 更早（或同时但 id 更小）的最新一篇
    const prevCase = await this.caseRepository
      .createQueryBuilder('case')
      .where('case.bid = :bid', { bid: CASE_BID })
      .andWhere('case.status = :status', { status: 1 })
      .andWhere(
        '(case.addtime < :addtime OR (case.addtime = :addtime AND case.id < :id))',
        { addtime: caseEntity.addtime, id: caseEntity.id },
      )
      .orderBy('case.addtime', 'DESC')
      .addOrderBy('case.id', 'DESC')
      .getOne();

    // 查询下一篇：同栏目下 addtime 更晚（或同时但 id 更大）的最早一篇
    const nextCase = await this.caseRepository
      .createQueryBuilder('case')
      .where('case.bid = :bid', { bid: CASE_BID })
      .andWhere('case.status = :status', { status: 1 })
      .andWhere(
        '(case.addtime > :addtime OR (case.addtime = :addtime AND case.id > :id))',
        { addtime: caseEntity.addtime, id: caseEntity.id },
      )
      .orderBy('case.addtime', 'ASC')
      .addOrderBy('case.id', 'ASC')
      .getOne();

    // 查询 3 个相关案例（同栏目、同标签，排除当前案例，随机取）
    const tags = caseEntity.tags
      ? caseEntity.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];
    let relatedCases: Case[] = [];

    if (tags.length > 0) {
      const queryBuilder = this.caseRepository
        .createQueryBuilder('case')
        .where('case.bid = :bid', { bid: CASE_BID })
        .andWhere('case.status = :status', { status: 1 })
        .andWhere('case.id != :id', { id: caseEntity.id });

      // 同标签过滤：任一标签匹配即可
      queryBuilder.andWhere(
        tags.map((_, i) => `case.tags LIKE :tag${i}`).join(' OR '),
        Object.fromEntries(tags.map((tag, i) => [`tag${i}`, `%${tag}%`])),
      );

      relatedCases = await queryBuilder
        .orderBy('RAND()')
        .take(3)
        .getMany();
    }

    // 如果同标签相关案例不足 3 个，用同栏目其他案例补足
    if (relatedCases.length < 3) {
      const existingIds = [caseEntity.id, ...relatedCases.map((c) => c.id)];
      const fillCases = await this.caseRepository
        .createQueryBuilder('case')
        .where('case.bid = :bid', { bid: CASE_BID })
        .andWhere('case.status = :status', { status: 1 })
        .andWhere('case.id NOT IN (:...ids)', { ids: existingIds })
        .orderBy('RAND()')
        .take(3 - relatedCases.length)
        .getMany();
      relatedCases = [...relatedCases, ...fillCases];
    }

    const caseDto = new CaseResponseDto(updatedCase);
    const prev = prevCase ? new CaseNavInfo(prevCase) : null;
    const next = nextCase ? new CaseNavInfo(nextCase) : null;
    const relatedDtos = relatedCases.map((c) => new CaseResponseDto(c, false));

    return new CaseDetailWithNavDto(caseDto, prev, next, relatedDtos);
  }
}