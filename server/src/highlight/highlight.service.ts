import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { Highlight } from '.prisma/client';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';

@Injectable()
export class HighlightService {
  constructor(private readonly prismaService: PrismaService) {}

  async createHighlight(
    createHighlightDto: CreateHighlightDto,
  ): Promise<Highlight> {
    const result = await this.prismaService.highlight.create({
      data: {
        feed_id: createHighlightDto.feed_id,
        user_email: createHighlightDto.user_email,
        selection: {},
      },
    });

    return result;
  }

  async findHighlight(id: number): Promise<Highlight> {
    const result = await this.prismaService.highlight.findUnique({
      where: { id: id },
    });

    if (!result) {
      throw new NotFoundException(`Can't find highlight with id ${id}`);
    }

    return result;
  }

  async findAllHighlightInFeed(feed_id: number): Promise<Highlight[]> {
    const result = await this.prismaService.highlight.findMany({
      where: { id: feed_id },
    });

    return result;
  }

  async updateHighlight(
    id: number,
    updateHighlightDto: UpdateHighlightDto,
  ): Promise<Highlight> {
    const result = await this.prismaService.highlight.update({
      where: { id: id },
      data: updateHighlightDto,
    });

    return result;
  }

  async deleteHighlight(id: number): Promise<Highlight> {
    return this.prismaService.highlight.delete({ where: { id: id } });
  }
}
