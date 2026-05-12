import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

@Injectable()
export class TeacherModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async createModule(
    teacherId: number,
    title: string,
    subTitle: string,
    description: string,
    tags: string[],
  ) {
    if (!teacherId || !title || !subTitle || !description) {
      throw new BadRequestException('Tous les champs du module sont obligatoires');
    }

    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(teacherId) },
      select: { id: true },
    });

    if (!teacher) {
      throw new BadRequestException('Le prof associe est introuvable');
    }

    const cleanedTags = [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];

    // On cree d'abord le module, puis on rattache les tags existants ou nouvellement crees.
    const createdModule = await this.prisma.$transaction(async (tx) => {
      const module = await tx.module.create({
        data: {
          title: title.trim(),
          sub_title: subTitle.trim(),
          description: description.trim(),
          teacher_id: teacher.id,
        },
      });

      if (cleanedTags.length > 0) {
        for (const tagTitle of cleanedTags) {
          const existingTag = await tx.tag.findFirst({
            where: { title: tagTitle },
            select: { id: true, title: true },
          });

          const tag =
            existingTag ??
            (await tx.tag.create({
              data: { title: tagTitle },
            }));

          await tx.tagging.create({
            data: {
              module_id: module.id,
              tag_id: tag.id,
            },
          });
        }
      }

      return tx.module.findUnique({
        where: { id: module.id },
        include: {
          taggings: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              submodules: true,
            },
          },
        },
      });
    });

    return {
      id: createdModule?.id,
      title: createdModule?.title,
      subTitle: createdModule?.sub_title,
      description: createdModule?.description,
      teacherId: createdModule?.teacher_id,
      submodulesCount: createdModule?._count.submodules ?? 0,
      tags: createdModule?.taggings.map((tagging) => tagging.tag.title) ?? [],
      message: 'Module cree avec succes',
    };
  }

  async getTeacherModules(teacherId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { id: true },
    });

    if (!teacher) {
      throw new BadRequestException('Le prof n\'existe pas');
    }

    const modules = await this.prisma.module.findMany({
      where: { teacher_id: teacherId },
      orderBy: { creation_date: 'desc' },
      include: {
        taggings: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            submodules: true,
          },
        },
      },
    });

    return modules.map((module) => ({
      id: module.id,
      title: module.title,
      subTitle: module.sub_title,
      description: module.description,
      submodulesCount: module._count.submodules,
      tags: module.taggings.map((tagging) => tagging.tag.title),
    }));
  }
}
