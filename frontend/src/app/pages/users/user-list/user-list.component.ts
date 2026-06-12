import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { LucideAngularModule } from 'lucide-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    LucideAngularModule
  ],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  searchTerm: string = '';
  currentFilterRole: string = 'todos';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  loading: boolean = true;

  currentUserId: number | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { 
    const cu = this.authService.currentUser();
    this.currentUserId = cu ? cu.id_usuario : null;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilterLogic();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilterLogic();
  }

  setFilterRole(role: string): void {
    this.currentFilterRole = role;
    this.applyFilterLogic();
  }

  private applyFilterLogic(): void {
    let filtered = [...this.users];

    // Ocultar al usuario actual de la lista por seguridad (no debería borrarse a sí mismo)
    if (this.currentUserId) {
      filtered = filtered.filter(u => u.id_usuario !== this.currentUserId);
    }

    // Filter by role
    if (this.currentFilterRole !== 'todos') {
      filtered = filtered.filter(u => u.nombre_rol.toLowerCase() === this.currentFilterRole);
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(u => 
        u.nombre_apellido.toLowerCase().includes(this.searchTerm) ||
        u.usuario_usuario.toLowerCase().includes(this.searchTerm) ||
        u.email.toLowerCase().includes(this.searchTerm)
      );
    }
    
    this.filteredUsers = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage) || 1;
  }
  
  getPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  
  changeItemsPerPage(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.itemsPerPage = Number(value);
    this.currentPage = 1;
    this.updatePagination();
  }

  deleteUser(user: User): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar al usuario ${user.nombre_apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f4c81',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary px-4',
        cancelButton: 'btn btn-danger px-4'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id_usuario).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'El usuario ha sido eliminado correctamente',
              icon: 'success',
              confirmButtonColor: '#0f4c81'
            });
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
      width: '640px',
      maxWidth: '95vw',
      panelClass: 'bootstrap-modal-container', // Custom class for Bootstrap styling
      disableClose: true,
      data: { user: user || null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
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
