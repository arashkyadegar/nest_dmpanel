import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMapDto } from './create-map.dto';
import { MapEntity } from './map.entity';
// import { MapRepository } from './maps.repository';
import { Repository } from 'typeorm';

@Injectable()
export class MapsService {
  constructor(
    @InjectRepository(MapEntity)
    private mapRepository: Repository<MapEntity>,
  ) {}

  async createMap(createMapDto: CreateMapDto): Promise<CreateMapDto> {
    const map = this.mapRepository.create(createMapDto);

    return await this.mapRepository.save(map);
  }

  async findAll(): Promise<CreateMapDto[]> {
    return [];
    //return await this.mapRepository.find();
  }
}
