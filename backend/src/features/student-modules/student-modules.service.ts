import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

@Injectable()
export class StudentModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentModules(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: {
            school_id: true,
          },
        },
      },
    });

    if (!student) {
      throw new BadRequestException('Le student demande est introuvable');
    }

    const modules = await this.prisma.module.findMany({
      where: {
        teacher: {
          user: {
            school_id: student.user.school_id,
          },
        },
      },
      orderBy: {
        creation_date: 'desc',
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
              },
            },
          },
        },
        submodules: {
          orderBy: {
            creation_date: 'desc',
          },
          include: {
            _count: {
              select: {
                questions: true,
              },
            },
          },
        },
        taggings: {
          include: {
            tag: true,
          },
        },
      },
    });

    return modules.map((module) => ({
      id: module.id,
      title: module.title,
      subTitle: module.sub_title,
      description: module.description,
      teacher: {
        id: module.teacher_id,
        firstName: module.teacher.user.first_name,
        lastName: module.teacher.user.last_name,
        email: module.teacher.user.email,
      },
      tags: module.taggings.map((tagging) => tagging.tag.title),
      submodules: module.submodules.map((submodule) => ({
        id: submodule.id,
        title: submodule.title,
        description: submodule.description,
        questionsCount: submodule._count.questions,
      })),
    }));
  }
}
