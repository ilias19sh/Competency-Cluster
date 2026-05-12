import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

type QuestionPayload = {
  value: string;
  answers: Array<{
    value: string;
    isGoodAnswer: boolean;
  }>;
};

@Injectable()
export class TeacherSubmodulesService {
  constructor(private readonly prisma: PrismaService) {}

  private sanitizeQuestions(questions: QuestionPayload[]) {
    return questions.map((question, questionIndex) => {
      const trimmedQuestion = question.value?.trim();
      const cleanedAnswers = question.answers
        ?.map((answer) => ({
          value: answer.value?.trim(),
          isGoodAnswer: Boolean(answer.isGoodAnswer),
        }))
        .filter((answer) => answer.value);

      if (!trimmedQuestion) {
        throw new BadRequestException(`La question ${questionIndex + 1} est vide`);
      }

      if (!cleanedAnswers?.length || cleanedAnswers.length < 2) {
        throw new BadRequestException(`La question ${questionIndex + 1} doit contenir au moins deux reponses`);
      }

      if (!cleanedAnswers.some((answer) => answer.isGoodAnswer)) {
        throw new BadRequestException(`La question ${questionIndex + 1} doit avoir au moins une bonne reponse`);
      }

      return {
        value: trimmedQuestion,
        answers: cleanedAnswers,
      };
    });
  }

  async createSubmodule(
    teacherId: number,
    moduleId: number,
    title: string,
    description: string,
    questions: QuestionPayload[] = [],
    program?: string | null,
    studyLevel?: string | null,
  ) {
    if (!teacherId || !moduleId || !title || !description) {
      throw new BadRequestException('Tous les champs du submodule sont obligatoires');
    }

    const module = await this.prisma.module.findFirst({
      where: {
        id: Number(moduleId),
        teacher_id: Number(teacherId),
      },
      select: {
        id: true,
        teacher_id: true,
        title: true,
      },
    });

    if (!module) {
      throw new BadRequestException('Le module selectionne est introuvable pour ce teacher');
    }

    const cleanedQuestions = this.sanitizeQuestions(questions);

    // Program et study level sont gardes pour la suite (notifications / ciblage),
    // mais ils ne sont pas encore stockes dans le schema actuel.
    void program;
    void studyLevel;

    const createdSubmodule = await this.prisma.$transaction(async (tx) => {
      const submodule = await tx.submodule.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          module_id: module.id,
        },
      });

      if (cleanedQuestions.length > 0) {
        for (const question of cleanedQuestions) {
          const createdQuestion = await tx.question.create({
            data: {
              value: question.value,
              level: 'standard',
              submodule_id: submodule.id,
            },
          });

          for (const answer of question.answers) {
            await tx.answer.create({
              data: {
                value: answer.value,
                isGoodAnswer: answer.isGoodAnswer,
                question_id: createdQuestion.id,
              },
            });
          }
        }
      }

      return tx.submodule.findUnique({
        where: { id: submodule.id },
        include: {
          module: {
            select: {
              id: true,
              title: true,
              sub_title: true,
            },
          },
          questions: {
            include: {
              answers: true,
            },
          },
        },
      });
    });

    return {
      id: createdSubmodule?.id,
      title: createdSubmodule?.title,
      description: createdSubmodule?.description,
      moduleId: createdSubmodule?.module.id,
      moduleTitle: createdSubmodule?.module.title,
      moduleSubTitle: createdSubmodule?.module.sub_title,
      questionsCount: createdSubmodule?.questions.length ?? 0,
      progress: 75,
      message:
        cleanedQuestions.length > 0
          ? 'Submodule cree avec succes'
          : 'Submodule cree avec succes, les questions pourront etre ajoutees ensuite',
    };
  }

  async getModuleSubmodules(moduleId: number) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true },
    });

    if (!module) {
      throw new BadRequestException('Le module demande est introuvable');
    }

    const submodules = await this.prisma.submodule.findMany({
      where: { module_id: moduleId },
      orderBy: { creation_date: 'desc' },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    return submodules.map((submodule) => ({
      id: submodule.id,
      title: submodule.title,
      description: submodule.description,
      questionsCount: submodule.questions.length,
      progress: 75,
    }));
  }

  async getSubmoduleById(submoduleId: number) {
    const submodule = await this.prisma.submodule.findUnique({
      where: { id: submoduleId },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            sub_title: true,
          },
        },
        questions: {
          include: {
            answers: true,
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
    });

    if (!submodule) {
      throw new BadRequestException('Le submodule demande est introuvable');
    }

    return {
      id: submodule.id,
      title: submodule.title,
      description: submodule.description,
      moduleId: submodule.module.id,
      moduleTitle: submodule.module.title,
      moduleSubTitle: submodule.module.sub_title,
      questions: submodule.questions.map((question) => ({
        id: question.id,
        value: question.value,
        answers: question.answers.map((answer) => ({
          id: answer.id,
          value: answer.value,
          isGoodAnswer: answer.isGoodAnswer,
        })),
      })),
    };
  }

  async updateSubmoduleQuestions(submoduleId: number, questions: QuestionPayload[]) {
    if (!questions?.length) {
      throw new BadRequestException('Au moins une question est obligatoire pour la mise a jour');
    }

    const submodule = await this.prisma.submodule.findUnique({
      where: { id: submoduleId },
      select: { id: true },
    });

    if (!submodule) {
      throw new BadRequestException('Le submodule a mettre a jour est introuvable');
    }

    const cleanedQuestions = this.sanitizeQuestions(questions);

    const updatedSubmodule = await this.prisma.$transaction(async (tx) => {
      const existingQuestions = await tx.question.findMany({
        where: { submodule_id: submoduleId },
        select: { id: true },
      });

      const existingQuestionIds = existingQuestions.map((question) => question.id);

      if (existingQuestionIds.length > 0) {
        await tx.answer.deleteMany({
          where: {
            question_id: {
              in: existingQuestionIds,
            },
          },
        });

        await tx.question.deleteMany({
          where: {
            id: {
              in: existingQuestionIds,
            },
          },
        });
      }

      for (const question of cleanedQuestions) {
        const createdQuestion = await tx.question.create({
          data: {
            value: question.value,
            level: 'standard',
            submodule_id: submoduleId,
          },
        });

        for (const answer of question.answers) {
          await tx.answer.create({
            data: {
              value: answer.value,
              isGoodAnswer: answer.isGoodAnswer,
              question_id: createdQuestion.id,
            },
          });
        }
      }

      return tx.submodule.findUnique({
        where: { id: submoduleId },
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
      });
    });

    return {
      id: updatedSubmodule?.id,
      questionsCount: updatedSubmodule?.questions.length ?? 0,
      message: 'Questions enregistrees avec succes',
    };
  }

  async getTeacherSubmodules(teacherId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { id: true },
    });

    if (!teacher) {
      throw new BadRequestException('Le teacher demande est introuvable');
    }

    const submodules = await this.prisma.submodule.findMany({
      where: {
        module: {
          teacher_id: teacherId,
        },
      },
      orderBy: { creation_date: 'desc' },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            sub_title: true,
          },
        },
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    return submodules.map((submodule) => ({
      id: submodule.id,
      title: submodule.title,
      description: submodule.description,
      moduleId: submodule.module.id,
      moduleTitle: submodule.module.title,
      moduleSubTitle: submodule.module.sub_title,
      questionsCount: submodule.questions.length,
      progress: 75,
    }));
  }
}
