import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

type StudentQuizAnswerPayload = {
  questionId: number;
  answerId?: number;
  answerIds?: number[];
};

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

  async getStudentProfile(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: Number(studentId) },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
        promo: {
          include: {
            program: {
              select: {
                title: true,
              },
            },
          },
        },
        attempts: {
          orderBy: {
            creation_date: 'desc',
          },
          include: {
            submodule: {
              select: {
                title: true,
              },
            },
          },
          take: 5,
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
    });

    if (!student) {
      throw new BadRequestException('Le student demande est introuvable');
    }

    const averageScore =
      student.attempts.length > 0
        ? Math.round(student.attempts.reduce((total, attempt) => total + attempt.score, 0) / student.attempts.length)
        : 0;

    return {
      id: student.id,
      firstName: student.user.first_name,
      lastName: student.user.last_name,
      email: student.user.email,
      phone: student.user.phone,
      points: student.points,
      program: student.promo.program.title,
      studyLevel: student.promo.study_year,
      promo: student.promo.title,
      attemptsCount: student._count.attempts,
      averageScore,
      recentAttempts: student.attempts.map((attempt) => ({
        id: attempt.id,
        score: attempt.score,
        submoduleTitle: attempt.submodule.title,
        earnedElos: Math.round(attempt.score * 0.26),
      })),
    };
  }

  async getSubmoduleQuiz(studentId: number, submoduleId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: Number(studentId) },
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

    const submodule = await this.prisma.submodule.findFirst({
      where: {
        id: Number(submoduleId),
        module: {
          teacher: {
            user: {
              school_id: student.user.school_id,
            },
          },
        },
      },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            sub_title: true,
          },
        },
        questions: {
          orderBy: {
            id: 'asc',
          },
          include: {
            answers: {
              orderBy: {
                id: 'asc',
              },
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
      },
    });

    if (!submodule) {
      throw new BadRequestException('Le quiz demande est introuvable pour ce student');
    }

    return {
      id: submodule.id,
      title: submodule.title,
      description: submodule.description,
      module: {
        id: submodule.module.id,
        title: submodule.module.title,
        subTitle: submodule.module.sub_title,
      },
      questions: submodule.questions.map((question) => ({
        id: question.id,
        value: question.value,
        answers: question.answers.map((answer) => ({
          id: answer.id,
          value: answer.value,
        })),
      })),
    };
  }

  async submitSubmoduleQuiz(studentId: number, submoduleId: number, answers: StudentQuizAnswerPayload[]) {
    if (!answers?.length) {
      throw new BadRequestException('Au moins une reponse est obligatoire');
    }

    const student = await this.prisma.student.findUnique({
      where: { id: Number(studentId) },
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

    const submodule = await this.prisma.submodule.findFirst({
      where: {
        id: Number(submoduleId),
        module: {
          teacher: {
            user: {
              school_id: student.user.school_id,
            },
          },
        },
      },
      include: {
        questions: {
          orderBy: {
            id: 'asc',
          },
          include: {
            answers: {
              orderBy: {
                id: 'asc',
              },
            },
          },
        },
      },
    });

    if (!submodule) {
      throw new BadRequestException('Le quiz demande est introuvable pour ce student');
    }

    const submittedAnswers = new Map(
      answers.map((answer) => [
        Number(answer.questionId),
        new Set((answer.answerIds?.length ? answer.answerIds : [answer.answerId]).filter(Boolean).map(Number)),
      ]),
    );

    const results = submodule.questions.map((question) => {
      const selectedAnswerIds = submittedAnswers.get(question.id) ?? new Set<number>();
      const goodAnswerIds = question.answers.filter((answer) => answer.isGoodAnswer).map((answer) => answer.id);
      const isCorrect =
        selectedAnswerIds.size === goodAnswerIds.length &&
        goodAnswerIds.every((answerId) => selectedAnswerIds.has(answerId));

      return {
        questionId: question.id,
        isCorrect,
        selectedAnswerIds: [...selectedAnswerIds],
        goodAnswerIds,
      };
    });

    const answeredQuestionsCount = results.filter((result) => result.selectedAnswerIds.length > 0).length;
    const correctAnswersCount = results.filter((result) => result.isCorrect).length;
    const score = submodule.questions.length > 0 ? Math.round((correctAnswersCount / submodule.questions.length) * 100) : 0;
    const isComplete = answeredQuestionsCount === submodule.questions.length;
    const earnedElos = isComplete ? Math.round(score * 0.26) : 0;

    if (isComplete) {
      await this.prisma.$transaction(async (tx) => {
        await tx.attempt.create({
          data: {
            student_id: student.id,
            submodule_id: submodule.id,
            score,
          },
        });

        await tx.student.update({
          where: { id: student.id },
          data: {
            points: {
              increment: earnedElos,
            },
          },
        });
      });
    }

    return {
      score,
      earnedElos,
      correctAnswersCount,
      totalQuestions: submodule.questions.length,
      isComplete,
      results,
      message: isComplete ? 'Quiz termine avec succes' : 'Reponse enregistree',
    };
  }
}
