# Affichage des modules et submodules cote Student

Pour afficher les modules et submodules cote student, j'ai utilise les relations deja presentes dans Prisma.

Dans la base, un `Student` est lie a un `User`, et ce `User` est lie a une `School`.

Un `Teacher` est aussi lie a un `User`, donc lui aussi appartient a une `School`.

Les modules sont crees par les teachers:

```txt
Teacher -> Module -> Submodule
```

La regle utilisee est donc:

```txt
Un student voit les modules crees par les teachers de la meme ecole que lui.
```

## Backend

J'ai cree une feature backend:

```txt
backend/src/features/student-modules/
```

Avec trois fichiers:

```txt
student-modules.controller.ts
student-modules.service.ts
student-modules.module.ts
```

Le controller cree la route API:

```ts
@Get('student/:studentId')
getStudentModules(@Param('studentId', ParseIntPipe) studentId: number) {
  return this.studentModulesService.getStudentModules(studentId);
}
```

La route finale est:

```txt
GET /student-modules/student/:studentId
```

Exemple:

```txt
GET /student-modules/student/24
```

Le service contient la logique Prisma.

D'abord, on recupere le student et son ecole:

```ts
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
```

Le `school_id` est recupere via `user`, parce qu'il n'est pas directement dans `Student`.

Ensuite, on recupere les modules des teachers de la meme ecole:

```ts
const modules = await this.prisma.module.findMany({
  where: {
    teacher: {
      user: {
        school_id: student.user.school_id,
      },
    },
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
```

La partie la plus importante est:

```ts
teacher: {
  user: {
    school_id: student.user.school_id,
  },
}
```

Ca veut dire:

```txt
Recupere les modules dont le teacher appartient a la meme ecole que le student.
```

Ensuite, le service reformate les donnees pour le frontend:

```ts
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
```

## Frontend

Dans le frontend, les donnees sont recuperees depuis la page student avec l'utilisateur connecte.

On recupere le user connecte:

```ts
const authUser = getAuthUser();
```

Puis on appelle l'API:

```ts
const response = await fetch(
  `${VITE_API_BASE_URL}/student-modules/student/${authUser.userId}`,
);
```

La reponse est stockee dans un state React:

```ts
const [studentModules, setStudentModules] = useState<StudentModule[]>([]);
```

Quand les donnees arrivent:

```ts
const data = await response.json() as StudentModule[];
setStudentModules(data);
```

Le type utilise cote frontend est:

```ts
type StudentModule = {
  id: number;
  title: string;
  subTitle: string;
  description: string;
  teacher: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  tags: string[];
  submodules: {
    id: number;
    title: string;
    description: string;
    questionsCount: number;
  }[];
};
```

## Affichage des modules

Pour afficher les modules, on parcourt directement `studentModules`:

```tsx
{studentModules.map((module) => (
  <div key={module.id}>
    {module.title}
  </div>
))}
```

Dans la page complete `StudentModules.tsx`, les modules sont affiches sous forme de cards.

Quand on clique sur un module, on navigue vers ses submodules:

```ts
navigate(`/student/modules/${module.id}/submodules`, {
  state: { module },
});
```

## Affichage des submodules

Les submodules sont a l'interieur des modules.

La structure ressemble a ca:

```txt
Module React
  - Fetch
  - Hooks

Module Docker
  - Images
  - Containers
```

Donc pour afficher tous les submodules, on utilise `flatMap`:

```tsx
{studentModules.flatMap((module) =>
  module.submodules.map((submodule) => (
    <CcCard key={submodule.id}>
      {submodule.title}
    </CcCard>
  )),
)}
```

`flatMap` permet de transformer plusieurs listes de submodules en une seule liste affichable.

## Pages creees cote Student

J'ai ajoute deux pages:

```txt
StudentModules.tsx
StudentSubmodules.tsx
```

`StudentModules.tsx` affiche tous les modules accessibles au student.

`StudentSubmodules.tsx` affiche les submodules.

Si on arrive depuis un module precis:

```txt
/student/modules/:moduleId/submodules
```

la page affiche seulement les submodules de ce module.

Si on va directement sur:

```txt
/student/submodules
```

la page peut afficher tous les submodules accessibles.

## Routes frontend

Dans `App.tsx`, j'ai ajoute les routes protegees student:

```tsx
<Route
  path="/student/modules"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <StudentModules />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/submodules"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <StudentSubmodules />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/modules/:moduleId/submodules"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <StudentSubmodules />
    </ProtectedRoute>
  }
/>
```

Ces routes sont protegees avec:

```ts
allowedRoles={['student']}
```

Donc seuls les students connectes peuvent y acceder.

## Difference avec Teacher

J'ai repris la logique des pages teacher, mais en lecture seule.

Cote teacher:

```txt
Creer des modules
Creer des submodules
Modifier les questions
Filtrer les modules
Naviguer dans les submodules
```

Cote student:

```txt
Consulter les modules
Consulter les submodules
Filtrer les modules
Filtrer les submodules
Naviguer
```

Donc la structure est proche, mais le student ne peut pas creer ou modifier.

## Resume

Le student voit les modules grace a son ecole.

Le backend recupere:

```txt
student -> user -> school_id
```

Puis il cherche:

```txt
modules dont teacher.user.school_id = student.user.school_id
```

Ensuite il renvoie:

```txt
modules
teacher
tags
submodules
questionsCount
```

Le frontend recupere ces donnees avec `fetch`, les stocke dans `studentModules`, puis les affiche dans:

```txt
StudentHome
StudentModules
StudentSubmodules
```
