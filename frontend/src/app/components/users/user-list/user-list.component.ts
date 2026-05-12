import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { LucideAngularModule } from 'lucide-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    LucideAngularModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id_usuario', 'usuario_usuario', 'nombre_apellido', 'email', 'nombre_rol', 'activo', 'acciones'];
  dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteUser(user: User): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar al usuario ${user.nombre_apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1E88E5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id_usuario).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El usuario ha sido eliminado correctamente', 'success');
            this.loadUsers();
          },
          error: (err) => {
            const msg = err.error?.error || 'No se pudo eliminar el usuario. Puede tener registros asociados.';
            Swal.fire('Error', msg, 'error');
          }
        });
      }
    });
  }

  openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '620px',
      disableClose: true,
      data: { user: user || null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          // Edit mode
          this.userService.updateUser(user.id_usuario, result).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'El usuario ha sido actualizado correctamente.',
                timer: 2000,
                showConfirmButton: false
              });
              this.loadUsers();
            },
            error: (err) => {
              const msg = err.error?.error || 'No se pudo actualizar el usuario.';
              Swal.fire('Error', msg, 'error');
            }
          });
        } else {
          // Create mode
          this.userService.registerUser(result).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: '¡Registrado!',
                text: 'El usuario ha sido creado correctamente.',
                timer: 2000,
                showConfirmButton: false
              });
              this.loadUsers();
            },
            error: (err) => {
              const msg = err.error?.error || 'No se pudo registrar el usuario.';
              Swal.fire('Error', msg, 'error');
            }
          });
        }
      }
    });
  }
}
