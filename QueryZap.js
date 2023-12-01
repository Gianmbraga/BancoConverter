/*
    SELECT a.name, c.name, e.title
    FROM student as a
    INNER JOIN advisor as b ON a.id = b.s_id
    INNER JOIN instructor as c ON b.i_id = c.id
    INNER JOIN takes as d ON c.id = d.id
    INNER JOIN course as e ON d.course_id = e.course_id
*/

db.student.aggregate([
    {
        $lookup: {
            from: "advisor",
            localField: "id",
            foreignField: "s_id",
            as: "Supervisor"
        }
    },
    {
        $unwind: "$Supervisor"
    },
    {
        $lookup: {
            from: "instructor",
            localField: "Supervisor.i_id",
            foreignField: "id",
            as: "Professor"
        }
    },
    {
        $unwind: "$Professor"
    },
    {
        $lookup: {
            from: "takes",
            localField: "Professor.id",
            foreignField: "id",
            as: "Materias"
        }
    },
    {
        $unwind: "$Materias"
    },
    {
        $lookup: {
            from: "course",
            localField: "Materias.course_id",
            foreignField: "course_id",
            as: "Curso"
        }
    },
    {
        $unwind: "$Curso"
    },
    {
        $project: {
            _id: 0,
            NomeDoEstudante: "$name",
            NomeDoProfessor: "$Professor.name",
            TituloDoCurso: "$Curso.title"
        }
    }
])

/*
    SELECT DISTINCT
    a.building, a.room_number, d.name FROM classroom as a
    INNER JOIN section as b
	ON a.room_number = b.room_number
    INNER JOIN teaches as c
	ON b.course_id = c.course_id
    INNER JOIN instructor as d
	ON c.id = d.id
*/

db.classroom.aggregate([
    {
        $lookup:
        {
            from: "section",
            localField: "room_number",
            foreignField: "room_number",
            as: "section_docs"
        }
    },
    {
        $unwind: "$section_docs"
    },
    {
        $lookup:
        {
            from: "teaches",
            localField: "section_docs.course_id",
            foreignField: "course_id",
            as: "teaches_docs"
        }
    },
    {
        $unwind: "$teaches_docs"
    },
    {
        $lookup:
        {
            from: "instructor",
            localField: "teaches_docs.id",
            foreignField: "id",
            as: "instructor_docs"
        }
    },
    {
        $unwind: "$instructor_docs"
    },
    {
        $group: {
            _id: {
                "Predio": "$building",
                "NumeroDaSala": "$room_number",
                "NomeDoProfessor": "$instructor_docs.name"
            }
        }
    }
])

/*
    SELECT dep.dept_name, dep.budget, COUNT(s.*) as alunos, AVG(ins.salary) as sal_medio
    FROM department as dep
    INNER JOIN student as s ON s.dept_name = dep.dept_name
    INNER JOIN instructor as ins ON dep.dept_name = ins.dept_name
    GROUP BY dep.dept_name
*/

db.department.aggregate([
    {
        $lookup: {
            from: "student",
            localField: "dept_name",
            foreignField: "dept_name",
            as: "student_docs"
        }
    },
    {
        $lookup: {
            from: "instructor",
            localField: "dept_name",
            foreignField: "dept_name",
            as: "instructor_docs"
        }
    },
    {
        $unwind: "$student_docs"
    },
    {
        $unwind: "$instructor_docs"
    },
    {
        $group: {
            _id: "$dept_name",
            Departamento: { $first: "$dept_name" },
            Orcamento: { $first: "$budget" },
            Alunos: { $sum: 1 },
            SalarioMedio: { $avg: "$instructor_docs.salary" }
        }
    },
    {
        $project: {
            _id: 0,
            Departamento: 1,
            Orcamento: 1,
            Alunos: 1,
            SalarioMedio: 1
        }
    }
])

/////////// RESULTADO QUERY 1 ///////////

[
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Intro. to Computer Science'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Database System Concepts'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Intro. to Computer Science'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Game Design'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Robotics'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Database System Concepts'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'World History'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Investment Banking'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Physical Principles'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Intro. to Computer Science'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Intro. to Computer Science'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Image Processing'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Intro. to Computer Science'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Game Design'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Music Video Production'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Intro. to Computer Science'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Image Processing'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Intro. to Digital Systems'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Intro. to Computer Science'
    },
    {
      NomeDoEstudante: 'Zhang',
      NomeDoProfessor: 'Srinivasan',
      TituloDoCurso: 'Robotics'
    }
]

/////////// RESULTADO QUERY 2 ///////////

[
    {
      _id: {
        Predio: 'Watson',
        NumeroDaSala: 100,
        NomeDoProfessor: 'Einstein'
      }
    },
    {
      _id: { Predio: 'Watson', NumeroDaSala: 100, NomeDoProfessor: 'Mozart' }
    },
    {
      _id: { Predio: 'Watson', NumeroDaSala: 100, NomeDoProfessor: 'Singh' }
    },
    {
      _id: { Predio: 'Watson', NumeroDaSala: 120, NomeDoProfessor: 'Wu' }
    },
    {
      _id: { Predio: 'Taylor', NumeroDaSala: 3128, NomeDoProfessor: 'Singh' }
    },
    {
      _id: { Predio: 'Watson', NumeroDaSala: 120, NomeDoProfessor: 'Kim' }
    },
    {
      _id: { Predio: 'Taylor', NumeroDaSala: 3128, NomeDoProfessor: 'Crick' }
    },
    {
      _id: { Predio: 'Watson', NumeroDaSala: 120, NomeDoProfessor: 'Brandt' }
    },
    {
      _id: { Predio: 'Watson', NumeroDaSala: 100, NomeDoProfessor: 'Katz' }
    },
    {
      _id: { Predio: 'Taylor', NumeroDaSala: 3128, NomeDoProfessor: 'Brandt' }
    },
    {
      _id: { Predio: 'Taylor', NumeroDaSala: 3128, NomeDoProfessor: 'Katz' }
    },
    {
      _id: {
        Predio: 'Packard',
        NumeroDaSala: 101,
        NomeDoProfessor: 'Califieri'
      }
    },
    {
      _id: {
        Predio: 'Painter',
        NumeroDaSala: 514,
        NomeDoProfessor: 'Einstein'
      }
    },
    {
      _id: { Predio: 'Painter', NumeroDaSala: 514, NomeDoProfessor: 'Kim' }
    },
    {
      _id: { Predio: 'Packard', NumeroDaSala: 101, NomeDoProfessor: 'Kim' }
    },
    {
      _id: { Predio: 'Painter', NumeroDaSala: 514, NomeDoProfessor: 'Mozart' }
    },
    {
      _id: { Predio: 'Packard', NumeroDaSala: 101, NomeDoProfessor: 'Wu' }
    },
    {
      _id: { Predio: 'Watson', NumeroDaSala: 100, NomeDoProfessor: 'Wu' }
    },
    {
      _id: {
        Predio: 'Taylor',
        NumeroDaSala: 3128,
        NomeDoProfessor: 'El Said'
      }
    },
    {
      _id: { Predio: 'Packard', NumeroDaSala: 101, NomeDoProfessor: 'Gold' }
    }
]

/////////// RESULTADO QUERY 3 ///////////

[
    {
      Departamento: 'Comp. Sci.',
      Orcamento: 100000,
      Alunos: 12,
      SalarioMedio: 77333.33333333333
    },
    {
      Departamento: 'Elec. Eng.',
      Orcamento: 85000,
      Alunos: 2,
      SalarioMedio: 80000
    },
    {
      Departamento: 'Biology',
      Orcamento: 90000,
      Alunos: 1,
      SalarioMedio: 72000
    },
    {
      Departamento: 'Finance',
      Orcamento: 120000,
      Alunos: 2,
      SalarioMedio: 85000
    },
    {
      Departamento: 'Music',
      Orcamento: 80000,
      Alunos: 1,
      SalarioMedio: 40000
    },
    {
      Departamento: 'History',
      Orcamento: 50000,
      Alunos: 2,
      SalarioMedio: 61000
    },
    {
      Departamento: 'Physics',
      Orcamento: 70000,
      Alunos: 6,
      SalarioMedio: 91000
    }
]