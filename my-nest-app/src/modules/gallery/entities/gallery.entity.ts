import { Entity } from 'typeorm';
import { BaseGalleryEntity } from './base-gallery.entity';

@Entity('web_simgs')
export class Gallery extends BaseGalleryEntity {}