import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { SidebarDrawerComponent } from "../../shared/components/sidebar-drawer/sidebar-drawer.component";
import { Exam } from '../../shared/interfaces/exam';

@Component({
  selector: 'app-list-exam',
  imports: [SidebarDrawerComponent, ConfirmDialogModule, ToastModule,
    PaginatorModule, CommonModule
  ],
  templateUrl: './list-exam.component.html',
  styleUrl: './list-exam.component.css',
  providers: [MessageService, ConfirmationService]
})
export class ListExamComponent {
  exams: Exam[] = []; // Substitua por seus dados de provas
  totalRecords: number = 0;


  // constructor(private confirmationService: ConfirmationService, private router: Router) {}
  constructor(private router: Router) {}

  ngOnInit() {
    // Carregue os dados das provas aqui, por exemplo, de um serviço
    // this.examService.getExams().subscribe(exams => this.exams = exams);
    this.exams = this.mockExams();
  }

  trackByExamId(index: number, exam: Exam): number {
    return exam.id;
  }

  viewExam(examId: number) {
    this.router.navigate(['/exams', examId]); // Navega para a rota de visualização
  }

  editExam(examId: number) {
    this.router.navigate(['/exams/edit', examId]); // Navega para a rota de edição
  }

  // confirmDeleteExam(examId: number) {
  //   this.confirmationService.confirm({
  //     message: 'Tem certeza de que deseja excluir esta prova?',
  //     accept: () => {
  //       this.deleteExam(examId);
  //     }
  //   });
  // }

  deleteExam(examId: number) {
    // Implemente a lógica de exclusão aqui, por exemplo, chamando um serviço
    // this.examService.deleteExam(examId).subscribe(() => {
    //   // Atualize a lista de provas após a exclusão
    //   this.exams = this.exams.filter(exam => exam.id !== examId);
    // });
  }


  onPageChange(event: any) {
    // Lógica para paginação, ajuste conforme necessário
    console.log(event);
    // Atualize a lista de exames com base nos parâmetros de paginação
  }

  private mockExams(): Exam[] {
    return [
      {
        id: 1,
        title: 'Prova 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      },
      {
        id: 2,
        title: 'Prova 2',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      },
      {
        id: 3,
        title: 'Prova 3',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      },
      {
        id: 4,
        title: 'Prova 4',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      },
      {
        id: 5,
        title: 'Prova 5',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      },
      {
        id: 6,
        title: 'Prova 6',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      },
      {
        id: 7,
        title: 'Prova 7',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      },
      {
        id: 8,
        title: 'Prova 8',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      },
      {
        id: 9,
        title: 'Prova 9',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      },
      {
        id: 10,
        title: 'Prova 10',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      }
    ];
  }

}
